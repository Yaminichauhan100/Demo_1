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
exports.HostOfflineBookingController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const _builders_1 = __importDefault(require("@builders"));
let HostOfflineBookingClass = class HostOfflineBookingClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async addUserDetail(req, res, next) {
        try {
            let payload = req.body;
            let userData = await _entity_1.OfflineUserV1.addOfflineUser(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, userData);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async createBookingCart(req, res, next) {
        try {
            let payload = req.body;
            const headers = req.headers;
            payload.hostId = res.locals.userId;
            let [userDetail, hostDetails] = await Promise.all([
                _entity_1.OfflineUserV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { _id: 1, name: 1, status: 1, image: 1, createdAt: 1, fullMobileNumber: 1, email: 1, countryCode: 1 }),
                _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.hostId) }, { commissionAmount: 1 })
            ]);
            payload.commissionAmount = hostDetails.commissionAmount;
            if (!userDetail)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).USER_NOT_FOUND);
            let propertyDetail = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, {
                propertyId: 1,
                status: 1,
                name: 1,
                images: 1,
                userId: 1,
                address: 1,
                autoAcceptUpcomingBooking: 1,
                "userData.name": 1,
                "userData.image": 1,
                "userData.email": 1,
                "userData.userId": 1
            });
            let spaceIds = [];
            payload.spaceId.split(',').forEach((element) => {
                spaceIds.push(mongoose_1.Types.ObjectId(element));
            });
            payload.spaceIds = spaceIds;
            let spacePrice = await _entity_1.PropertySpaceV1.findMany({ _id: { $in: spaceIds } });
            const response = await _entity_1.OfflineUserV1.addSpaceToCart(payload, headers, next, userDetail, propertyDetail, spacePrice);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async bookOfflineSpace(req, res, next) {
        try {
            const { cartId, occupancy } = req.body;
            const headers = req.headers;
            const offset = parseInt(headers.offset);
            const cartData = await _entity_1.BookingCartV1.findOne({ _id: mongoose_1.Types.ObjectId(cartId) }, { __v: 0, createdAt: 0, updatedAt: 0 });
            if (cartData.totalPayable == 0)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PRICE_TOO_LOW);
            cartData.occupancy = occupancy;
            let response = await _entity_1.OfflineUserV1.userBookSpace(cartData, headers, offset);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error in offline user booking controller ==> ${error}`);
            next(error);
        }
    }
    async updateOfflineBooking(req, res, next) {
        try {
            const payload = req.body;
            const cartData = await _entity_1.BookingCartV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cartId) }, { __v: 0, createdAt: 0, updatedAt: 0 });
            if (!cartData)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_CART);
            if (cartData.totalPayable == 0)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PRICE_TOO_LOW);
            const bookingData = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId), bookingMode: 1 }, { __v: 0, createdAt: 0, updatedAt: 0 });
            if (!bookingData)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_BOOKING_ID);
            let response = await _entity_1.OfflineUserV1.userUpdateOfflineBooking(cartData, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error in offline user booking controller ==> ${error}`);
            next(error);
        }
    }
    async getOfflineUserDetail(req, res, next) {
        try {
            let payload = req.params;
            let userData = await _entity_1.OfflineUserV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, userData);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async updateOfflineUserDetail(req, res, next) {
        try {
            let payload = req.body;
            let userData = await _entity_1.OfflineUserV1.updateOfflineUser(payload, payload.offlineUserId);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, userData);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async fetchPropertyDetails(req, res, next) {
        try {
            const payload = req.query;
            payload['userId'] = res.locals.userId;
            const headers = req.headers;
            const offset = parseInt(headers.offset);
            payload['offset'] = offset;
            let holidayProperties = await _builders_1.default.User.UserPropertyBuilder.HolidaysPropertyList(payload);
            payload['holidayProperties'] = holidayProperties;
            let propertyDetails = await _entity_1.PropertyV1.fetchPropertyListingForOffline(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyDetails);
        }
        catch (err) {
            console.error(`we have an error in fetchPropertyDetails ==> ${err}`);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Host offline booking",
        path: '/user',
        parameters: {
            body: {
                description: 'Body for adding offline booking user details',
                required: false,
                model: 'ReqOfflineBooking'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostOfflineBookingClass.prototype, "addUserDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "add space to cart",
        path: '/addSpaceCart',
        parameters: {
            body: {
                description: 'Body for space cart',
                required: true,
                model: 'ReqSpaceCartModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostOfflineBookingClass.prototype, "createBookingCart", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Complete offline booking",
        path: '/bookSpace',
        parameters: {
            body: {
                description: 'Body for updating booking',
                required: true,
                model: 'ReqSpaceBookingModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostOfflineBookingClass.prototype, "bookOfflineSpace", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "update offline booking",
        path: '/bookSpace',
        parameters: {
            body: {
                description: 'Body for space booking',
                required: true,
                model: 'ReqUpdateOfflineBookingModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostOfflineBookingClass.prototype, "updateOfflineBooking", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get User booking Id",
        path: '/user/{id}',
        parameters: {
            path: {
                id: {
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
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostOfflineBookingClass.prototype, "getOfflineUserDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Update offline user details",
        path: '/user',
        parameters: {
            body: {
                description: 'Body for updating offline booking user details',
                required: false,
                model: 'ReqOfflineUser'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostOfflineBookingClass.prototype, "updateOfflineUserDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get User booking Id",
        path: '/listing',
        parameters: {
            query: {
                userType: {
                    description: 'normal user or employee',
                    required: true,
                },
                bookingType: {
                    description: 'hourly, monthly or custom',
                    required: true,
                },
                fromDate: {
                    description: 'start date',
                    required: true,
                },
                toDate: {
                    description: 'end date',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostOfflineBookingClass.prototype, "fetchPropertyDetails", null);
HostOfflineBookingClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/offline",
        name: "Host Offline Booking Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], HostOfflineBookingClass);
exports.HostOfflineBookingController = new HostOfflineBookingClass();
//# sourceMappingURL=host.offline.booking.controller.js.map