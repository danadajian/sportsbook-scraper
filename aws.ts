import * as AWS from 'aws-sdk';
import './env'

AWS.config.credentials = new AWS.Credentials(process.env.AWS_KEY, process.env.AWS_SECRET);
export const Lambda = new AWS.Lambda({region: 'us-east-2'});

export const invokeLambdaFunction = async (functionName: any, payload: any = {}) => {
    const params = {
        FunctionName: functionName,
        Payload: JSON.stringify(payload)
    };

    const response: any = await Lambda.invoke(params).promise();
    return JSON.parse(response.Payload.toString());
};
