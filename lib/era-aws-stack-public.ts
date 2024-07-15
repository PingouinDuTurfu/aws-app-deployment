import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {ETable} from "../src/config/eTable";

export class EraAwsStackPublic extends cdk.Stack {
    
    public lambdas: Map<string, NodejsFunction> = new Map<string, NodejsFunction>();
    
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const getEvents = new NodejsFunction(this, 'era-getEvents', {
            memorySize: 128,
            description: 'Get events',
            entry: 'src/lambda/getLambda.ts',
            environment: {
                TABLE_NAME: ETable.EVENTS
            }
        });

        this.lambdas.set('getEvents', getEvents);
    }

    public getLambda(name: string): NodejsFunction {
        if(this.lambdas.has(name))
            return this.lambdas.get(name)!;
        throw new Error(`Lambda ${name} not found`);
    }
}