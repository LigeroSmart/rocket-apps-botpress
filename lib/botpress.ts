import { IHttp, IHttpRequest, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { AppSetting } from '../config/Settings';
import { Headers } from '../enum/Http';
import { Logs } from '../enum/Logs';
import { IbotpressMessage, IbotpressMessageV1, IbotpressQuickReplies, IbotpressQuickReply } from '../enum/botpress';
import { createHttpRequest } from './Http';
import { getAppSettingValue } from './Setting';

export const sendMessage = async (read: IRead, http: IHttp, sender: string, message: string): Promise<Array<IbotpressMessageV1> | null> => {
    const botpressServerUrl = await getAppSettingValue(read, AppSetting.botpressServerUrl);
    const botpressBotID = await getAppSettingValue(read, AppSetting.botpressBotID);
    if (!botpressServerUrl) { throw new Error(Logs.INVALID_BOTPRESS_SERVER_URL_SETTING); }
    const callbackEnabled: boolean = await getAppSettingValue(read, AppSetting.botpressEnableCallbacks);

    const httpRequestContent: IHttpRequest = createHttpRequest(
        { 'Content-Type': Headers.CONTENT_TYPE_JSON },
        {
            type: "text",
            text: message
        },
    );

    // const botpressWebhookUrl = callbackEnabled ? `${botpressServerUrl}/webhooks/callback/webhook` : `${botpressServerUrl}/webhooks/rest/webhook`;
    const botpressWebhookUrl = `${botpressServerUrl}/api/v1/bots/${botpressBotID}/converse/${sender}`;
    const response = await http.post(botpressWebhookUrl, httpRequestContent);
    if (response.statusCode !== 200) { throw Error(`${ Logs.BOTPRESS_REST_API_COMMUNICATION_ERROR } ${ response.content }`); }

    // if (!callbackEnabled) {
        console.log(JSON.stringify(response.data, null, 2));
        const parsedMessage = parsebotpressResponse(response.data.responses, sender);

        return parsedMessage;
    // }
    // return null;
};

export const parsebotpressResponse = (response: any, sender: string): Array<IbotpressMessageV1> => {
    if (!response) { throw new Error(Logs.INVALID_RESPONSE_FROM_BOTPRESS_CONTENT_UNDEFINED); }

    const messages: Array<IbotpressMessageV1> = [];

    response.forEach((message) => {
        messages.push(parseSinglebotpressMessage(message, sender));
    });

    return messages;
};

export const parseSinglebotpressMessage = (message: any, sender: string): IbotpressMessageV1 => {

    const { type, text, value, module, component, quick_replies, wrapped } = message;

    if(type === 'text'){
        // console.log(`CHEGOU ESSSSE TEXTO VIVA!!!!!!! ${text} do tipo ${type} do sender ${sender}`);
        return {
            type: type,
            text: text,
            sessionId: sender,
        };
    } else if (component === 'QuickReplies'){
        return {
            type: type,
            text: text,
            sessionId: sender,
        };
    }

    return {
        type,
        text,
        sessionId: sender,
    };
};
