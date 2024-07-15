import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {ETable} from "../src/config/eTable";
import {AttributeType, Table} from "aws-cdk-lib/aws-dynamodb";

export class EraAwsStackDynamo extends cdk.Stack {

    tables: Map<ETable, Table> = new Map<ETable, Table>();

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.tables.set(
            ETable.EVENTS,
            new Table(this, ETable.EVENTS, {
                partitionKey: {
                    name: 'id',
                    type: AttributeType.STRING
                },
                tableName: ETable.EVENTS,
                readCapacity: 1,
                writeCapacity: 1
            })
        );

        this.tables.set(
            ETable.STOCKS,
            new Table(this, ETable.STOCKS, {
                partitionKey: {
                    name: 'id',
                    type: AttributeType.STRING
                },
                tableName: ETable.STOCKS,
                readCapacity: 1,
                writeCapacity: 1
            })
        );

        this.tables.set(
            ETable.USERS,
            new Table(this, ETable.USERS, {
                partitionKey: {
                    name: 'id',
                    type: AttributeType.STRING
                },
                tableName: ETable.USERS,
                readCapacity: 1,
                writeCapacity: 1
            })
        );
    }

    public getTable(name: ETable): Table {
        if(this.tables.has(name))
            return this.tables.get(name)!;
        throw new Error(`Table ${name} not found`);
    }
}