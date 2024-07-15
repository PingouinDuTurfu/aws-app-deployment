import {EMethode} from "../config/eMethode";
const baseLambda = require('./baseLambda');

exports.handler = async (event: any) => {
    return await baseLambda(event, EMethode.PUT,async (dynamo: any, tableName: string) => {
        return await dynamo.update({TableName: tableName, ...JSON.parse(event.body)})
    });
}