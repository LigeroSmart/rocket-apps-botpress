export interface IbotpressMessageV1 {
    type: string,
    text?: string,
    value?: boolean,
    module?: string,
    component?: string,
    quick_replies?: Array<any>,
    wrapped?: any,
    sessionId?: string,
}

export interface IbotpressMessage {
    message: string | IbotpressQuickReplies;
    sessionId: string;
}

export interface IbotpressQuickReplies {
    text: string;
    quickReplies: Array<IbotpressQuickReply>;
}

export interface IbotpressQuickReply {
    title: string;
    payload: string;
}
