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
exports.UserCoworkerController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const htmlHelper_1 = require("../../htmlHelper");
const _services_1 = require("@services");
let UserCoworkerClass = class UserCoworkerClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async checkCoworkerEmail(req, res, next) {
        try {
            let payload = req.query;
            let spaceLimitCheckResponse = await _entity_1.CoworkerV1.spaceLimitCheck(payload.bookingId);
            if (!spaceLimitCheckResponse) {
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CHECK_AVAILABILITY);
            }
            let checkInvited = await _entity_1.CoworkerV1.findOne({ email: payload.email, bookingId: payload.bookingId });
            if (checkInvited)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).COWORKER_EXISTS);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async sendInvite(req, res, next) {
        try {
            let payload = req.body;
            let dataToSave;
            let promise = [];
            let promiseData = [];
            let spaceLimitCheckResponse = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, { occupancy: 1, propertyData: 1, coworker: 1, hostId: 1, quantity: 1, userData: 1, bookingId: 1, coworkerCount: 1 });
            if (!spaceLimitCheckResponse)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
            let remainingOcuupancy = parseInt(spaceLimitCheckResponse.occupancy) * parseInt(spaceLimitCheckResponse.quantity) - parseInt(spaceLimitCheckResponse.coworkerCount) - 1;
            if (remainingOcuupancy < payload.email.length) {
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CHECK_AVAILABILITY);
            }
            let checkSelf = 0;
            payload.email.forEach((coworkerEmail) => {
                if (coworkerEmail == spaceLimitCheckResponse.userData.email) {
                    checkSelf++;
                }
            });
            if (checkSelf > 0)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).CHECK_SELF);
            for (let i = 0; i < payload.email.length; i++) {
                let userDataFromDb = await _entity_1.UserV1.findOne({ email: payload.email });
                if (!userDataFromDb) {
                    dataToSave = {
                        email: payload.email[i],
                        userId: res.locals.userId,
                        ownerDetail: spaceLimitCheckResponse.userData,
                        bookingId: payload.bookingId,
                        bookingNumber: spaceLimitCheckResponse.bookingId,
                        propertyId: spaceLimitCheckResponse.propertyData.propertyId,
                        hostId: spaceLimitCheckResponse.hostId
                    };
                    promise.push(_entity_1.CoworkerV1.createUser(dataToSave));
                    promise.push(_entity_1.BookingV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, { $inc: { coworkerCount: 1 } }));
                    promise.push(_entity_1.CoworkerV1.updateOne({
                        bookingId: spaceLimitCheckResponse._id,
                        userId: spaceLimitCheckResponse.userData.userId
                    }, {
                        name: spaceLimitCheckResponse.userData.name,
                        email: spaceLimitCheckResponse.userData.email,
                        status: 1,
                        image: spaceLimitCheckResponse.userData.image,
                        ownerDetail: spaceLimitCheckResponse.userData,
                        userId: spaceLimitCheckResponse.userData.userId,
                        bookingId: spaceLimitCheckResponse._id,
                        bookingNumber: spaceLimitCheckResponse.bookingId,
                        isOwner: 1,
                        propertyId: spaceLimitCheckResponse.propertyData.propertyId,
                        hostId: spaceLimitCheckResponse.hostId,
                    }, { upsert: true }));
                    promiseData = await Promise.all(promise);
                }
                else {
                    dataToSave = {
                        name: userDataFromDb.name ? userDataFromDb.name : "N/A",
                        email: userDataFromDb.email,
                        image: userDataFromDb.image ? userDataFromDb.image : "https://appinventiv-development.s3.amazonaws.com/u_placeholder.jpeg",
                        userId: res.locals.userId,
                        ownerDetail: spaceLimitCheckResponse.userData,
                        coworkerId: userDataFromDb._id ? userDataFromDb._id : "N/A",
                        bookingId: payload === null || payload === void 0 ? void 0 : payload.bookingId,
                        bookingNumber: spaceLimitCheckResponse === null || spaceLimitCheckResponse === void 0 ? void 0 : spaceLimitCheckResponse.bookingId,
                        propertyId: spaceLimitCheckResponse === null || spaceLimitCheckResponse === void 0 ? void 0 : spaceLimitCheckResponse.propertyData.propertyId,
                        hostId: spaceLimitCheckResponse === null || spaceLimitCheckResponse === void 0 ? void 0 : spaceLimitCheckResponse.hostId
                    };
                    promise.push(_entity_1.CoworkerV1.createUser(dataToSave));
                    promise.push(_entity_1.BookingV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, {
                        $addToSet: { coworker: { $each: [userDataFromDb._id] } },
                        $inc: { coworkerCount: 1 }
                    }));
                    promiseData = await Promise.all(promise);
                }
                let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/co-worker-invite.html", {
                    logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                    facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                    mockpur: _common_1.CONSTANT.MOCKUPER_6,
                    appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                    googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                    igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                    twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                    linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                    propertyName: spaceLimitCheckResponse.propertyData.name,
                    complementaryLogo: _common_1.CONSTANT.COMPLEMENTRAY_2,
                    userName: spaceLimitCheckResponse.userData.name,
                    webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                    contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                    FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                    redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                    appStoreLink: _common_1.STORE_URL.APPSTORE_USER,
                    playStoreLink: _common_1.STORE_URL.PLAYSOTE_USER
                });
                _services_1.emailService.sendCoworkerInvite(userHtml, payload.email[i], spaceLimitCheckResponse.userData.name, spaceLimitCheckResponse.propertyData.name);
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, promiseData[0]);
        }
        catch (err) {
            console.error(`We have an error ==> ${err}`);
            next(err);
        }
    }
    async coworkersList(req, res, next) {
        try {
            let response = await _entity_1.CoworkerV1.findMany({ userId: mongoose_1.Types.ObjectId(res.locals.userId), isOwner: 0, bookingId: req.params.bookingId });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async removeCoworker(req, res, next) {
        try {
            let payload = req.query;
            let checkInvited = await _entity_1.CoworkerV1.findOne({ email: payload.email, bookingId: payload.bookingId });
            if (!checkInvited)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            await Promise.all([
                _entity_1.CoworkerV1.remove({ _id: checkInvited._id }),
                _entity_1.BookingV1.updateOne({ _id: payload.bookingId }, { $pull: { coworker: checkInvited.coworkerId }, $inc: { "coworkerCount": -1 } })
            ]);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchCoworkersContactList(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            let contactList = await _entity_1.CoworkerV1.fetchUserContactList(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, contactList);
        }
        catch (err) {
            console.error(`we have an error while fetching coworker contact list ===> ${err}`);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "user check email",
        path: '/checkCoworkerEmailExists',
        parameters: {
            query: {
                email: {
                    description: 'email',
                    required: true,
                },
                bookingId: {
                    description: 'booking id',
                    required: true,
                },
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
], UserCoworkerClass.prototype, "checkCoworkerEmail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User Update Profile",
        path: '/send-invite',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqCoworkerInviteModel'
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
], UserCoworkerClass.prototype, "sendInvite", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Reset Password",
        path: '/{bookingId}',
        parameters: {
            path: {
                bookingId: {
                    description: 'bookingId',
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
], UserCoworkerClass.prototype, "coworkersList", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "User Update Profile",
        path: '/remove',
        parameters: {
            query: {
                email: {
                    description: 'email',
                    required: true,
                },
                bookingId: {
                    description: 'booking id',
                    required: true,
                },
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
], UserCoworkerClass.prototype, "removeCoworker", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Get Contact Coworker",
        path: '/contactList',
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
                sortBy: {
                    description: 'name/createdAt',
                    required: false,
                },
                sortOrder: {
                    description: '1,-1',
                    required: false,
                },
                search: {
                    description: 'name/email',
                    required: false,
                },
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
], UserCoworkerClass.prototype, "fetchCoworkersContactList", null);
UserCoworkerClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/user/coworker",
        name: "User coworker Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], UserCoworkerClass);
exports.UserCoworkerController = new UserCoworkerClass();
//# sourceMappingURL=user.coworker.controller.js.map