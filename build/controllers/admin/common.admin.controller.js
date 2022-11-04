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
exports.AdminCommonController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _entity_1 = require("@entity");
const _baseController_1 = __importDefault(require("@baseController"));
const _common_1 = require("@common");
const _services_1 = require("@services");
const helper_service_1 = require("../../services/helper.service");
const htmlHelper_1 = require("../../htmlHelper");
const _builders_1 = __importDefault(require("@builders"));
const mongoose_1 = require("mongoose");
let AdminCommonClass = class AdminCommonClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async adminLogin(req, res, next) {
        try {
            let payload = req.body, checkAdminExists = await _entity_1.AdminV1.findOne({ email: payload.email });
            if (checkAdminExists) {
                if (await _entity_1.AdminV1.verifyPassword(checkAdminExists, payload.password)) {
                    payload.adminId = checkAdminExists._id;
                    let [adminData, sessionData] = await Promise.all([
                        _entity_1.AdminV1.updateEntity({ _id: checkAdminExists._id }, { $set: { 'adminMeta.lastLogin': new Date() } }),
                        _entity_1.AdminV1.createNewSession(payload)
                    ]);
                    this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                        adminData: _entity_1.AdminV1.filterAdminData(adminData.data),
                        authToken: _services_1.Auth.generateAdminJWT(sessionData._id)
                    });
                }
                else
                    this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).INCORRECT_PASSWORD);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).EMAIL_NOT_EXISTS);
        }
        catch (err) {
            next(err);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            let payload = req.body, singleAdminData = await _entity_1.AdminV1.findOne({ email: payload.email });
            if (singleAdminData) {
                let metaToken = helper_service_1.Helper.generateMetaToken();
                await _entity_1.AdminV1.updateEntity({ _id: singleAdminData._id }, { 'adminMeta.token': metaToken });
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).EMAIL_SENT);
                let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${_common_1.CONSTANT.EMAIL_TEMPLATES}` + `adminforgetpassword.html`, { name: singleAdminData.name, ASSET_PATH: _common_1.BASE.URL, url: `${_common_1.BASE.ADMIN}/auth/reset-password/${metaToken.value}` });
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.ADMIN.FORGOT_PASSWORD_NEW(payload.email, html));
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).EMAIL_NOT_EXISTS);
        }
        catch (err) {
            next(err);
        }
    }
    async verifyMetaToken(req, res, next) {
        try {
            let metaToken = req.params.metaToken, checkValidToken = await _entity_1.AdminV1.findOne({ 'adminMeta.token.value': metaToken });
            if (checkValidToken && checkValidToken.adminMeta.token) {
                if (checkValidToken.adminMeta.token.time > new Date()) {
                    this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                }
                else
                    this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).TOKEN_EXPIRED);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).TOKEN_INCORRECT);
        }
        catch (err) {
            next(err);
        }
    }
    async resetPassword(req, res, next) {
        try {
            let metaToken = req.params.metaToken, payload = req.body, checkValidToken = await _entity_1.AdminV1.findOne({ 'adminMeta.token.value': metaToken });
            if (checkValidToken && checkValidToken.adminMeta.token) {
                if (checkValidToken.adminMeta.token.time > new Date()) {
                    await _entity_1.AdminV1.updateEntity({ _id: checkValidToken._id }, {
                        password: _services_1.Auth.hashData(payload.password, checkValidToken.salt),
                        'adminMeta.token': {}
                    });
                    this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                }
                else
                    this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).TOKEN_EXPIRED);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).TOKEN_INCORRECT);
        }
        catch (err) {
            next(err);
        }
    }
    async adminLogout(req, res, next) {
        try {
            let adminId = res.locals.adminId, adminSessionId = res.locals.adminSessionId, checkAdminExists = await _entity_1.AdminV1.findOne({ _id: adminId });
            if (checkAdminExists) {
                await _entity_1.AdminV1.removePreviousSession(adminSessionId, false);
                this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async giftCardAmount(req, res, next) {
        try {
            let payload = req.body;
            payload.status = _common_1.ENUM.CONFIG.TYPE.AMOUNT;
            await _entity_1.ConfigV1.updateDocument({ type: _common_1.ENUM.CONFIG.TYPE.AMOUNT }, payload, { upsert: true });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async getCountries(req, res, next) {
        try {
            let pipeline = await _builders_1.default.Admin.FAQ.CountryLisiting();
            let response = await _entity_1.PropertyV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async getStates(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = await _builders_1.default.Admin.FAQ.StateListing(payload);
            let response = await _entity_1.PropertyV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async getCities(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = await _builders_1.default.Admin.FAQ.CityListing(payload);
            let response = await _entity_1.PropertyV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchAdvHomeData(req, res, next) {
        try {
            let response = await _entity_1.CategoryV1.findMany({ parentId: { $exists: false }, status: "active" });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchAdvSubcategoryData(req, res, next) {
        try {
            let response = await _entity_1.CategoryV1.findMany({ parentId: mongoose_1.Types.ObjectId(req.query.categoryId), status: "active" });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Admin Login",
        path: '/login',
        parameters: {
            body: {
                description: 'Body for veriy otp',
                required: true,
                model: 'ReqAdminLogin'
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
], AdminCommonClass.prototype, "adminLogin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Admin Forget Password",
        path: '/password/forgot',
        parameters: {
            body: {
                description: 'Body for forget password',
                required: true,
                model: 'ReqAdminForgotPassword'
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
], AdminCommonClass.prototype, "forgotPassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Verify Otp",
        path: '/password/verify/{metaToken}',
        parameters: {
            path: {
                metaToken: {
                    description: 'metatoken',
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
], AdminCommonClass.prototype, "verifyMetaToken", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User Verify Otp",
        path: '/password/reset/{metaToken}',
        parameters: {
            path: {
                metaToken: {
                    description: 'metatoken',
                    required: true,
                }
            },
            body: {
                description: 'Body for admin reset password',
                required: true,
                model: 'ReqAdminResetPassword'
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
], AdminCommonClass.prototype, "resetPassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User Details",
        path: '/giftCardAmount',
        parameters: {
            body: {
                description: 'Body for admin reset password',
                required: true,
                model: 'ReqAdminAmountConfigModel'
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
], AdminCommonClass.prototype, "giftCardAmount", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "getCountries",
        path: '/getCountries',
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
], AdminCommonClass.prototype, "getCountries", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin delete adprice",
        path: '/getStates/{countryId}',
        parameters: {
            path: {
                countryId: {
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
], AdminCommonClass.prototype, "getStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin delete adprice",
        path: '/getCities/{stateId}',
        parameters: {
            path: {
                stateId: {
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
], AdminCommonClass.prototype, "getCities", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/categories',
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
], AdminCommonClass.prototype, "fetchAdvHomeData", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/subCategories',
        parameters: {
            query: {
                categoryId: {
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
], AdminCommonClass.prototype, "fetchAdvSubcategoryData", null);
AdminCommonClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins",
        name: "Admin Onboarding Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminCommonClass);
exports.AdminCommonController = new AdminCommonClass();
//# sourceMappingURL=common.admin.controller.js.map