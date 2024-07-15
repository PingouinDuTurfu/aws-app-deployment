import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {Construct} from "constructs";
import {ETable} from "../src/config/eTable";

export class EraAwsStackUser extends cdk.Stack {

    public lambdas: Map<string, NodejsFunction> = new Map<string, NodejsFunction>();

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const joinEvent = new NodejsFunction(this, 'era-joinEvent', {
            memorySize: 128,
            description: 'Join event',
            entry: 'src/lambda/updateLambda.ts',
            environment: {
                TABLE_NAME: ETable.EVENTS
            }
        });

        this.lambdas.set('joinEvent', joinEvent);
    }

    public getLambda(name: string): NodejsFunction {
        if(this.lambdas.has(name))
            return this.lambdas.get(name)!;
        throw new Error(`Lambda ${name} not found`);
    }
}