import * as cdk from "aws-cdk-lib";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Construct} from "constructs";
import {ETable} from "../src/config/eTable";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as kms from "aws-cdk-lib/aws-kms";

export class EraAwsStackManager extends cdk.Stack {

    public lambdas: Map<string, NodejsFunction> = new Map<string, NodejsFunction>();
    public bucket: s3.Bucket;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const createEvent = new NodejsFunction(this, 'era-createEvent', {
            memorySize: 128,
            description: 'Create events',
            entry: 'src/lambda/createLambda.ts',
            environment: {
                TABLE_NAME: ETable.EVENTS
            }
        });

        const updateEvent = new NodejsFunction(this, 'era-updateEvent', {
            memorySize: 128,
            description: 'Update events',
            entry: 'src/lambda/updateLambda.ts',
            environment: {
                TABLE_NAME: ETable.EVENTS
            }
        });

        const deleteEvent = new NodejsFunction(this, 'era-deleteEvent', {
            memorySize: 128,
            description: 'Delete events',
            entry: 'src/lambda/deleteLambda.ts',
            environment: {
                TABLE_NAME: ETable.EVENTS
            }
        });

        const getStocks = new NodejsFunction(this, 'era-getStocks', {
            memorySize: 128,
            description: 'Get stocks',
            entry: 'src/lambda/getLambda.ts',
            environment: {
                TABLE_NAME: ETable.STOCKS
            }
        });

        const createStock = new NodejsFunction(this, 'era-createStock', {
            memorySize: 128,
            description: 'Create stocks',
            entry: 'src/lambda/createLambda.ts',
            environment: {
                TABLE_NAME: ETable.STOCKS
            }
        });

        const updateStock = new NodejsFunction(this, 'era-updateStock', {
            memorySize: 128,
            description: 'Update stocks',
            entry: 'src/lambda/updateLambda.ts',
            environment: {
                TABLE_NAME: ETable.STOCKS
            }
        });

        const deleteStock = new NodejsFunction(this, 'era-deleteStock', {
            memorySize: 128,
            description: 'Delete stocks',
            entry: 'src/lambda/deleteLambda.ts',
            environment: {
                TABLE_NAME: ETable.STOCKS
            }
        });

        this.lambdas.set('createEvent', createEvent);
        this.lambdas.set('updateEvent', updateEvent);
        this.lambdas.set('deleteEvent', deleteEvent);

        this.lambdas.set('getStocks', getStocks);
        this.lambdas.set('createStock', createStock);
        this.lambdas.set('updateStock', updateStock);
        this.lambdas.set('deleteStock', deleteStock);

        this.bucket = new s3.Bucket(this, 'era-bucket', {
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryptionKey: new kms.Key(this, 's3BucketKMSKey'),
        });

        const putObjectToBucket = new NodejsFunction(this, 'era-putObjectToBucket', {
            memorySize: 128,
            description: 'Create bucket',
            entry: 'src/bucket/putObjectToBucket.ts',
            environment: {
                BUCKET_NAME: this.bucket.bucketName
            }
        });

        this.lambdas.set('putObjectToBucket', putObjectToBucket);
    }

    public getLambda(name: string): NodejsFunction {
        if(this.lambdas.has(name))
            return this.lambdas.get(name)!;
        throw new Error(`Lambda ${name} not found`);
    }
}