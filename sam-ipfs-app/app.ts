import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Web3Storage, File } from 'web3.storage';

interface GoodsOrRealEstate {
    name: string;
    description: string;
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    try {
        if (!event.body) throw Error();
        const client = new Web3Storage({ token: String(process.env.WEB3_STORAGE_API_KEY) });
        const goodsOrRealEstate: GoodsOrRealEstate = JSON.parse(event.body);

        const buffer = Buffer.from(JSON.stringify(goodsOrRealEstate));

        const files = [new File([buffer], 'data.json')];
        const cid = await client.put(files);

        response = {
            statusCode: 200,
            body: JSON.stringify({
                cid,
            }),
        };
    } catch (err: unknown) {
        console.error(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }

    return response;
};
