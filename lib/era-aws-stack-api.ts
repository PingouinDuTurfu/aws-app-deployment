import * as cdk from "aws-cdk-lib";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import {Construct} from "constructs";
import {EraAwsStackPublic} from "./era-aws-stack-public";
import {EraAwsStackUser} from "./era-aws-stack-user";
import {EraAwsStackManager} from "./era-aws-stack-manager";
import {EraAwsStackAdmin} from "./era-aws-stack-admin";
import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';
import { ETable } from "../src/config/eTable";
import {EraAwsStackDynamo} from "./era-aws-stack-dynamo";

export class EraAwsStackApi extends cdk.Stack {

    api: RestApi;
    userPool: cognito.UserPool;
    userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, id: string,
                private readonly publicStack: EraAwsStackPublic,
                private readonly userStack: EraAwsStackUser,
                private readonly managerStack: EraAwsStackManager,
                private readonly adminStack: EraAwsStackAdmin,
                private readonly dynamoStack: EraAwsStackDynamo
    ) {
        super(scope, id, {});
       
        this.userPool = new cognito.UserPool(this, 'era-userPool', {
            selfSignUpEnabled: true,
            autoVerify: { email: true },
            signInAliases: { email: true }
        });

        this.userPoolClient = this.userPool.addClient('era-userPoolClient', {
            authFlows: {
                userPassword: true,
                userSrp: true
            }
        });

        const identityPool = new cognito.CfnIdentityPool(this, 'era-IdentityPool', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        });

        const adminRole = new iam.Role(this, 'era-admin', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
                'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' }
            }, 'sts:AssumeRoleWithWebIdentity')
        });

        const managerRole = new iam.Role(this, 'era-manager', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
                'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' }
            }, 'sts:AssumeRoleWithWebIdentity')
        });

        const userRole = new iam.Role(this, 'era-user', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
                'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' }
            }, 'sts:AssumeRoleWithWebIdentity')
        });

        /* Policies */
        adminRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['dynamodb:*'],
            resources: [
                this.dynamoStack.getTable(ETable.EVENTS).tableArn,
                this.dynamoStack.getTable(ETable.STOCKS).tableArn,
                this.dynamoStack.getTable(ETable.USERS).tableArn
            ]
        }));

        managerRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['dynamodb:*'],
            resources: [
                this.dynamoStack.getTable(ETable.EVENTS).tableArn,
                this.dynamoStack.getTable(ETable.STOCKS).tableArn
            ]
        }));

        userRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['dynamodb:Scan'],
            resources: [
                this.dynamoStack.getTable(ETable.EVENTS).tableArn
            ]
        }));

        new cognito.CfnUserPoolGroup(this, 'era-AdminGroup', {
            groupName: 'Admin',
            userPoolId: this.userPool.userPoolId,
            roleArn: adminRole.roleArn
        });

        new cognito.CfnUserPoolGroup(this, 'era-ManagerGroup', {
            groupName: 'Manager',
            userPoolId: this.userPool.userPoolId,
            roleArn: managerRole.roleArn
        });

        new cognito.CfnUserPoolGroup(this, 'era-UserGroup', {
            groupName: 'User',
            userPoolId: this.userPool.userPoolId,
            roleArn: userRole.roleArn
        });

        this.api = new RestApi(this, 'era-api', { restApiName: 'era-api' });

        const cognitoAuthorizer = new cdk.aws_apigateway.CfnAuthorizer(this, 'CognitoAuthorizer', {
            restApiId: this.api.restApiId,
            providerArns: [this.userPool.userPoolArn],
            type: 'COGNITO_USER_POOLS',
            identitySource: 'method.request.header.Authorization',
            name: 'CognitoAuthorizer'
        });

        /* Public */
        this.api.root.addMethod('GET', new LambdaIntegration(this.publicStack.getLambda('getEvents')!));

        /* User */
        const userResource = this.api.root.addResource('user');
        userResource.addMethod('POST', new LambdaIntegration(this.userStack.getLambda('joinEvent')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });

        /* Manager */
        const managerResource = this.api.root.addResource('manager');
        const managerEventResource = managerResource.addResource('event');
        const managerStockResource = managerResource.addResource('stock');

        managerEventResource.addMethod('POST', new LambdaIntegration(this.managerStack.getLambda('createEvent')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
        managerEventResource.addMethod('PUT', new LambdaIntegration(this.managerStack.getLambda('updateEvent')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
        managerEventResource.addMethod('DELETE', new LambdaIntegration(this.managerStack.getLambda('deleteEvent')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });

        managerStockResource.addMethod('GET', new LambdaIntegration(this.managerStack.getLambda('getStocks')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
        managerStockResource.addMethod('POST', new LambdaIntegration(this.managerStack.getLambda('createStock')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
        managerStockResource.addMethod('PUT', new LambdaIntegration(this.managerStack.getLambda('updateStock')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
        managerStockResource.addMethod('DELETE', new LambdaIntegration(this.managerStack.getLambda('deleteStock')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });

        /* Admin */
        const adminResource = this.api.root.addResource('admin');

        adminResource.addMethod('GET', new LambdaIntegration(this.adminStack.getLambda('getUsers')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
        adminResource.addMethod('POST', new LambdaIntegration(this.adminStack.getLambda('createUser')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
        adminResource.addMethod('PUT', new LambdaIntegration(this.adminStack.getLambda('updateUser')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
        adminResource.addMethod('DELETE', new LambdaIntegration(this.adminStack.getLambda('deleteUser')!), {
            authorizer: { authorizerId: cognitoAuthorizer.ref }
        });
    }
}