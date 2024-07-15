import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {EMethode} from "../config/eMethode";

const TABLE_NAME = process.env.TABLE_NAME || '';
const dynamo = DynamoDBDocument.from(new DynamoDB());

module.exports = async (event: any,  methode: EMethode, func: any) => {
    let body;
    let statusCode = 200;
    const headers = {'Content-Type': 'application/json',};

    try {
        if(!TABLE_NAME)
            throw new Error('Error missing environment variable');

        if(event.httpMethod === methode)
            body = await func(dynamo, TABLE_NAME);
        else
            throw new Error(`Unsupported method "${event.httpMethod}"`);
    } catch (err:any) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
}