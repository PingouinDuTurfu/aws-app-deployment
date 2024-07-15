import AWS = require('aws-sdk');

const BUCKET_NAME = process.env.BUCKET_NAME || '';

exports.handler = async (event: any) => {

    if(!BUCKET_NAME)
        throw new Error('Error missing environment variable');

    let body;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        if (event.httpMethod !== 'POST')
            throw new Error(`Unsupported method "${event.httpMethod}"`);

        const params = {
            Bucket: BUCKET_NAME,
            Key: event.queryStringParameters.key,
            Body: JSON.stringify(event.body)
        };

        const s3bucket = new AWS.S3({params: {Bucket: BUCKET_NAME}});

        body = s3bucket.upload(params, function (err: Error) {
            if(err)
                statusCode = 400;
                body = err.message;
        });
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