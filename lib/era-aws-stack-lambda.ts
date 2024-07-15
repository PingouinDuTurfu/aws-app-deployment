import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {EraAwsStackPublic} from "./era-aws-stack-public";
import {EraAwsStackUser} from "./era-aws-stack-user";
import {EraAwsStackManager} from "./era-aws-stack-manager";
import {EraAwsStackAdmin} from "./era-aws-stack-admin";
import {ETable} from "../src/config/eTable";
import {EraAwsStackDynamo} from "./era-aws-stack-dynamo";

export class EraAwsStackLambda extends cdk.Stack {

    constructor(scope: Construct, id: string,
                private readonly publicStack: EraAwsStackPublic,
                private readonly userStack: EraAwsStackUser,
                private readonly managerStack: EraAwsStackManager,
                private readonly adminStack: EraAwsStackAdmin,
                private readonly dynamoStack: EraAwsStackDynamo
        ) {
        super(scope, id, {});
        
        /* =====> Permissions <===== */
        this.dynamoStack.getTable(ETable.EVENTS)!.grantReadWriteData(this.userStack.getLambda('joinEvent')!);

        this.dynamoStack.getTable(ETable.EVENTS)!.grantReadData(this.publicStack.getLambda('getEvents')!);
        this.dynamoStack.getTable(ETable.EVENTS)!.grantReadWriteData(this.managerStack.getLambda('createEvent'));
        this.dynamoStack.getTable(ETable.EVENTS)!.grantReadWriteData(this.managerStack.getLambda('updateEvent'));
        this.dynamoStack.getTable(ETable.EVENTS)!.grantReadWriteData(this.managerStack.getLambda('deleteEvent'));

        this.dynamoStack.getTable(ETable.STOCKS)!.grantReadData(this.managerStack.getLambda('getStocks'));
        this.dynamoStack.getTable(ETable.STOCKS)!.grantReadWriteData(this.managerStack.getLambda('createStock'));
        this.dynamoStack.getTable(ETable.STOCKS)!.grantReadWriteData(this.managerStack.getLambda('updateStock'));
        this.dynamoStack.getTable(ETable.STOCKS)!.grantReadWriteData(this.managerStack.getLambda('deleteStock'));

        this.dynamoStack.getTable(ETable.USERS)!.grantReadData(this.adminStack.getLambda('getUsers'));
        this.dynamoStack.getTable(ETable.USERS)!.grantReadWriteData(this.adminStack.getLambda('updateUser'));
        this.dynamoStack.getTable(ETable.USERS)!.grantReadWriteData(this.adminStack.getLambda('createUser'));
        this.dynamoStack.getTable(ETable.USERS)!.grantReadWriteData(this.adminStack.getLambda('deleteUser'));

        this.managerStack.bucket.grantReadWrite(this.managerStack.getLambda('putObjectToBucket'));
    }
}
