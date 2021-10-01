import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';
import { Headers, Response } from '../enum/Http';
import { Logs } from '../enum/Logs';
import { IbotpressMessage, IbotpressMessageV1 } from '../enum/botpress';
import { createHttpResponse } from '../lib/Http';
import { createbotpressMessage } from '../lib/Message';
import { parseSinglebotpressMessage } from '../lib/botpress';

export class CallbackInputEndpoint extends ApiEndpoint {
    public path = 'callback';

    public async post(request: IApiRequest,
                      endpoint: IApiEndpointInfo,
                      read: IRead,
                      modify: IModify,
                      http: IHttp,
                      persis: IPersistence): Promise<IApiResponse> {
        this.app.getLogger().info(Logs.ENDPOINT_RECEIVED_REQUEST);

        try {
            await this.processRequest(read, modify, persis, request.content, http);
            return createHttpResponse(HttpStatusCode.OK, { 'Content-Type': Headers.CONTENT_TYPE_JSON }, { result: Response.SUCCESS });
        } catch (error) {
            this.app.getLogger().error(`${ Logs.ENDPOINT_REQUEST_PROCESSING_ERROR } ${error}`);
            return createHttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, { 'Content-Type': Headers.CONTENT_TYPE_JSON }, { error: error.message });
        }
    }

    private async processRequest(read: IRead, modify: IModify, persis: IPersistence, endpointContent: any, http: IHttp) {
        const message: IbotpressMessageV1  = parseSinglebotpressMessage(endpointContent,'');

        await createbotpressMessage(message.sessionId!, read, modify, message, http);
    }
}
