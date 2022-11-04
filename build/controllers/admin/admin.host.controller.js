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
exports.AdminHostController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _builders_1 = __importDefault(require("@builders"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const htmlHelper_1 = require("../../htmlHelper");
const _services_1 = require("@services");
let AdminHostClass = class AdminHostClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getHosts(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Host.HostList(payload);
            let usersList = await _entity_1.HostV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, usersList);
        }
        catch (err) {
            next(err);
        }
    }
    async blockHost(req, res, next) {
        try {
            let user = await _entity_1.HostV1.findOne({ _id: req.params.userId });
            if (!user)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
            await _entity_1.HostV1.updateDocument({ _id: user._id }, { status: _common_1.ENUM.USER.STATUS.BLOCK });
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).USER_BLOCKED_SUCCESSFULLY);
        }
        catch (err) {
            next(err);
        }
    }
    async unblockUsers(req, res, next) {
        try {
            let user = await _entity_1.HostV1.findOne({ _id: req.params.userId });
            if (!user)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
            await _entity_1.HostV1.updateDocument({ _id: user._id }, { status: _common_1.ENUM.USER.STATUS.ACTIVE });
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).USER_UNBLOCKED_SUCCESSFULLY);
        }
        catch (err) {
            next(err);
        }
    }
    async deleteUsers(req, res, next) {
        try {
            let user = await _entity_1.HostV1.findOne({ _id: req.params.userId });
            if (!user)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
            await _entity_1.HostV1.updateDocument({ _id: user._id }, { status: _common_1.ENUM.USER.STATUS.ISDELETE });
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).USER_DELETED_SUCCESSFULLY);
        }
        catch (err) {
            next(err);
        }
    }
    async userDetails(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.Admin.Host.UserDetails(payload.userId);
            let details = await _entity_1.HostV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
        }
        catch (err) {
            next(err);
        }
    }
    async verifyHost(req, res, next) {
        try {
            let user = await _entity_1.HostV1.findOne({ _id: req.params.userId });
            if (!user)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
            await _entity_1.HostV1.updateDocument({ _id: user._id }, { accountStatus: _common_1.ENUM.USER.ACCOUNT_STATUS.VERIFIED });
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${_common_1.CONSTANT.EMAIL_TEMPLATES}` + "host_verification.html", {
                name: user.name, ASSET_PATH: _common_1.BASE.URL,
                url: `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/account/login`,
                logo: _common_1.CONSTANT.PAM_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                fbUrl: _common_1.WEB_PANELS.PAM_FB_URL,
                instaUrl: _common_1.WEB_PANELS.PAM_INSTA_URL,
                twitterUrl: _common_1.WEB_PANELS.PAM_TWITTER_URL,
                linkedinUrl: _common_1.WEB_PANELS.PAM_LINKEDIN_URL,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
            });
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_HOST_SIGNUP_EMAIL(user.email, html));
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).USER_VERIFIED_SUCCESSFULLY);
        }
        catch (err) {
            next(err);
        }
    }
    async propertyDetails(req, res, next) {
        try {
            let payload = req.params;
            let propertyPipeline = _builders_1.default.Admin.Property.hostPropertyDetails(payload.id);
            let bookingPipeline = _builders_1.default.Admin.Property.hostBookingDetails(payload.id);
            let paymentPipeline = _builders_1.default.Admin.Property.hostPaymentDetails(payload.id);
            const [propertyDetails, bookingDetails, paymentDetails] = await Promise.all([
                _entity_1.PropertyV1.basicAggregate(propertyPipeline),
                _entity_1.BookingV1.basicAggregate(bookingPipeline),
                _entity_1.PayV1.basicAggregate(paymentPipeline)
            ]);
            if (propertyDetails.length)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                    propertyData: propertyDetails,
                    bookingDetails: bookingDetails,
                    paymentDetails: paymentDetails
                });
            else
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Host listing",
        path: '/list',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                regStartDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                regEndDate: {
                    description: '2021-04-01T10:30:49.426Z',
                    required: false,
                },
                minProperty: {
                    description: '0',
                    required: false,
                },
                maxProperty: {
                    description: '100',
                    required: false,
                },
                status: {
                    description: 'active/block',
                    required: false,
                },
                accountStatus: {
                    description: 'verified/unverfied',
                    required: false,
                },
                sortKey: {
                    description: 'noOfProperties/createdAt',
                    required: false,
                },
                sortOrder: {
                    description: '-1/1',
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
], AdminHostClass.prototype, "getHosts", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Block",
        path: '/{userId}/block',
        parameters: {
            path: {
                userId: {
                    description: 'mongoId',
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
], AdminHostClass.prototype, "blockHost", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Unblock",
        path: '/{userId}/unblock',
        parameters: {
            path: {
                userId: {
                    description: 'mongoId',
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
], AdminHostClass.prototype, "unblockUsers", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "User Delete",
        path: '/{userId}/delete',
        parameters: {
            path: {
                userId: {
                    description: 'mongoId',
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
], AdminHostClass.prototype, "deleteUsers", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Details",
        path: '/{userId}/details',
        parameters: {
            path: {
                userId: {
                    description: 'mongoId',
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
], AdminHostClass.prototype, "userDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host Verify",
        path: '/{userId}/verify',
        parameters: {
            path: {
                userId: {
                    description: 'mongoId',
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
], AdminHostClass.prototype, "verifyHost", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Host Property Details",
        path: '/{id}/propertyDetails',
        parameters: {
            path: {
                id: {
                    description: 'Host Id',
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
], AdminHostClass.prototype, "propertyDetails", null);
AdminHostClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/host",
        name: "Admin Host Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminHostClass);
exports.AdminHostController = new AdminHostClass();
//# sourceMappingURL=admin.host.controller.js.map