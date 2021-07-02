import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { BlockElementType, BlockType, IActionsBlock, IButtonElement, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { AppSetting } from '../config/Settings';
import { Logs } from '../enum/Logs';
import { IbotpressMessage, IbotpressMessageV1, IbotpressQuickReplies, IbotpressQuickReply } from '../enum/botpress';
import { getAppSettingValue } from './Setting';
import { uuid } from './Helper';

export const createbotpressMessage = async (rid: string, read: IRead,  modify: IModify, botpressMessage: IbotpressMessageV1): Promise<any> => {
    let text: string = '';
    if (botpressMessage.text) {
        text = botpressMessage.text;
    } else if ( botpressMessage.wrapped ) {
        if (botpressMessage.wrapped.text){
            text = botpressMessage.wrapped.text;
        }
    }
    const quickReplies = botpressMessage.quick_replies;

    if (text !== '' && quickReplies) {
        // botpressMessage is instanceof IbotpressQuickReplies
        const elements: Array<IButtonElement> = quickReplies.quickReplies.map((payload: IbotpressQuickReply) => ({
            type: BlockElementType.BUTTON,
            text: {
                type: TextObjectType.PLAINTEXT,
                text: payload.title,
            },
            value: payload.payload,
            actionId: uuid(),
        } as IButtonElement));

        const actionsBlock: IActionsBlock = { type: BlockType.ACTIONS, elements };
        await createMessage(rid, read, modify, { text });
        // await createMessage(rid, read, modify, { actionsBlock });
    } else {
        if (text !== ''){
            await createMessage(rid, read, modify, { text });
        }
    }
};

export const createMessage = async (rid: string, read: IRead,  modify: IModify, message: any ): Promise<any> => {
    if (!message) {
        return;
    }

    const botUserName = await getAppSettingValue(read, AppSetting.botpressBotUsername);

    if (!botUserName) {

        // this.app.getLogger().error(Logs.EMPTY_BOT_USERNAME_SETTING);
        return;
    }

    const sender = await read.getUserReader().getByUsername(botUserName);
    if (!sender) {
        // this.app.getLogger().error(Logs.INVALID_BOT_USERNAME_SETTING);
        return;
    }

    const room = await read.getRoomReader().getById(rid);
    if (!room) {
        // this.app.getLogger().error(Logs.INVALID_ROOM_ID);
        return;
    }

    const msg = modify.getCreator().startMessage().setRoom(room).setSender(sender);
    const { text, actionsBlock } = message;

    if (text) {
        msg.setText(text);
    }

    if (actionsBlock) {
        const { elements } = actionsBlock as IActionsBlock;
        msg.addBlocks(modify.getCreator().getBlockBuilder().addActionsBlock({ elements }));
    }

    return new Promise(async (resolve) => {
        modify.getCreator().finish(msg)
        .then((result) => resolve(result))
        .catch((error) => console.error(error));
    });
};

export const createLivechatMessage = async (rid: string, read: IRead,  modify: IModify, message: any, visitor: IVisitor ): Promise<any> => {
    if (!message) {
        return;
    }

    const botUserName = await getAppSettingValue(read, AppSetting.botpressBotUsername);
    if (!botUserName) {
        console.log(Logs.EMPTY_BOT_USERNAME_SETTING);
        return;
    }

    const room = await read.getRoomReader().getById(rid);
    if (!room) {
        console.log(`${ Logs.INVALID_ROOM_ID } ${ rid }`);
        return;
    }

    const msg = modify.getCreator().startLivechatMessage().setRoom(room).setVisitor(visitor);

    const { text, attachment } = message;

    if (text) {
        msg.setText(text);
    }

    if (attachment) {
        msg.addAttachment(attachment);
    }

    return new Promise(async (resolve) => {
        modify.getCreator().finish(msg)
        .then((result) => resolve(result))
        .catch((error) => console.error(error));
    });
};

export const deleteAllActionBlocks = async (modify: IModify, appUser: IUser, msgId: string): Promise<void> => {
    const msgBuilder = await modify.getUpdater().message(msgId, appUser);
    msgBuilder.setEditor(appUser).setBlocks(modify.getCreator().getBlockBuilder().getBlocks());
    return modify.getUpdater().finish(msgBuilder);
};
