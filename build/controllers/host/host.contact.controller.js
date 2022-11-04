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
exports.HostContactController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const htmlHelper_1 = require("../../htmlHelper");
let HostContactClass = class HostContactClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async createContactUs(req, res, next) {
        try {
            let payload = req.body;
            let userId = res.locals.userId;
            let getBookingDetails = await _entity_1.BookingV1.findOne({ _id: payload.bookingId }, {});
            if (!getBookingDetails)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BOOKING_NOT_FOUND);
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
            if (getBookingDetails && getBookingDetails.hostId)
                dataToSave['hostId'] = getBookingDetails.hostId;
            if (getBookingDetails && getBookingDetails.propertyData.propertyId)
                dataToSave['propertyId'] = getBookingDetails.propertyData.propertyId;
            await _entity_1.ContactV1.updateDocument({ bookingId: payload.bookingId, userId: userId }, Object.assign(Object.assign({}, dataToSave), { userId }), { upsert: true });
            let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/contact_us_host.html", {
                logo: _common_1.CONSTANT.PAM_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                bannerLogo: _common_1.CONSTANT.BANNER_PNG,
                userName: payload.name,
                companyName: payload.companyName
            });
            const adminEmail = await _entity_1.AdminV1.findOne({});
            _services_1.emailService.sendContactUs(userHtml, payload.email, adminEmail.email);
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            next(err);
        }
    }
    async createContactUsHostWB(req, res, next) {
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
            await _entity_1.ContactV1.createOne(Object.assign(Object.assign({}, dataToSave), { userId }));
            let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/contact_us_host.html", {
                logo: _common_1.CONSTANT.PAM_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                bannerLogo: _common_1.CONSTANT.BANNER_PNG,
                userName: payload.name,
                companyName: payload.companyName
            });
            let adminEmail = await _entity_1.AdminV1.findOne({});
            _services_1.emailService.sendContactUs(userHtml, payload.email, adminEmail.email);
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error in contact us api ==> ${error}`);
            next(error);
        }
    }
    async getContactSubject(req, res, next) {
        try {
            const payload = req.query;
            let subject = await _entity_1.SubjectV1.findMany({ status: 'active', userType: payload.userType }, { _id: 1, name: 1, type: 1 }, { _id: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                list: subject
            });
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create contact us by host",
        path: '',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqContactModel'
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
], HostContactClass.prototype, "createContactUs", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create contact us by host without booking",
        path: '/contactUsDirect',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqContactDirectModel'
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
], HostContactClass.prototype, "createContactUsHostWB", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "subject",
        path: '/subject',
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
], HostContactClass.prototype, "getContactSubject", null);
HostContactClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/contactUs",
        name: "Host ContactUs Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], HostContactClass);
exports.HostContactController = new HostContactClass();
//# sourceMappingURL=host.contact.controller.js.map