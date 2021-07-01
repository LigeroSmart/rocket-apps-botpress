import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { AppSetting, settings } from './config/Settings';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { ILivechatMessage } from '@rocket.chat/apps-engine/definition/livechat';
import { IPostMessageSent } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { PostMessageSentHandler } from './handler/PostMessageSentHandler';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { IncomingEndpoint } from './endpoints/IncomingEndpoint';
import { CallbackInputEndpoint } from './endpoints/CallbackInputEndpoint';
import { IPreRoomUserJoined, IRoomUserJoinedContext } from '@rocket.chat/apps-engine/definition/rooms';
export class LigeroSmartBotpressApp extends App implements IPostMessageSent, IPreRoomUserJoined {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executePostMessageSent(message: ILivechatMessage,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify): Promise<void> {
        const handler = new PostMessageSentHandler(this, message, read, http, persis, modify);
        await handler.run();
    }

    public async executePreRoomUserJoined(context: IRoomUserJoinedContext,
                                    read: IRead,
                                    http: IHttp,
                                    persistence: IPersistence): Promise<void> {
        // @TODO: reset wakeup bot variable
        // const user = context.joiningUser.username;
        // if (user && user === AppSetting.botpressBotUsername) {
        //     console.log('test')
        // }

    }
    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [
                new IncomingEndpoint(this),
                // new CallbackInputEndpoint(this),
            ],
        });
        await Promise.all(settings.map((setting) => configuration.settings.provideSetting(setting)));
    }
}
