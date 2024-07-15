import {EMethode} from "../config/eMethode";
const baseLambda = require('./baseLambda');

exports.handler = async (event: any) => {
    return await baseLambda(event, EMethode.GET,async (dynamo: any, tableName: string) => {
        return await dynamo.scan({TableName: tableName})
    });
}