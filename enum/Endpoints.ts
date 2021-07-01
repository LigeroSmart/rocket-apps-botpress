export interface IActionsEndpointContent {
    action: EndpointActionNames;
    sessionId: string;
    actionData?: {
        targetDepartment?: string;
        text?: string;
        type?: string;
    };
}

export enum EndpointActionNames {
    CLOSE_CHAT = 'close-chat',
    HANDOVER = 'handover',
    MESSAGE = 'message',
}
