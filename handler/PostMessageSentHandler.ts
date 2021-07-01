import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { ILivechatMessage, ILivechatRoom, IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { UserType } from '@rocket.chat/apps-engine/definition/users';
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

        const { id: rid, type, servedBy, isOpen, customFields } = livechatRoom;

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

        const wakeup: boolean = await getAppSettingValue(this.read, AppSetting.botpressEnableWakeupMessage);
        const wakeupMessage: string = await getAppSettingValue(this.read, AppSetting.botpressWakeupMessage) || 'Start';

        const visitorToken = livechatRoom.visitor.token;

        let bp_target = rid;
        bp_target = bp_target + ':' + visitorToken;
        if(wakeup){
            // check if bot was previously awaked
            let shouldWakeup: boolean = false;
            if (customFields){
                const alreadyWakedup = customFields.botpressAwaked;
                if (!alreadyWakedup){
                    shouldWakeup = true;
                }
            } else {
                shouldWakeup = true;
            }
            if (shouldWakeup) {
                let wakeupResponse: Array<IbotpressMessageV1> | null;
                try {
                    wakeupResponse = await sendMessage(this.read, this.http, bp_target, wakeupMessage);
                } catch {
                    console.log('Erro sending wakeup message to Botpress');
                }
                const roomUp = await this.modify.getExtender().extendRoom(rid, sender);
                roomUp.addCustomField('botpressAwaked', 'true');
                this.modify.getExtender().finish(roomUp);
            }
        }

        let response: Array<IbotpressMessageV1> | null;
        try {
            response = await sendMessage(this.read, this.http, bp_target, text);
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
