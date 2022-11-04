"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const demo_model_1 = __importDefault(require("@models/demo.model"));
const _entity_1 = require("@entity");
const _services_1 = require("@services");
const htmlHelper_1 = require("../../htmlHelper");
const _common_1 = require("@common");
const moment_1 = __importDefault(require("moment"));
class DemoEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async scheduleDemoEntity(payload) {
        var _a, _b;
        try {
            const demoDoc = await this.createOne(payload);
            payload.demoId = demoDoc._id;
            const propertyDetail = await _entity_1.PropertyV1.findOne({
                _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.propertyId)
            }, {
                "userData": 1, _id: 0, name: 1, images: 1, address: 1
            });
            const userDetail = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.userId) }, { email: 1, name: 1, address: 1, image: 1 });
            const hostId = (_a = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _a === void 0 ? void 0 : _a.userId;
            const userId = payload === null || payload === void 0 ? void 0 : payload.userId;
            let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/hostDemo.html", {
                icSplashLogo: _common_1.CONSTANT.SPLASH_LOGO,
                logo: _common_1.CONSTANT.PAM_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.IG_LOGO,
                profilePicture: userDetail === null || userDetail === void 0 ? void 0 : userDetail.image,
                userName: propertyDetail.userData.name,
                userAddress: userDetail === null || userDetail === void 0 ? void 0 : userDetail.address,
                propertyName: propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.name,
                demoDate: moment_1.default(_common_1.DATABASE.DATE_CONSTANTS.fromDate(demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoDate, 330)).format('MMM DD,YYYY'),
                demoTime: demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoTime,
                redirectionChatUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/chat?userId=${userId}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/chat?userId=${userId}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
            });
            let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/userDemo.html", {
                logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                icSplashLogo: _common_1.CONSTANT.SPLASH_LOGO,
                demoStatus: `pending`,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.IG_LOGO,
                profilePicture: userDetail === null || userDetail === void 0 ? void 0 : userDetail.image,
                userName: userDetail === null || userDetail === void 0 ? void 0 : userDetail.name,
                userAddress: userDetail === null || userDetail === void 0 ? void 0 : userDetail.address,
                propertyName: propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.name,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                demoDate: moment_1.default(_common_1.DATABASE.DATE_CONSTANTS.fromDate(demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoDate, 330)).format('MMM DD,YYYY'),
                demoTime: demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoTime,
                redirectionChatUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${hostId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/chat?userId=${hostId}`
            });
            _services_1.emailService.sendHostDemoInvite(hostHtml, (_b = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _b === void 0 ? void 0 : _b.email, userDetail === null || userDetail === void 0 ? void 0 : userDetail.name, propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.name);
            _services_1.emailService.sendUserDemoInvite(userHtml, userDetail === null || userDetail === void 0 ? void 0 : userDetail.email, propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.name);
            payload['userDetail'] = userDetail;
            payload['propertyDetail'] = propertyDetail;
            payload['hostId'] = hostId;
            payload['userId'] = userId;
            const [hostToken, userToken] = await Promise.all([
                await _entity_1.HostV1.fetchHostDeviceToken(hostId),
                await _entity_1.UserV1.fetchUserDeviceToken(userId)
            ]);
            await Promise.all([
                _services_1.PushNotification.sendHostPropertyDemoPush(hostToken, payload),
                _services_1.PushNotification.sendUserPropertyDemoPush(userToken, payload),
            ]);
            return demoDoc;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async updateScheduledDemoEntity(payload) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const demoDoc = await this.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.demoId) }, { status: payload.status }, { new: true });
            const propertyDetail = await _entity_1.PropertyV1.findOne({
                _id: mongoose_1.Types.ObjectId(demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.propertyId)
            }, {
                "userData": 1, _id: 0, name: 1, images: 1, address: 1
            });
            const userDetail = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.userId) }, { email: 1, name: 1, address: 1, image: 1 });
            const hostId = (_a = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _a === void 0 ? void 0 : _a.userId;
            const userId = payload === null || payload === void 0 ? void 0 : payload.userId;
            payload['demoDate'] = demoDoc.demoDate;
            payload['demoTime'] = demoDoc.demoTime;
            payload['remark'] = demoDoc.remark;
            payload['userDetail'] = userDetail;
            payload['propertyDetail'] = propertyDetail;
            payload['hostId'] = hostId;
            payload['userId'] = userId;
            const [hostToken, userToken] = await Promise.all([
                await _entity_1.HostV1.fetchHostDeviceToken(hostId),
                await _entity_1.UserV1.fetchUserDeviceToken(userId)
            ]);
            switch (payload.status) {
                case _common_1.ENUM.PROPERTY.DEMO_STATUS.ACCEPTED:
                    {
                        let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/host_demo_status.html", {
                            logo: _common_1.CONSTANT.PAM_LOGO,
                            icSplashLogo: _common_1.CONSTANT.SPLASH_LOGO,
                            demoStatus: `accepted`,
                            facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                            twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                            linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                            igLogo: _common_1.CONSTANT.IG_LOGO,
                            profilePicture: userDetail === null || userDetail === void 0 ? void 0 : userDetail.image,
                            userName: userDetail === null || userDetail === void 0 ? void 0 : userDetail.name,
                            hostName: (_b = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _b === void 0 ? void 0 : _b.name,
                            userAddress: userDetail === null || userDetail === void 0 ? void 0 : userDetail.address,
                            propertyName: propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.name,
                            demoDate: moment_1.default(_common_1.DATABASE.DATE_CONSTANTS.fromDate(demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoDate, 330)).format('MMM DD,YYYY'),
                            demoTime: demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoTime,
                            redirectionChatUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/chat?userId=${demoDoc.userId}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/chat?userId=${demoDoc.userId}`,
                            webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                            CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                            FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                        });
                        let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/userDemoStatus.html", {
                            logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                            icSplashLogo: _common_1.CONSTANT.SPLASH_LOGO,
                            demoStatus: `accepted`,
                            facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                            twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                            linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                            igLogo: _common_1.CONSTANT.IG_LOGO,
                            hostName: (_c = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _c === void 0 ? void 0 : _c.name,
                            profilePicture: userDetail === null || userDetail === void 0 ? void 0 : userDetail.image,
                            userName: userDetail === null || userDetail === void 0 ? void 0 : userDetail.name,
                            userAddress: userDetail === null || userDetail === void 0 ? void 0 : userDetail.address,
                            propertyName: propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.name,
                            demoDate: moment_1.default(_common_1.DATABASE.DATE_CONSTANTS.fromDate(demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoDate, 330)).format('MMM DD,YYYY'),
                            demoTime: demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoTime,
                            redirectionChatUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${hostId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/chat?userId=${hostId}`,
                            webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                            contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                            FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                        });
                        await Promise.all([
                            _services_1.PushNotification.sendHostPropertyDemoAcceptStatusPush(hostToken, payload),
                            _services_1.PushNotification.sendUserPropertyDemoAcceptStatusPush(userToken, payload),
                            _services_1.emailService.sendHostUpdateDemoInvite(hostHtml, (_d = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _d === void 0 ? void 0 : _d.email, "accepted"),
                            _services_1.emailService.sendUserUpdateDemoInvite(userHtml, userDetail === null || userDetail === void 0 ? void 0 : userDetail.email, "accepted")
                        ]);
                    }
                    break;
                case _common_1.ENUM.PROPERTY.DEMO_STATUS.REJECTED:
                    {
                        let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/host_demo_status.html", {
                            logo: _common_1.CONSTANT.PAM_LOGO,
                            icSplashLogo: _common_1.CONSTANT.SPLASH_LOGO,
                            demoStatus: `rejected`,
                            facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                            twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                            linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                            igLogo: _common_1.CONSTANT.IG_LOGO,
                            userName: userDetail === null || userDetail === void 0 ? void 0 : userDetail.name,
                            hostName: (_e = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _e === void 0 ? void 0 : _e.name,
                            userAddress: userDetail === null || userDetail === void 0 ? void 0 : userDetail.address,
                            propertyName: propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.name,
                            demoDate: moment_1.default(_common_1.DATABASE.DATE_CONSTANTS.fromDate(demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoDate, 330)).format('MMM DD,YYYY'),
                            demoTime: demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoTime,
                            redirectionChatUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/chat?userId=${demoDoc.userId}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/chat?userId=${demoDoc.userId}`,
                            webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                            CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                            FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                        });
                        let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/propertyDemo/userDemoStatus.html", {
                            logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                            icSplashLogo: _common_1.CONSTANT.SPLASH_LOGO,
                            demoStatus: `rejected`,
                            facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                            twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                            linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                            igLogo: _common_1.CONSTANT.IG_LOGO,
                            userName: userDetail === null || userDetail === void 0 ? void 0 : userDetail.name,
                            userAddress: userDetail === null || userDetail === void 0 ? void 0 : userDetail.address,
                            hostName: (_f = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _f === void 0 ? void 0 : _f.name,
                            propertyName: propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.name,
                            demoDate: moment_1.default(_common_1.DATABASE.DATE_CONSTANTS.fromDate(demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoDate, 330)).format('MMM DD,YYYY'),
                            demoTime: demoDoc === null || demoDoc === void 0 ? void 0 : demoDoc.demoTime,
                            redirectionChatUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${hostId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/chat?userId=${hostId}`,
                            webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                            contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                            FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                        });
                        await Promise.all([
                            _services_1.emailService.sendHostUpdateDemoInvite(hostHtml, (_g = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _g === void 0 ? void 0 : _g.email, "rejected"),
                            _services_1.emailService.sendUserUpdateDemoInvite(userHtml, userDetail === null || userDetail === void 0 ? void 0 : userDetail.email, "rejected"),
                            _services_1.PushNotification.sendHostPropertyDemoRejectStatusPush(hostToken, payload),
                            _services_1.PushNotification.sendUserPropertyDemoRejectStatusPush(userToken, payload)
                        ]);
                    }
                    break;
            }
        }
        catch (error) {
            console.error(`we have an error while updating the scheduled demo ${error} `);
        }
    }
}
exports.DemoV1 = new DemoEntity(demo_model_1.default);
//# sourceMappingURL=demo.v1.entity.js.map