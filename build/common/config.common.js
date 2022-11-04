"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEB_PANELS = exports.STORE_URL = exports.REDIRECTION_URL = exports.BASE = exports.CONFIG = exports.SYS_ERR = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
exports.SYS_ERR = {
    NODE_ENV_INVALID: 100,
    BOOTSTRAP_ERROR: 101,
    MONGO_CONN_FAILED: 103,
    REDIS_CONN_FAILED: 104
};
if (typeof process.env.NODE_ENV === 'undefined')
    process.exit(exports.SYS_ERR.NODE_ENV_INVALID);
dotenv_1.default.config({ path: `bin/.env.${process.env.NODE_ENV}` });
exports.CONFIG = {
    NODE_ENV: process.env.NODE_ENV,
    DB_URI: process.env.DB_URI,
    AMQP_URL: process.env.AMQP_URL,
    REDIS_URI: process.env.REDIS_URI,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_INDEX: process.env.REDIS_INDEX,
    APP_PORT: process.env.PORT,
    SOCKET_PORT: process.env.SOCKET_PORT,
    DB_POOLSIZE: 10,
    JWT_PASSWORD: 'qwerty',
    SYS_EMAIL: process.env.SYS_EMAIL,
    SYS_PASSWORD: process.env.SYS_PASSWORD,
    SES_EMAIL: process.env.SES_EMAIL,
    SES_PASSWORD: process.env.SES_PASSWORD,
    SES_HOST: process.env.SES_HOST,
    SES_PORT: process.env.SES_PORT,
    SES: {
        ACCESS_KEY: process.env.SES_ACCESS_KEY_ID,
        SECRET_KEY: process.env.SES_SECRET_ACCESS_KEY,
        REGION: process.env.SNS_REGION
    },
    LINKEDIN: {
        AUTH_URL: process.env.AUTH_URL,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        CLIENT_ID: process.env.CLIENT_ID,
        USER_INFO_URL: process.env.USER_INFO_URL,
        USER_EMAIL_URL: process.env.USER_EMAIL_URL
    },
    FCM_PHOTOLOOT_JSON: 'bin/photoloot.json',
    AWS: {
        BUCKET: process.env.AWS_BUCKET,
        ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        SECRET_KEY: process.env.AWS_SECRET_KEY,
        REGION: process.env.AWS_REGION,
        BASE_URL: process.env.AWS_URL + process.env.AWS_BUCKET + '/'
    },
    SNS: {
        ACCESS_KEY: process.env.SNS_ACCESS_KEY_ID,
        SECRET_KEY: process.env.SNS_SECRET_ACCESS_KEY,
        REGION: process.env.SNS_REGION
    },
    FCM: {
        SERVER_KEY: process.env.FCM_SERVER_KEY
    },
    STRIPE: {
        SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        API_VERSION: process.env.API_VERSION
    },
    GOOGLE_CALENDAR: {
        SECRET_KEY: process.env.GOOGLE_CLIENT_SECRET,
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        REDIRECT_URI: process.env.GOOGLE_REDIRECT_URIS,
        USER_REDIRECT_URI: process.env.GOOGLE_USER_REDIRECT_URIS
    },
    SLACK_TOKEN: process.env.SLACK_USER_TOKEN,
    S3: {
        ACCESS_KEY: process.env.S3_ACCESS_KEY_ID,
        SECRET_KEY: process.env.S3_SECRET_ACCESS_KEY,
    },
    OUTLOOK: {
        OAUTH_APP_ID: process.env.OAUTH_APP_ID,
        OAUTH_APP_SECRET: process.env.OAUTH_APP_SECRET,
        OAUTH_REDIRECT_HOST_URI: process.env.OAUTH_REDIRECT_HOST_URI,
        OAUTH_REDIRECT_USER_URI: process.env.OAUTH_REDIRECT_USER_URI,
        OAUTH_SCOPES: process.env.OAUTH_SCOPES,
        OAUTH_AUTHORITY: process.env.OAUTH_AUTHORITY,
    }
};
exports.BASE = {
    URL: process.env.BASE_URL,
    ADMIN: process.env.BASE_ADMIN_URL,
    EMAIL_URL: process.env.BASE_URL + "/api/user",
    HOST_EMAIL_URL: process.env.BASE_URL + "/api/host",
    APP_URL: process.env.APP_URL,
    HOST_URL: process.env.HOST_URL,
    AWS: {
        IMAGE_PATH: 'desk_new/images/',
        AR_MODEL_PATH: 'desk_new/models/',
        INVOICE_PATH: 'desk_now/invoices/'
    },
    ANDROID: process.env.ANDROID_URL
};
exports.REDIRECTION_URL = {
    ADNROID_URL_USER: 'deskseeker://com.desknow.user',
    IOS_URL_USER: 'desknowseeker://com.desknow.user/',
    ADNROID_URL_HOST: 'deskhost://com.desknow.host',
    IOS_URL_HOST: 'desknowhost://com.desknow/'
};
exports.STORE_URL = {
    PLAYSOTE_USER: 'https://play.google.com/store/apps/details?id=com.desknow.user',
    APPSTORE_USER: 'https://apps.apple.com/us/app/desknow/id1529222764?ign-mpt=uo%3D2',
    PLAYSTORE_HOST: 'https://play.google.com/store/apps/details?id=com.desknow.host',
    APPSTORE_HOST: 'https://apps.apple.com/us/app/pam-by-desknow/id1529556888'
};
exports.WEB_PANELS = {
    USER_PANEL_DEV: `https://desknowuserdev.appskeeper.com/`,
    HOST_PANEL_DEV: `https://desknowhostdev.appskeeper.com/`,
    USER_PANEL_QA: `https://desknowuserqa.appskeeper.com/`,
    HOST_PANEL_QA: `https://desknowhostqa.appskeeper.com/`,
    USER_PANEL_STAGING: `https://desknowuserstg.appskeeper.com/`,
    HOST_PANEL_STAGING: `https://desknowhoststg.appskeeper.com/`,
    USER_PANEL_PROD: `https://bookings.desk-now.com`,
    HOST_PANEL_PROD: `https://app.desk-now.com`,
    USER_SIGNUP: `https://bookings.desk-now.com/account/signup`,
    FB_URL: `https://www.facebook.com/DeskNow-110955887345222`,
    INSTA_URL: `https://www.instagram.com/desk_now/`,
    LINKEDIN_URL: `https://www.linkedin.com/company/desknow/`,
    TWITTER_URL: `https://twitter.com/Desknow3`,
    CONTACT_US_STAGING: `https://desknowuserstg.appskeeper.com/content/contact-us`,
    CONTACT_US_PROD: `https://bookings.desk-now.com/content/contact-us`,
    FAQ_STAGING: `https://desknowuserstg.appskeeper.com/content/faq`,
    FAQ_PROD: `https://bookings.desk-now.com/content/faq`,
    CONTACT_US_HOST_STAGING: `https://desknowhoststg.appskeeper.com/content/contact-us`,
    CONTACT_US_PAM_PROD: `https://app.desk-now.com/content/contact-us`,
    FAQ_HOST_STAGING: `https://desknowhoststg.appskeeper.com/content/faq`,
    FAQ_PAM_PROD: `https://app.desk-now.com/content/faq`,
    PAM_FB_URL: `https://www.facebook.com/desknowgmbh/`,
    PAM_INSTA_URL: `https://www.instagram.com/pam_by_desknow/`,
    PAM_LINKEDIN_URL: `https://www.linkedin.com/company/desknow/`,
    PAM_TWITTER_URL: `https://twitter.com/pam_by_DeskNow`,
    USER_PANEL_DEEP_LINK__API_BASE_URL: `${process.env.BASE_URL}/api/user/deeplink/`
};
//# sourceMappingURL=config.common.js.map