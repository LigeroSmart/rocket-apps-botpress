import { ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    botpressBotUsername = 'ligerosmart-botpress_bot',
    botpressServerUrl = 'botpress_server_url',
    botpressBotID = 'botpress_bot_id',
    botpressServiceUnavailableMessage = 'botpress_service_unavailable_message',
    botpressHandoverMessage = 'botpress_handover_message',
    botpressCloseChatMessage = 'botpress_close_chat_message',
    botpressEnableCallbacks = 'botpress_enable_callbacks',
    botpressEnableWakeupMessage = 'botpress_enable_wakeup',
    botpressWakeupMessage = 'botpress_wakeup_message',
    botpressDefaultHandoverDepartment = 'botpress_target_handover_department',
    botpressHideQuickReplies = 'botpress_hide_quick_replies',
    botpressTelegramBot = 'botpress_telegram_bot',
}

export enum DefaultMessage {
    DEFAULT_botpressServiceUnavailableMessage = 'Sorry, I\'m having trouble answering your question.',
    DEFAULT_botpressHandoverMessage = 'Transferring to an online agent',
    DEFAULT_botpressCloseChatMessage = 'Closing the chat, Goodbye',
    DEFAULT_botpressWakeupMessage = 'Starting chat',
}

export const settings: Array<ISetting> = [
    {
        id: AppSetting.botpressBotUsername,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'bot_username',
        required: true,
    },
    {
        id: AppSetting.botpressBotID,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_bot_id',
        required: true,
    },
    {
        id: AppSetting.botpressServerUrl,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_server_url',
        required: true,
    },
    {
        id: AppSetting.botpressServiceUnavailableMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_service_unavailable_message',
        i18nDescription: 'botpress_service_unavailable_message_description',
        required: false,
    },
    {
        id: AppSetting.botpressCloseChatMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_close_chat_message',
        i18nDescription: 'botpress_close_chat_message_description',
        required: false,
    },
    {
        id: AppSetting.botpressHandoverMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_handover_message',
        i18nDescription: 'botpress_handover_message_description',
        required: false,
    },
    {
        id: AppSetting.botpressDefaultHandoverDepartment,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'botpress_default_handover_department',
        i18nDescription: 'botpress_default_handover_department_description',
        required: true,
    },
    {
        id: AppSetting.botpressEnableCallbacks,
        public: true,
        type: SettingType.BOOLEAN,
        packageValue: false,
        value: false,
        i18nLabel: 'botpress_callback_message',
        i18nDescription: 'botpress_callback_message_description',
        required: true,
    },
    {
        id: AppSetting.botpressEnableWakeupMessage,
        public: true,
        type: SettingType.BOOLEAN,
        packageValue: false,
        value: false,
        i18nLabel: 'botpress_enable_wakeup',
        i18nDescription: 'botpress_enable_wakeup_description',
        required: true,
    },
    {
        id: AppSetting.botpressWakeupMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: 'Starting chat',
        i18nLabel: 'botpress_enable_wakeup_message',
        i18nDescription: 'botpress_enable_wakeup_message_description',
        required: true,
    },
    {
        id: AppSetting.botpressHideQuickReplies,
        public: true,
        type: SettingType.BOOLEAN,
        packageValue: true,
        value: true,
        i18nLabel: 'botpress_hide_quick_replies',
        i18nDescription: 'botpress_hide_quick_replies_description',
        required: true,
    },
    {
        id: AppSetting.botpressTelegramBot,
        public: true,
        type: SettingType.STRING,
        packageValue: undefined,
        i18nLabel: 'botpress_telegram_bot',
        i18nDescription: 'botpress_telegram_desc',
        required: false,
    },
];
