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
exports.UserEmployeeController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
let UserEmployeeClass = class UserEmployeeClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async fetchEmployeeProperties(req, res, next) {
        try {
            const payload = req.query;
            payload['headers'] = req.headers;
            const userId = res.locals.userId;
            const employeePropertyList = await _entity_1.EmployeeV1.fetchAssociatedProperties(payload, userId);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, employeePropertyList);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async fetchUniqueAssociatedCountries(req, res, next) {
        try {
            const userId = res.locals.userId;
            const distinctPropertyIds = await _entity_1.EmployeeV1.fetchDistinctPropertyIds(userId);
            const distinctCountryIds = await _entity_1.EmployeeV1.fetchDistinctCountryIds(distinctPropertyIds);
            const uniqueCountryList = await _entity_1.CountriesV1.fetchUniqueCountries(distinctCountryIds);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, uniqueCountryList);
        }
        catch (err) {
            console.error(`we have an error fetchCountryStateCityListing ==> ${err}`);
            next(err);
        }
    }
    async fetchUniqueAssociatedStates(req, res, next) {
        try {
            const payload = req.params;
            const userId = res.locals.userId;
            const distinctPropertyIds = await _entity_1.EmployeeV1.fetchDistinctPropertyIds(userId);
            const distinctStateIds = await _entity_1.EmployeeV1.fetchDistinctStateIds(distinctPropertyIds);
            const uniqueStateList = await _entity_1.StatesV1.fetchUniqueStates(distinctStateIds, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, uniqueStateList);
        }
        catch (err) {
            console.error(`we have an error fetchUniqueAssociatedStates ==> ${err}`);
            next(err);
        }
    }
    async fetchUniqueAssociatedCity(req, res, next) {
        try {
            const payload = req.params;
            const userId = res.locals.userId;
            const distinctPropertyIds = await _entity_1.EmployeeV1.fetchDistinctPropertyIds(userId);
            const distinctCityIds = await _entity_1.EmployeeV1.fetchDistinctCityIds(distinctPropertyIds);
            const uniqueCityList = await _entity_1.CityV1.fetchUniqueCities(distinctCityIds, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, uniqueCityList);
        }
        catch (err) {
            console.error(`we have an error fetchUniqueAssociatedCity ==> ${err}`);
            next(err);
        }
    }
    async fetchPropertyDetails(req, res, next) {
        try {
            const payload = req.query;
            let propertyDetails = await _entity_1.PropertyV1.fetchPropertyDetails(payload);
            if (propertyDetails.length == 0)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_NOT_ACTIVE);
            switch (payload.userType) {
                case _common_1.CONSTANT.PROPERTY_USER_TYPE.USER:
                    let count = await _entity_1.EmployeeV1.fetchPropertyDetailsBookingType(payload);
                    propertyDetails[0].isPartnerProperty = false;
                    propertyDetails[0].floorCount = count;
                    break;
                case _common_1.CONSTANT.PROPERTY_USER_TYPE.EMPLOYEE:
                    let floorCount = await _entity_1.EmployeeV1.fetchPropertyDetailsforEmployee(payload);
                    propertyDetails[0].isPartnerProperty = true;
                    propertyDetails[0].floorCount = floorCount;
                    break;
            }
            if (payload.userId && propertyDetails.status == _common_1.ENUM.PROPERTY.STATUS.ACTIVE)
                await _entity_1.PropertyV1.updateAnalytics(payload, propertyDetails[0].userData.userId);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyDetails[0]);
        }
        catch (err) {
            console.error(`we have an error in fetchPropertyDetails ==> ${err}`);
            next(err);
        }
    }
    async fetchFloorData(req, res, next) {
        try {
            let payload = req.query;
            const headers = req.headers;
            payload.offset = parseInt(headers.offset);
            switch (payload.userType) {
                case _common_1.CONSTANT.PROPERTY_USER_TYPE.USER:
                    let result = await _entity_1.EmployeeV1.fetchUserPropertyDetailsViaPropertySpace(payload);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
                case _common_1.CONSTANT.PROPERTY_USER_TYPE.EMPLOYEE:
                    let response;
                    response = await _entity_1.EmployeeV1.fetchEmployeePropertyDetailsViaPropertySpace(payload);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
            }
        }
        catch (error) {
            console.error(`we have an error in fetchFloorData ==> ${error}`);
            next(error);
        }
    }
    async bookSpaceForEmployee(req, res, next) {
        try {
            const { cartId, occupancy, prolongBookingId } = req.body;
            let payload = req.body;
            if (!(payload === null || payload === void 0 ? void 0 : payload.extended)) {
                payload['extended'] = false;
            }
            const headers = req.headers;
            const cartData = await _entity_1.BookingCartV1.findOne({ _id: mongoose_1.Types.ObjectId(cartId) }, { __v: 0, createdAt: 0, updatedAt: 0 });
            if (!cartData)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_CART);
            cartData['occupancy'] = occupancy;
            cartData['prolongBookingId'] = prolongBookingId;
            const response = await _entity_1.BookingV1.userEmployeeBookSpace(cartData, headers, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error in bookSpaceForEmployee controller ==> ${error}`);
            next(error);
        }
    }
    async employeeCheckoutProperty(req, res, next) {
        try {
            const payload = req.body;
            const bookingDetail = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.bookingId) });
            if (bookingDetail) {
                const response = await _entity_1.BookingV1.updateEmployeeBookingStatus(payload, bookingDetail, req);
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
            }
            else {
                throw new Error(`no such booking found`);
            }
        }
        catch (error) {
            console.error(`we have an error in bookSpaceForEmployee controller ==> ${error}`);
            next(error);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property Details",
        path: '/details',
        parameters: {
            query: {
                propertyId: {
                    description: 'mongoId',
                    required: true,
                },
                partnerId: {
                    description: 'mongoId',
                    required: false,
                },
                userId: {
                    description: 'mongoId',
                    required: false,
                },
                userType: {
                    description: 'user type enum ',
                    required: true,
                },
                bookingType: {
                    description: 'user type enum ',
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
], UserEmployeeClass.prototype, "fetchPropertyDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property Details",
        path: '/floorData',
        parameters: {
            query: {
                propertyId: {
                    description: 'mongoId',
                    required: true,
                },
                partnerId: {
                    description: 'mongoId',
                    required: false,
                },
                userType: {
                    description: 'mongoId',
                    required: false,
                },
                floorNumber: {
                    description: 'user type enum ',
                    required: true,
                },
                bookingType: {
                    description: 'booking type enum ',
                    required: true,
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
], UserEmployeeClass.prototype, "fetchFloorData", null);
UserEmployeeClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/user/employee",
        name: "User employee Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], UserEmployeeClass);
exports.UserEmployeeController = new UserEmployeeClass();
//# sourceMappingURL=user.employee.controller.js.map