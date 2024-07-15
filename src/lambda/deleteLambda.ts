import {EMethode} from "../config/eMethode";
const baseLambda = require('./baseLambda');

exports.handler = async (event: any) => {
    return await baseLambda(event, EMethode.DELETE,async (dynamo: any, tableName: string) => {
        return await dynamo.delete({TableName: tableName, ...JSON.parse(event.body)})
    });
}