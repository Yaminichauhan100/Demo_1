"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE = exports.BOOKING_REQUEST_STATUS = exports.PROPERTY_STATUS = exports.URL = exports.ENVIRONMENT = exports.CONSTANT = void 0;
const config_common_1 = require("./config.common");
const moment_1 = __importDefault(require("moment"));
exports.CONSTANT = {
    PASSWORD_HASH_SALT: "JBDuwwuhd232QYWBXSKHCNKWBwgyew87635",
    EMAIL_TEMPLATES: process.cwd() + `/src/Mailer/`,
    PLACEHOLDER: "https://desk-now-live.s3-eu-west-1.amazonaws.com/imgpsh_fullsize_anim.png",
    NOTIFICATION_BATCH_SIZE: 1000,
    VERIFICATION_TEMPLATES: process.cwd() + `/src/views/emailVerification/`,
    VERIFICATION_TEMPLATES_HOST: process.cwd() + `/src/views/hostEmailVerification/`,
    OUTLOOK_BASE_URL: process.cwd() + `/src/views/outlookRoutes/`,
    VERIFICATION_TEMP: process.cwd() + `/src/views/`,
    VERIFY_EMAIL_LOGO: `${config_common_1.BASE.URL}/images/logo.png`,
    VERIFY_EMAIL_BG: `${config_common_1.BASE.URL}/images/login-bg.png`,
    GIFT_CARD_LOGO: `${config_common_1.BASE.URL}/images/giftCardBg.jpg`,
    GIFT_CARD_BG: `${config_common_1.BASE.URL}/images/giftCardLogo.png`,
    ADDRESS_PIN: `${config_common_1.BASE.URL}/images/addressPin.svg`,
    LINKEDIN_ICON: `${config_common_1.BASE.URL}/images/linkedinLogo.png`,
    ADD_PROPERTY_SAMPLE: `${config_common_1.BASE.URL}/files/AddClaimedPropertySample.xlsx`,
    CLAIMED_STATIC_IMAGES: [
        `${config_common_1.BASE.URL}/images/propertyPlaceHolder11.svg`,
        `${config_common_1.BASE.URL}/images/propertyPlaceHolder11.svg`
    ],
    APP_STORE_BADGE: `${config_common_1.BASE.URL}/images/App_Store_Badge_US_Black.png`,
    COMPLEMENTRAY_2: `${config_common_1.BASE.URL}/images/complementary2_1.jpg`,
    FACEBOOK_LOGO_PNG: `${config_common_1.BASE.URL}/images/facebookLogo.png`,
    GOOGLE_PLAY_BADGE: `${config_common_1.BASE.URL}/images/Google_Play_Badge_US.png`,
    INSTAGRAM_LOGO: `${config_common_1.BASE.URL}/images/instagramLogo.png`,
    LINKEDIN_LOGO: `${config_common_1.BASE.URL}/images/linkedinLogo.png`,
    MOCKUPER_6: `${config_common_1.BASE.URL}/images/mockuper_6.png`,
    PEXELS_COTTONBRO: `${config_common_1.BASE.URL}/images/pexels-cottonbro-3201783.jpg`,
    PEXELS_DARIA: `${config_common_1.BASE.URL}/images/pexels-daria-shevtsova-1467435.jpg`,
    PEXELS_PEW: `${config_common_1.BASE.URL}/images/pexels-pew-nguyen-244133.jpg`,
    TWITTER_LOGO_NEW: `${config_common_1.BASE.URL}/images/twitterLogo.png`,
    BANNER_PNG: `${config_common_1.BASE.URL}/images/banner.png`,
    SPLASH_LOGO: `${config_common_1.BASE.URL}/images/splash.svg`,
    PAM_LOGO: `${config_common_1.BASE.URL}/images/Pamlogo.png`,
    FACEBOOK_LOGO: `${config_common_1.BASE.URL}/images/facebook.svg`,
    IG_LOGO: `${config_common_1.BASE.URL}/images/instagramLogo.png`,
    ASSETS_PATH: process.env + "./asset",
    MIN_EVENT_START_TIME: new Date(new Date().getTime() + 55 * 60 * 1000).toISOString(),
    MIN_EVENT_DURATION: 30,
    OTP_EXPIRY_LIMIT: 2 * 60 * 1000,
    FALLBACK: "http://www.desk-now.com/",
    PAM_FALLBACK: "${WEB_PANELS.HOST_PANEL_PROD}/",
    IOS_LINK: "desknowseeker://com.desknow/",
    IOS_STORE_LINK: "https://apps.apple.com/us/app/desknow/id1529222764?ign-mpt=uo%3D2https://apps.apple.com/us/app/desknow/id1529222764?ign-mpt=uo%3D2",
    ANDROID_LINK: "deskseeker://com.desknow/",
    ANDROID_PACKAGE_NAME: "com.desknow.user",
    BY_PASS_OTP: '4321',
    PAM_IOS_LINK: "desknowhost://com.desknow/",
    PAM_IOS_STORE_LINK: "https://apps.apple.com/in/app/pam-by-desknow/id1529556888",
    PAM_ANDROID_LINK: "deskhost://com.desknow/",
    PAM_ANDROID_PACKAGE_NAME: "com.desknow.host",
    BASIC_USER_CARS_LIMIT: 1,
    BASIC_USER_IMAGE_LIMIT: 9,
    ELITE_USER_IMAGE_LIMIT: 16,
    MAP_VIEW_EVENTS_DISTANCE: 25 * 1000,
    FAV_ACTION: {
        ADD: 1,
        REMOVE: 0
    },
    PROPERTY_USER_TYPE: {
        USER: 1,
        EMPLOYEE: 2
    },
    FAQ_ACTION: {
        ACTIVE: 1,
        INACTIVE: 2
    },
    FAQ_SORT_ORDER_ACTION: {
        QUESTION: 'question',
        ANSWER: 'answer'
    },
    ADMIN_TAXES_LEVEL: {
        COUNTRY: 1,
        STATE: 2
    },
    TANDC: {
        TERMSANDCONDITION: 1,
        PRIVACYPOLICY: 2,
        ABOUTUS: 3,
        FAQ: 4,
        STORY: 5,
        TEAM: 6
    },
    TANDC_EDITOR: {
        EDITOR: 1,
        EDIT_HTML: 2
    },
    TANDCDEFAULT: {
        TERMSANDCONDITION: 'Please Enter Terms And Condition',
        PRIVACYPOLICY: 'Please Enter Privacy Policy',
        ABOUTUS: 'Please fill AboutUs'
    },
    FAV_BOOKING_ACTION: {
        PREVIOUS: 0,
        NEVER: 1
    },
    BOOKING: {
        REQUEST: 0,
        ACCEPTED: 1,
        REJECTED: 2,
        OFFLINE: 3,
        HISTORY: 4,
        ONLINE: 5,
        UPCOMING: 6,
        ONGOING: 7,
        ALL: 8,
        STATUS: { ONGOING: 0, COMPLETED: 1, CANCELLED: 2, REJECTED: 4, ABANDONED: 5, ACCEPTED: 6 },
    },
    PAYMENT_TYPE: {
        PENDING: 0,
        SETTLED: 1,
        TOTAL: 2
    },
    BOOKING_HOST_SORT: {
        AUTO: 0,
        MANUAL: 1,
        ALL: 2
    },
    BOOKING_REQUEST_STATUS: {
        ACCEPT: 0,
        REJECT: 1
    },
    BOOKING_SORT_KEY: {
        USERNAME: 0,
        PROPERTYNAME: 1,
        AMOUNT: 2,
    },
    SEARCH_TYPE: {
        HOSTNAME: 0,
        BOOKINGID: 1,
        PROPERTYID: 2,
    },
    STATUS: {
        ACTIVE: 'active',
        INACRIVE: 'inactive',
        ARCHIVE: 'archive',
        DELETED: 'deleted'
    },
    CALENDER_STATICS: {
        MONTH: 30,
        YEAR: 365,
        TOTAL_MONTHS: 12
    },
    TAXES: {
        BASIC: 0,
        DIVISOR: 100
    },
    EMAILER_URLS: {
        WEB_PANEL: config_common_1.CONFIG.NODE_ENV === 'stag' ? config_common_1.WEB_PANELS.HOST_PANEL_STAGING : config_common_1.WEB_PANELS.HOST_PANEL_PROD,
        CONTACT_US: config_common_1.CONFIG.NODE_ENV === 'stag' ? config_common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : config_common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
        FAQUrl: config_common_1.CONFIG.NODE_ENV === 'stag' ? config_common_1.WEB_PANELS.FAQ_HOST_STAGING : config_common_1.WEB_PANELS.FAQ_PAM_PROD,
    }
};
exports.ENVIRONMENT = {
    PRODUCTION: `production`,
    DEVELOPMENT: `development`,
    DEFAULT: 'default'
};
exports.URL = {
    DEV: 'https://desknowuserdev.appskeeper.com/'
};
exports.PROPERTY_STATUS = {
    ACTIVATE: 'active',
    DEACTIVATE: 'deactive',
    ARCHIVE: 'archive',
    INACTIVATE: 'inactive',
    ISDELETE: 'isDelete'
};
exports.BOOKING_REQUEST_STATUS = {
    ACCEPT: 0,
    REJECT: 1
};
exports.DATABASE = {
    ACTIVE: 'active',
    FORMATED_RESPONSE_TYPE: {
        VERIFY_OTP: 'verify_otp'
    },
    MONGO_TTL: {
        EXPIRED_OTP: 120
    },
    REDIS: {
        EXP_TIME: 6000,
        OTP_EXPIRED_TIME: 60,
        RESET_TOKEN_EMAIL: 60 * 60,
        KEY_NAMES: {
            DYNAMIC_PRICE_LABEL: 'dynamic-price-label',
            CATEGORY_AMENITIES: 'categories-amenities',
            CATEGORY_SUBACTEGORIES_HASH: 'categories-subcategories',
            AMENITIES_HASH: 'amenities',
            LIKE_COUNT: "likeCount",
            SCHEDULE: "SCHEDULE",
            EXPIRE: "EXPIRE",
            IP: "ip",
            DISCONNECT: "DISCONNECT",
            DEVICE_TOKEN_HASH: 'session',
            OTP_HASH: 'phone-otp',
            SOCKET_ID: 'socket',
            USER_MAP: 'user-map',
            RADIUS: 10,
            RADIUSUNIT: 'km',
            COUNT: 1,
            APP_CONFIG: 'app-config'
        }
    },
    DATE_CONSTANTS: {
        monthStart: (month, year) => { return moment_1.default().year(year).month(month - 1).startOf('month').toDate(); },
        monthEnd: (month, year) => { return moment_1.default().year(year).month(month - 1).endOf('month').toDate(); },
        yearStart: (year) => { return moment_1.default().year(year).startOf('year').toDate(); },
        yearEnd: (year) => { return moment_1.default().year(year).endOf('year').toDate(); },
        nextYear: (offset) => { return moment_1.default().utcOffset(Math.floor(offset / 60000)).add(1, 'y').toDate(); },
        deleteOn: (days) => { return moment_1.default().utcOffset(0).add(days, 'd').toDate(); },
        toUtc: (date) => { return moment_1.default(date).toDate(); },
        addDurationToDate: (date, duration, type) => { return moment_1.default(date).add(duration, type).toDate(); },
        subtractMinFromUtc: (date, timeToSubtract) => { return moment_1.default(date).subtract(timeToSubtract, 'm').toDate(); },
        pastFiveMinutes: (offset, date) => { return date ? moment_1.default(date).utcOffset(Math.floor(offset / 60000)).subtract(5, 'm').toDate() : moment_1.default().utcOffset(0).subtract(5, 'm').toDate(); },
        currentTime: (offset) => { return offset ? moment_1.default().utcOffset(Math.floor(offset / 60000)).toDate() : moment_1.default().utcOffset(0).toDate(); },
        fromDate: (date, offset) => {
            return moment_1.default(date).utcOffset(Math.floor(offset / 60000)).toDate();
        },
        hourlyFromDate: (date, offset) => {
            return moment_1.default(date).utcOffset(Math.floor(offset / 60000)).add(1, 'seconds').toDate();
        },
        toDate: (date, offset) => {
            return moment_1.default(date).utcOffset(Math.floor(offset / 60000)).toDate();
        },
        hourlyToDate: (date, offset) => {
            return moment_1.default(date).utcOffset(Math.floor(offset / 60000)).subtract(1, 'seconds').toDate();
        },
        formatTime: (date, offset) => {
            return moment_1.default(date).utcOffset(Math.floor(offset / 60000)).format('MMM DD,YYYY');
        },
        utcTimeDate: (date) => { return moment_1.default(date).utc().toDate(); },
        lastTwentyFourHours: (offset) => { return offset ? moment_1.default().utcOffset(Math.floor(offset / 60000)).subtract(7, 'd').toDate() : moment_1.default().utcOffset(0).subtract(7, 'd').toDate(); },
        pastDay: (offset, date) => { return date ? moment_1.default(parseInt(date)).utcOffset(Math.floor(offset / 60000)).subtract(1, 'd').toDate() : moment_1.default().utcOffset(Math.floor(offset / 60000)).subtract(1, 'd').toDate(); },
        midNightTime: (date, offset) => { return date ? moment_1.default(parseInt(date)).utcOffset(offset ? Math.floor(offset / 60000) : 330).endOf('d').toDate() : moment_1.default().utcOffset(0).endOf('d').toDate(); },
        previousMidNight: () => { return moment_1.default().utcOffset(0).subtract(1, 'd').startOf('d').toDate(); },
        midNightTimeStamp: () => { return moment_1.default().utcOffset(0).endOf('d').unix(); },
        nextSevenDayDate: (date, offset) => { return moment_1.default(parseInt(date)).utcOffset(offset ? Math.floor(offset / 60000) : 330).add(7, 'd').endOf('d').toDate(); },
        currentUtcTimeStamp: () => { return moment_1.default().utc().unix() * 1000; },
        currentUtcTimeDate: () => { return moment_1.default().utc().toDate(); },
        utcMidNightTimestamp: () => { return moment_1.default().utc().endOf('d').unix() * 1000; },
        nextFiveMinutes: () => {
            return moment_1.default().utcOffset(0).add(4, 'm').unix() * 1000;
        },
        previousFiveMinutes: () => {
            return moment_1.default().utcOffset(0).subtract(5, 'm').unix() * 1000;
        },
        currentLocalDay: (offset) => {
            return new Date(new Date(new Date().getTime() + offset).setHours(0, 0, 0, 0));
        },
        calculateCurrentDate: (date, offset) => {
            return moment_1.default(date).add(Math.abs(offset), "minute").toDate();
        },
        calculateEndOfDay: (date, offset) => {
            return moment_1.default(date).endOf('day').toDate();
        },
    },
};
//# sourceMappingURL=constant.common.js.map