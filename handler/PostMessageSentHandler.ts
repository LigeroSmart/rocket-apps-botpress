import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { ILivechatMessage, ILivechatRoom } from '@rocket.chat/apps-engine/definition/livechat';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { AppSetting, DefaultMessage } from '../config/Settings';
import { IbotpressMessage, IbotpressMessageV1 } from '../enum/botpress';
import { Logs } from '../enum/Logs';
import { sendMessage } from '../lib/botpress';
import { createbotpressMessage, createMessage } from '../lib/Message';
// import { Logs } from '../enum/Logs';
// import { IbotpressMessage } from '../enum/botpress';
// import { createMessage, createbotpressMessage } from '../lib/Message';
// import { sendMessage } from '../lib/botpress';
import { getAppSettingValue } from '../lib/Setting';

export class PostMessageSentHandler {
    constructor(private app: IApp,
                private message: ILivechatMessage,
                private read: IRead,
                private http: IHttp,
                private persis: IPersistence,
                private modify: IModify) {}

    public async run() {

        const { text, editedAt, room, token, sender } = this.message;
        const livechatRoom = room as ILivechatRoom;

        const { id: rid, type, servedBy, isOpen } = livechatRoom;

        const botpressBotUsername: string = await getAppSettingValue(this.read, AppSetting.botpressBotUsername);

        if (!type || type !== RoomType.LIVE_CHAT) {
            return;
        }

        if (!isOpen || !token || editedAt || !text) {
            return;
        }

        if (!servedBy || servedBy.username !== botpressBotUsername) {
            return;
        }

        if (sender.username === botpressBotUsername) {
            return;
        }

        if (!text || (text && text.trim().length === 0)) {
            return;
        }

        let response: Array<IbotpressMessageV1> | null;
        try {
            response = await sendMessage(this.read, this.http, rid, text);
        } catch (error) {
            this.app.getLogger().error(`${ Logs.BOTPRESS_REST_API_COMMUNICATION_ERROR } ${error.message}`);

            const serviceUnavailable: string = await getAppSettingValue(this.read, AppSetting.botpressServiceUnavailableMessage);
            await createMessage(rid, this.read, this.modify, {
                text: serviceUnavailable ? serviceUnavailable : DefaultMessage.DEFAULT_botpressServiceUnavailableMessage,
            });

            return;
        }

        if (response) {
            for (const message of response) {
                await createbotpressMessage(rid, this.read, this.modify, message);
            }
        }
    }
}
