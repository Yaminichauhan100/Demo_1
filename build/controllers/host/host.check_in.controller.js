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
exports.UserCheckInController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
let UserCheckInClass = class UserCheckInClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async createCheckInAndOut(req, res, next) {
        try {
            let payload = req.body;
            let userId = res.locals.userId;
            let dataToSave = {};
            let getBookingDetails = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, {});
            if (!getBookingDetails)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BOOKING_NOT_FOUND);
            let promiseArray = [
                _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(getBookingDetails.propertyData.propertyId) }, {}),
                _entity_1.CoworkerV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.coworkerId) }, { _id: 1, name: 1, email: 1, image: 1, userId: 1 }),
                _entity_1.PartnerV1.findOne({ "property._id": mongoose_1.Types.ObjectId(getBookingDetails.propertyData.propertyId) })
            ];
            if (payload.status === _common_1.ENUM.CHECKIN_STATUS.OUT && getBookingDetails.userData.status === _common_1.ENUM.USER.STATUS.ISDELETE) {
                promiseArray.push(_entity_1.BookingV1.updateOne({
                    _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.bookingId)
                }, {
                    "userData.name": "User Deleted",
                    "userData.email": "NA",
                    "userData.image": "",
                    "userData.phoneNo": "NA",
                    "userData.countryCode": "NA"
                }));
            }
            let promise = await Promise.all(promiseArray);
            dataToSave['bookingId'] = getBookingDetails._id;
            dataToSave['bookingNo'] = getBookingDetails.bookingId;
            dataToSave['coworker'] = promise[1];
            dataToSave['userId'] = userId;
            dataToSave['property._id'] = promise[0]._id;
            dataToSave['property.country'] = promise[0].country;
            dataToSave['property.state'] = promise[0].state;
            dataToSave['property.city'] = promise[0].city;
            dataToSave['date'] = payload.date;
            dataToSave['time'] = payload.time;
            dataToSave['status'] = payload.status;
            dataToSave['remark'] = payload.remark;
            await _entity_1.CheckInV1.create(dataToSave);
            if (promise[2]) {
                let searchEmployee = await _entity_1.EmployeeV1.findOne({ userId: mongoose_1.Types.ObjectId(promise[1].userId), partnerId: mongoose_1.Types.ObjectId(promise[2]._id) });
                if (payload.status == 0) {
                    if (searchEmployee)
                        await _entity_1.PartnerV1.update({ _id: mongoose_1.Types.ObjectId(promise[2]._id) }, { $inc: { activeEmployees: 1 } });
                }
                else if (payload.status == 1) {
                    if (searchEmployee)
                        await _entity_1.PartnerV1.update({ _id: mongoose_1.Types.ObjectId(promise[2]._id) }, { $inc: { activeEmployees: -1 } });
                }
            }
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            next(err);
        }
    }
    async checkInActivityLogs(req, res, next) {
        try {
            let params = req.query;
            const headers = req.headers;
            params.offset = parseInt(headers.offset);
            let result = await _entity_1.CheckInV1.searchCheckInUser(params);
            if (params && params.propertyId) {
                let count = await Promise.all([
                    _entity_1.CheckInV1.count({ 'property._id': params.propertyId, status: _common_1.ENUM.CHECKIN_STATUS.IN }),
                    _entity_1.CheckInV1.count({ 'property._id': params.propertyId, status: _common_1.ENUM.CHECKIN_STATUS.OUT }),
                    _entity_1.CoworkerV1.count({ 'propertyId': params.propertyId })
                ]);
                result['count'] = {
                    '0': count[0],
                    '1': count[1],
                    '2': count[2],
                };
            }
            else
                result['count'] = {};
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
        }
        catch (err) {
            next(err);
        }
    }
    async searchCowrker(req, res, next) {
        var _a, _b, _c, _d, _e, _f;
        try {
            let params = req.query;
            if ((params === null || params === void 0 ? void 0 : params.search)) {
                let offlineBooking = await _entity_1.BookingV1.findOne({
                    bookingMode: _common_1.ENUM.BOOKING_MODE.STATUS.OFFLINE,
                    bookingId: params.search
                });
                if (offlineBooking) {
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).OFFLINE_BOOKING_FOUND);
                }
            }
            let result = await _entity_1.CoworkerV1.searchCowrokerCheckInStatus(params);
            if (params && params.propertyId) {
                let [checkIn, checkOut, allCoworkers] = await Promise.all([
                    _entity_1.CoworkerV1.checkInCount(params),
                    _entity_1.CoworkerV1.checkOutCount(params),
                    _entity_1.CoworkerV1.allCoworkerCount(params)
                ]);
                result['count'] = {
                    '0': ((_a = checkIn[0]) === null || _a === void 0 ? void 0 : _a.count) ? (_b = checkIn[0]) === null || _b === void 0 ? void 0 : _b.count : 0,
                    '1': ((_c = checkOut[0]) === null || _c === void 0 ? void 0 : _c.count) ? (_d = checkOut[0]) === null || _d === void 0 ? void 0 : _d.count : 0,
                    '2': ((_e = allCoworkers[0]) === null || _e === void 0 ? void 0 : _e.count) ? (_f = allCoworkers[0]) === null || _f === void 0 ? void 0 : _f.count : 0,
                };
            }
            else
                result['count'] = {};
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
        }
        catch (err) {
            next(err);
        }
    }
    async deleteActivityLogs(req, res, next) {
        try {
            let params = req.query;
            let SearchInCoworker = await _entity_1.CheckInV1.findOne({ _id: mongoose_1.Types.ObjectId(params.checkInId) }, { status: 1, userId: 1, bookingId: 1, createdAt: 1 });
            let searchBookingByPartner = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(SearchInCoworker.bookingId) }, { partnerId: 1 });
            if (SearchInCoworker.status == _common_1.ENUM.CHECKIN_STATUS.IN && searchBookingByPartner.partnerId) {
                let findCheckout = await await _entity_1.CheckInV1.findOne({ bookingId: SearchInCoworker.bookingId, status: _common_1.ENUM.CHECKIN_STATUS.OUT, createdAt: { $gt: SearchInCoworker.createdAt } });
                if (!findCheckout) {
                    await _entity_1.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(searchBookingByPartner.partnerId) }, { $inc: { activeEmployees: -1 } });
                }
            }
            if (SearchInCoworker.status == _common_1.ENUM.CHECKIN_STATUS.OUT && searchBookingByPartner.partnerId) {
                let findCheckout = await _entity_1.CheckInV1.findOne({ bookingId: SearchInCoworker.bookingId, status: _common_1.ENUM.CHECKIN_STATUS.IN, createdAt: { $lt: SearchInCoworker.createdAt } });
                if (findCheckout) {
                    await _entity_1.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(searchBookingByPartner.partnerId) }, { $inc: { activeEmployees: 1 } });
                }
            }
            await _entity_1.CheckInV1.remove({ _id: params.checkInId });
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            next(err);
        }
    }
    async fetchBookingDetail(req, res, next) {
        try {
            const { bookingId, propertyId } = req.params;
            let response = await _entity_1.BookingV1.findOne({
                bookingId: bookingId,
                "propertyData.propertyId": mongoose_1.Types.ObjectId(propertyId),
                bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED }
            }, {
                fromDate: 1,
                toDate: 1,
                bookingMode: 1,
                bookingId: 1,
                bookingStatus: 1,
                _id: 1
            });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create check in by user",
        path: '',
        parameters: {
            body: {
                description: 'check in check out module for co worker',
                required: true,
                model: 'ReqCheckInModel'
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
], UserCheckInClass.prototype, "createCheckInAndOut", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "activity logs for check in checkout",
        path: '',
        parameters: {
            query: {
                page: {
                    description: 'page',
                    required: true,
                },
                limit: {
                    description: 'limit',
                    required: false,
                },
                search: {
                    description: 'search',
                    required: false,
                },
                bookingId: {
                    description: 'bookingId',
                    required: false,
                },
                propertyId: {
                    description: 'propertyId',
                    required: false,
                },
                country: {
                    description: 'country',
                    required: false,
                },
                state: {
                    description: 'state',
                    required: false,
                },
                city: {
                    description: 'city',
                    required: false,
                },
                fromDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
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
], UserCheckInClass.prototype, "checkInActivityLogs", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "search check in check out user",
        path: '/coworkerDetails',
        parameters: {
            query: {
                page: {
                    description: 'page',
                    required: true,
                },
                limit: {
                    description: 'limit',
                    required: false,
                },
                search: {
                    description: 'search',
                    required: false,
                },
                bookingId: {
                    description: 'bookingId',
                    required: false,
                },
                propertyId: {
                    description: 'propertyId',
                    required: false,
                },
                status: {
                    description: 'status',
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
], UserCheckInClass.prototype, "searchCowrker", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "Delete Checkin",
        path: '',
        parameters: {
            query: {
                checkInId: {
                    description: 'checkInId',
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
], UserCheckInClass.prototype, "deleteActivityLogs", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "search check in check out user",
        path: '/booking/{bookingId}/{propertyId}',
        parameters: {
            path: {
                bookingId: {
                    description: 'bookingId',
                    required: false,
                },
                propertyId: {
                    description: 'propertyId',
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
], UserCheckInClass.prototype, "fetchBookingDetail", null);
UserCheckInClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/checkIn",
        name: "CheckIn Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], UserCheckInClass);
exports.UserCheckInController = new UserCheckInClass();
//# sourceMappingURL=host.check_in.controller.js.map