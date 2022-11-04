"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeSignupTemplater = exports.DeepLink = exports.checkSlot = exports.checkListing = exports.checkDuration = exports.AmenityFilter = void 0;
const enum_common_1 = require("./enum.common");
const htmlHelper_1 = require("../htmlHelper");
const constant_common_1 = require("./constant.common");
const config_common_1 = require("./config.common");
exports.AmenityFilter = {
    $filter: {
        input: "$amenities",
        as: "grade",
        cond: { $eq: ["$$grade.status", enum_common_1.ENUM.PROPERTY_SPACE.STATUS.ACTIVE] }
    }
};
exports.checkDuration = (params) => {
    if (params == enum_common_1.ENUM.PROPERTY.PROMOTION.DURATION.DAILY)
        return 'Day';
    else if (params == enum_common_1.ENUM.PROPERTY.PROMOTION.DURATION.MONTHLY)
        return 'Month';
    else
        return 'Week';
};
exports.checkListing = (params) => {
    if (params == enum_common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING)
        return 'Listing';
    else
        return 'Landing';
};
exports.checkSlot = (params, listingType) => {
    switch (listingType) {
        case enum_common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME:
            if (params.slotType == 1)
                return "Top4";
            else if (params.slotType == 2)
                return "Top8";
            else
                return "Top12";
        case enum_common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING:
            if (params.slotType == 1)
                return "First property";
            else if (params.slotType == 2)
                return "Second property";
            else
                return "Third property";
    }
    return "N/A";
};
exports.DeepLink = async (params) => {
    try {
        let type = params.type;
        let url = {};
        let redirectType = 1;
        switch (type) {
            case 1: {
                redirectType = 1;
                url.android = `${config_common_1.REDIRECTION_URL.ADNROID_URL_USER}?type=${redirectType}\&_id=${params.shareId.toString()}`;
                url.iosLink = `${config_common_1.REDIRECTION_URL.IOS_URL_USER}?type=${redirectType}\&_id=${params.shareId.toString()}`;
                url.url = `${config_common_1.WEB_PANELS.USER_PANEL_PROD}/property/detail/${params.shareId.toString()}`;
                let obj = {
                    fallback: constant_common_1.CONSTANT.FALLBACK,
                    url: url.url,
                    android_package_name: constant_common_1.CONSTANT.ANDROID_PACKAGE_NAME,
                    android: url.android,
                    ios_store_link: constant_common_1.CONSTANT.IOS_STORE_LINK,
                    iosLink: url.iosLink
                };
                return obj;
            }
            case 2: {
                redirectType = 2;
                url.android = `deskhost://com.desknow.host?type=${redirectType}\&_id=${params.shareId.toString()}`;
                url.iosLink = `desknowhost://com.desknow/?type=${redirectType}\&_id=${params.shareId.toString()}`;
                url.url = `${config_common_1.WEB_PANELS.HOST_PANEL_PROD}/claim-property/${params.shareId.toString()}`;
                let obj = {
                    fallback: constant_common_1.CONSTANT.PAM_FALLBACK,
                    url: url.url,
                    android_package_name: constant_common_1.CONSTANT.PAM_ANDROID_PACKAGE_NAME,
                    android: url.android,
                    ios_store_link: constant_common_1.CONSTANT.PAM_IOS_STORE_LINK,
                    iosLink: url.iosLink
                };
                return obj;
            }
            case 3: {
                redirectType = 3;
                url.android = `${config_common_1.REDIRECTION_URL.ADNROID_URL_USER}?type=${redirectType}\&name=${params.name}\&email=${params.email}\&phoneNo=${params.phoneNo}\&countryCode=${params.countryCode}`;
                url.iosLink = `${config_common_1.REDIRECTION_URL.IOS_URL_USER}?type=${redirectType}\&name=${params.name}\&email=${params.email}\&phoneNo=${params.phoneNo}\&countryCode=${params.countryCode}`;
                url.url = `${config_common_1.WEB_PANELS.USER_PANEL_PROD}/account/signup?name=${params.name}\&email=${params.email}\&phoneNo=${params.phoneNo}\&countryCode=${params.countryCode}`;
                let obj = {
                    fallback: constant_common_1.CONSTANT.FALLBACK,
                    url: url.url,
                    android_package_name: constant_common_1.CONSTANT.ANDROID_PACKAGE_NAME,
                    android: url.android,
                    ios_store_link: constant_common_1.CONSTANT.IOS_STORE_LINK,
                    iosLink: url.iosLink
                };
                return obj;
            }
        }
        return url;
    }
    catch (error) {
        console.error("error in DeepLink inside function.common", error);
    }
};
exports.employeeSignupTemplater = async (payload, partnerName) => {
    try {
        return htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${constant_common_1.CONSTANT.EMAIL_TEMPLATES}` + `employee-welcome.html`, {
            name: payload.name,
            ASSET_PATH: config_common_1.BASE.URL,
            url: `${config_common_1.WEB_PANELS.USER_PANEL_DEEP_LINK__API_BASE_URL}?name=${payload.name}&countryCode=${payload.countryCode}&phoneNo=${payload.phoneNo}&type=3&email=${payload.email}`,
            partnerName: partnerName,
            logo: constant_common_1.CONSTANT.VERIFY_EMAIL_LOGO,
            facebookLogo: constant_common_1.CONSTANT.FACEBOOK_LOGO_PNG,
            igLogo: constant_common_1.CONSTANT.INSTAGRAM_LOGO,
            twitterLogo: constant_common_1.CONSTANT.TWITTER_LOGO_NEW,
            linkedinLogo: constant_common_1.CONSTANT.LINKEDIN_LOGO,
            welcome: "DeskNow",
            fbUrl: config_common_1.WEB_PANELS.FB_URL,
            instaUrl: config_common_1.WEB_PANELS.INSTA_URL,
            twitterUrl: config_common_1.WEB_PANELS.TWITTER_URL,
            linkedinUrl: config_common_1.WEB_PANELS.LINKEDIN_URL,
            webPanelUrl: config_common_1.CONFIG.NODE_ENV === 'stag' ? config_common_1.WEB_PANELS.USER_PANEL_STAGING : config_common_1.WEB_PANELS.USER_PANEL_PROD,
            contactUsUrl: config_common_1.CONFIG.NODE_ENV === 'stag' ? config_common_1.WEB_PANELS.CONTACT_US_STAGING : config_common_1.WEB_PANELS.CONTACT_US_PROD,
            FAQUrl: config_common_1.CONFIG.NODE_ENV === 'stag' ? config_common_1.WEB_PANELS.FAQ_STAGING : config_common_1.WEB_PANELS.FAQ_PROD
        });
    }
    catch (error) {
        console.error("error in employeeSignupTemplater", error);
    }
};
//# sourceMappingURL=functions.common.js.map