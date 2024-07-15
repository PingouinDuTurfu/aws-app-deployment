import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {ETable} from "../src/config/eTable";


export class EraAwsStackAdmin extends cdk.Stack {

    public lambdas: Map<string, NodejsFunction> = new Map<string, NodejsFunction>();

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const getUsers = new NodejsFunction(this, 'era-getUsers', {
            memorySize: 128,
            description: 'Get users',
            entry: 'src/lambda/getLambda.ts',
            environment: {
                TABLE_NAME: ETable.USERS
            }
        });

        const updateUser = new NodejsFunction(this, 'era-updateUser', {
            memorySize: 128,
            description: 'Update user',
            entry: 'src/lambda/updateLambda.ts',
            environment: {
                TABLE_NAME: ETable.USERS
            }
        });

        const createUser = new NodejsFunction(this, 'era-createUser', {
            memorySize: 128,
            description: 'Create user',
            entry: 'src/lambda/createLambda.ts',
            environment: {
                TABLE_NAME: ETable.USERS
            }
        });


        const deleteUser = new NodejsFunction(this, 'era-deleteUser', {
            memorySize: 128,
            description: 'Delete user',
            entry: 'src/lambda/deleteLambda.ts',
            environment: {
                TABLE_NAME: ETable.USERS
            }
        });

        this.lambdas.set('getUsers', getUsers);
        this.lambdas.set('updateUser', updateUser);
        this.lambdas.set('createUser', createUser);
        this.lambdas.set('deleteUser', deleteUser);
    }

    public getLambda(name: string): NodejsFunction {
        if(this.lambdas.has(name))
            return this.lambdas.get(name)!;
        throw new Error(`Lambda ${name} not found`);
    }
}