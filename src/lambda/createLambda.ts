import {EMethode} from "../config/eMethode";
const baseLambda = require('./baseLambda');

exports.handler = async (event: any) => {
    return await baseLambda(event, EMethode.POST,async (dynamo: any, tableName: string) => {
        return await dynamo.put({TableName: tableName, Item: JSON.parse(event.body)})
    });
}