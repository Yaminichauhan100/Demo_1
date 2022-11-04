"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const htmlHelper_1 = require("../htmlHelper");
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const swagger_express_ts_1 = require("swagger-express-ts");
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(_common_1.CONFIG.GOOGLE_CALENDAR.CLIENT_ID, _common_1.CONFIG.GOOGLE_CALENDAR.SECRET_KEY, _common_1.CONFIG.GOOGLE_CALENDAR.REDIRECT_URI);
const oauth2ClientUser = new google.auth.OAuth2(_common_1.CONFIG.GOOGLE_CALENDAR.CLIENT_ID, _common_1.CONFIG.GOOGLE_CALENDAR.SECRET_KEY, _common_1.CONFIG.GOOGLE_CALENDAR.USER_REDIRECT_URI);
let CommonClass = class CommonClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getUserDetails(accessToken) {
        try {
            const client = await _services_1.getAuthenticatedClient(accessToken);
            const user = await client
                .api('/me')
                .select('displayName,mail,mailboxSettings,userPrincipalName')
                .get();
            return user;
        }
        catch (error) {
            console.error(`we have an error in getUserDetails ==> ${error}`);
        }
    }
    async deeplinkingEventShare(req, res, next) {
        try {
            let eventId = req.params.eventId;
            let url = _common_1.CONSTANT.ANDROID_LINK + `?viewId=1&eventId=${eventId}`;
            let ios_store_link = _common_1.CONSTANT.IOS_STORE_LINK + `?viewId=1&eventId=${eventId}`;
            let iosLink = _common_1.CONSTANT.IOS_LINK + `?viewId=1&eventId=${eventId}`;
            let obj = {
                fallback: _common_1.CONSTANT.FALLBACK,
                url: url,
                android_package_name: _common_1.CONSTANT.ANDROID_PACKAGE_NAME,
                ios_store_link: ios_store_link,
                iosLink: iosLink
            };
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${_common_1.CONSTANT.EMAIL_TEMPLATES}/staticpage.html`, obj);
            return this.sendhtml(res, html);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchIndexFile(req, res, next) {
        try {
            const params = req.query;
            let fetchIndexHtmlFile = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + `/src/views/outlookOAuth/index.hbs`, {
                bookingId: params === null || params === void 0 ? void 0 : params.bookingId,
                userType: params === null || params === void 0 ? void 0 : params.userType
            });
            res.send(fetchIndexHtmlFile);
        }
        catch (error) {
            console.error(`we have an error in fetchIndexFile ==> ${error}`);
            next(error);
        }
    }
    async outlookSignIn(req, res, next) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const urlParameters = {
                scopes: (_b = (_a = _common_1.CONFIG === null || _common_1.CONFIG === void 0 ? void 0 : _common_1.CONFIG.OUTLOOK) === null || _a === void 0 ? void 0 : _a.OAUTH_SCOPES) === null || _b === void 0 ? void 0 : _b.split(','),
                redirectUri: ((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.userType) === _common_1.ENUM.USER.TYPE.USER ? (_d = _common_1.CONFIG === null || _common_1.CONFIG === void 0 ? void 0 : _common_1.CONFIG.OUTLOOK) === null || _d === void 0 ? void 0 : _d.OAUTH_REDIRECT_USER_URI : (_e = _common_1.CONFIG === null || _common_1.CONFIG === void 0 ? void 0 : _common_1.CONFIG.OUTLOOK) === null || _e === void 0 ? void 0 : _e.OAUTH_REDIRECT_HOST_URI
            };
            let authUrl = await req.app.locals.msalClient.getAuthCodeUrl(urlParameters);
            if ((_f = req === null || req === void 0 ? void 0 : req.query) === null || _f === void 0 ? void 0 : _f.bookingId) {
                authUrl = `${authUrl}&bookingId={req?.query?.bookingId}&userType=${(_g = req === null || req === void 0 ? void 0 : req.query) === null || _g === void 0 ? void 0 : _g.userType}`;
            }
            console.log(`authUrl ==>`, authUrl);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { authUrl: authUrl });
        }
        catch (error) {
            console.error(`we have an error in outlookSignIn ==> ${error} `);
            next(error);
        }
    }
    async fetchCallbackToken(req, res, next) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        try {
            const params = req.query;
            const tokenRequest = {
                code: req.query.code,
                scopes: (_b = (_a = _common_1.CONFIG === null || _common_1.CONFIG === void 0 ? void 0 : _common_1.CONFIG.OUTLOOK) === null || _a === void 0 ? void 0 : _a.OAUTH_SCOPES) === null || _b === void 0 ? void 0 : _b.split(','),
                redirectUri: ((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.userType) === _common_1.ENUM.USER.TYPE.USER ? (_d = _common_1.CONFIG === null || _common_1.CONFIG === void 0 ? void 0 : _common_1.CONFIG.OUTLOOK) === null || _d === void 0 ? void 0 : _d.OAUTH_REDIRECT_USER_URI : (_e = _common_1.CONFIG === null || _common_1.CONFIG === void 0 ? void 0 : _common_1.CONFIG.OUTLOOK) === null || _e === void 0 ? void 0 : _e.OAUTH_REDIRECT_HOST_URI
            };
            const response = await ((_h = (_g = (_f = req === null || req === void 0 ? void 0 : req.app) === null || _f === void 0 ? void 0 : _f.locals) === null || _g === void 0 ? void 0 : _g.msalClient) === null || _h === void 0 ? void 0 : _h.acquireTokenByCode(tokenRequest));
            const userId = req.session.userId = response.account.homeAccountId;
            const user = await this.getUserDetails(response.accessToken);
            const userHashToStore = {
                displayName: user.displayName,
                email: user.mail || user.userPrincipalName,
                timeZone: user.mailboxSettings.timeZone
            };
            req.app.locals.users[userId] = userHashToStore;
            userHashToStore['homeAccountId'] = response.account.homeAccountId;
            await _services_1.redisDOA.insertKeyInRedis(`${params.userId}_outlook`, JSON.stringify(userHashToStore));
            let eventDetail;
            if (params === null || params === void 0 ? void 0 : params.bookingId) {
                const bookingDetail = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(params === null || params === void 0 ? void 0 : params.bookingId) });
                eventDetail = {
                    subject: `Booking at ${(_j = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _j === void 0 ? void 0 : _j.name}`,
                    start: `${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.fromDate}`,
                    end: `${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.toDate}`,
                    body: `
                    BookingId: ${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.bookingId}
                    From: ${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.fromDate}
                    To: ${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.toDate}
                    Property name: ${(_k = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _k === void 0 ? void 0 : _k.name}
                    Category: ${(_l = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.category) === null || _l === void 0 ? void 0 : _l.name}
                    Units: ${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.quantity}
                    Address: ${(_m = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _m === void 0 ? void 0 : _m.address}`
                };
            }
            switch (params === null || params === void 0 ? void 0 : params.userType) {
                case _common_1.ENUM.USER.TYPE.USER:
                    await _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(params.userId) }, { outlookCalendarSyncedAt: new Date(), outlookCalendarSyncStatus: true });
                    break;
                case _common_1.ENUM.USER.TYPE.HOST:
                    await _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(params.userId) }, { outlookCalendarSyncedAt: new Date(), outlookCalendarSyncStatus: true });
                    break;
            }
            await this.createOutlookEvent(req, eventDetail);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error in fetchCallbackToken ==> ${error} `);
            next(error);
        }
    }
    async createOutlookEvent(req, eventDetail) {
        var _a;
        try {
            if ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.userId) {
                const formData = {
                    subject: eventDetail.subject,
                    start: eventDetail.start,
                    end: eventDetail.end,
                    body: eventDetail.body
                };
                const accessToken = await this.getAccessToken(req.session.userId, req.app.locals.msalClient, eventDetail.userType);
                const user = req.app.locals.users[req.session.userId];
                const createEventResponse = await _services_1.createOutlookEventService(accessToken, formData, user.timeZone);
                _entity_1.CommonLogsV1.createOne({ type: 1, data: createEventResponse });
            }
            else {
                return;
            }
        }
        catch (error) {
            console.error(`we have an error in createOutLookEvent ==> ${error}`);
        }
    }
    async getAccessToken(userId, msalClient, userType) {
        try {
            const accounts = await msalClient
                .getTokenCache()
                .getAllAccounts();
            const userAccount = accounts.find((a) => a.homeAccountId === userId);
            const response = await msalClient.acquireTokenSilent({
                scopes: _common_1.CONFIG.OUTLOOK.OAUTH_SCOPES.split(','),
                redirectUri: userType === _common_1.ENUM.USER.TYPE.USER ? _common_1.CONFIG.OUTLOOK.OAUTH_REDIRECT_USER_URI : _common_1.CONFIG.OUTLOOK.OAUTH_REDIRECT_HOST_URI,
                account: userAccount
            });
            return response.accessToken;
        }
        catch (err) {
            console.error(`we are getting error while getAccessToken ==> ${err}`);
        }
    }
    async getCmsList(req, res, next) {
        try {
            let query = req.query;
            if (query.type == _common_1.CONSTANT.TANDC.FAQ) {
                let faq = await _entity_1.FaqV1.findMany({ lang: req.query.lang, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, userType: req.query.userType });
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, faq);
            }
            else {
                let termsAndCondition = await _entity_1.AppPolicyV1.findOne({ lang: req.query.lang, type: req.query.type, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, userType: req.query.userType });
                termsAndCondition && termsAndCondition._id ? termsAndCondition = termsAndCondition : termsAndCondition = {};
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, termsAndCondition);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async createContactUs(req, res, next) {
        try {
            let payload = req.body;
            let userId = res.locals.userId;
            let dataToSave = {};
            if (payload && payload.subject) {
                let subjectData = await _entity_1.SubjectV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.subject) }, { _id: 1, name: 1 });
                dataToSave['subject'] = subjectData;
            }
            if (payload && payload.message)
                dataToSave['message'] = payload.message;
            if (payload && payload.otherMessage)
                dataToSave['otherMessage'] = payload.otherMessage;
            if (payload && payload.name)
                dataToSave['name'] = payload.name;
            if (payload && payload.phoneNo)
                dataToSave['phoneNo'] = payload.phoneNo;
            if (payload && payload.email)
                dataToSave['email'] = payload.email;
            if (payload && payload.countryCode)
                dataToSave['countryCode'] = payload.countryCode;
            if (payload && payload.companyName)
                dataToSave['companyName'] = payload.companyName;
            await _entity_1.ContactV1.updateDocument({ bookingId: payload.bookingId, userId: userId }, Object.assign(Object.assign({}, dataToSave), { userId }), { upsert: true });
            let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/contact_us.html", {
                logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                bannerLogo: _common_1.CONSTANT.BANNER_PNG,
                userName: payload.name,
                companyName: payload.companyName,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD
            });
            let adminEmail = await _entity_1.AdminV1.findOne({});
            _services_1.emailService.sendContactUs(userHtml, payload.email, adminEmail.email);
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error createContactUs ==> ${err}`);
            next(err);
        }
    }
    async getFeaturedRating(req, res, next) {
        try {
            let result = await _entity_1.RatingV1.getAdminRatingList({ "isFeatured": 1, page: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
        }
        catch (err) {
            next(err);
        }
    }
    async uploadFiles(req, res, next) {
        try {
            const files = req.files;
            const response = {};
            for (let i = 0; i < files.length; i++) {
                const fileDetail = files[i];
                let s3Object = await _services_1.S3Invoice.uploadImage(`${fileDetail.originalname}`, `${process.cwd()}/uploads/${fileDetail.filename}`);
                response[`fileUrl`] = s3Object === null || s3Object === void 0 ? void 0 : s3Object.Location;
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async generateGoogleCalendarUrl(req, res, next) {
        var _a, _b, _c, _d, _e;
        try {
            const scopes = [
                'https://www.googleapis.com/auth/calendar.events'
            ];
            let url;
            switch ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.userType) {
                case _common_1.ENUM.USER.TYPE.USER:
                    url = await oauth2ClientUser.generateAuthUrl({
                        access_type: 'offline',
                        prompt: 'consent',
                        scope: scopes
                    });
                    if ((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.bookingId) {
                        url = `${url}&bookingId={req?.query?.bookingId}&userType=${(_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.userType}`;
                    }
                    break;
                case _common_1.ENUM.USER.TYPE.HOST:
                    url = await oauth2Client.generateAuthUrl({
                        access_type: 'offline',
                        prompt: 'consent',
                        scope: scopes
                    });
                    if ((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.bookingId) {
                        url = `${url}&bookingId={req?.query?.bookingId}&userType=${(_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.userType}`;
                    }
                    break;
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, url);
        }
        catch (err) {
            next(err);
        }
    }
    async updateProfile(req, res, next) {
        var _a, _b, _c, _d, _e, _f;
        try {
            switch (req.body.type) {
                case _common_1.ENUM.USER.TYPE.USER:
                    {
                        const { tokens } = await oauth2ClientUser.getToken(req.body.code);
                        if (tokens.refresh_token)
                            await _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.userId) }, { google_refresh_token: tokens.refresh_token, googleCalendarSyncedAt: new Date(), googleCalendarSyncStatus: true });
                        if (!tokens.refresh_token) {
                            if ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.bookingId) {
                                const bookingDetail = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.bookingId) });
                                this.testCreateEvent(bookingDetail, req.body);
                            }
                            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                        }
                        await oauth2ClientUser.setCredentials(tokens);
                        if ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.bookingId) {
                            const bookingDetail = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.bookingId) });
                            this.createInstantEventsRF(bookingDetail, req.body, tokens);
                        }
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                        break;
                    }
                case _common_1.ENUM.USER.TYPE.HOST:
                    {
                        const { tokens } = await oauth2Client.getToken(req.body.code);
                        if (!tokens.refresh_token)
                            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                        oauth2Client.setCredentials(tokens);
                        await _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.userId) }, { google_refresh_token: tokens.refresh_token, googleCalendarSyncedAt: new Date(), googleCalendarSyncStatus: true });
                        if ((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.bookingId) {
                            const bookingDetail = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.bookingId) });
                            this.createInstantEventsRF(bookingDetail, req.body, tokens);
                        }
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                        break;
                    }
            }
        }
        catch (err) {
            console.error(`we have an error while updateProfile ==> ${err}`);
            next(err);
        }
    }
    async testCreateEvent(bookingDetail, userDetail) {
        try {
            switch (userDetail === null || userDetail === void 0 ? void 0 : userDetail.type) {
                case _common_1.ENUM.USER.TYPE.USER:
                    {
                        let googleToken = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId() }, { google_refresh_token: 1 });
                        if (googleToken === null || googleToken === void 0 ? void 0 : googleToken.google_refresh_token) {
                            await _services_1.GoogleCalendar.createEvent({ refresh_token: googleToken }, bookingDetail);
                        }
                        break;
                    }
                case _common_1.ENUM.USER.TYPE.HOST:
                    {
                        let googleToken = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId() }, { google_refresh_token: 1 });
                        if (googleToken === null || googleToken === void 0 ? void 0 : googleToken.google_refresh_token) {
                            await _services_1.GoogleCalendar.createEvent({ refresh_token: googleToken }, bookingDetail);
                        }
                        break;
                    }
            }
        }
        catch (err) {
            console.error(`we have an error in test create event ==> ${err}`);
        }
    }
    async createInstantEventsRF(bookingDetail, userDetail, tokens) {
        try {
            switch (userDetail === null || userDetail === void 0 ? void 0 : userDetail.type) {
                case _common_1.ENUM.USER.TYPE.USER:
                    {
                        let googleToken = tokens.refresh_token;
                        await _services_1.GoogleCalendar.createEvent({ refresh_token: googleToken }, bookingDetail);
                        break;
                    }
                case _common_1.ENUM.USER.TYPE.HOST:
                    {
                        let googleToken = tokens.refresh_token;
                        await _services_1.GoogleCalendar.createEvent({ refresh_token: googleToken }, bookingDetail);
                        break;
                    }
            }
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: 'api/cms',
        parameters: {
            query: {
                type: {
                    description: '1,2,3',
                    required: false,
                },
                lang: {
                    description: 'en',
                    required: false,
                },
                userType: {
                    description: 'EN',
                    required: false,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CommonClass.prototype, "getCmsList", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create contact by user",
        path: 'api/contactUs',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqGuestUserContactModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CommonClass.prototype, "createContactUs", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: 'api/featuredRating',
        parameters: {},
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CommonClass.prototype, "getFeaturedRating", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Generate Calendar Url",
        path: '/generateCalendarUrl',
        parameters: {
            query: {
                userType: {
                    description: '1 for user',
                    required: true,
                },
                bookingId: {
                    description: 'mongo id',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CommonClass.prototype, "generateGoogleCalendarUrl", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create contact by user",
        path: '/api/updateProfile',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqUpdateProfileCalendarModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CommonClass.prototype, "updateProfile", null);
CommonClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/",
        name: "Common",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], CommonClass);
exports.CommonController = new CommonClass();
//# sourceMappingURL=common.controller.js.map