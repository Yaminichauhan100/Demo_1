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
exports.HostDashboardController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _builders_1 = __importDefault(require("@builders"));
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
let HostDashboardClass = class HostDashboardClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getBookingStatusList(req, res, next) {
        try {
            let payload = req.query;
            let userId = res.locals.userId;
            var now = new Date();
            const headers = req.headers;
            const offset = parseInt(headers.offset);
            payload["offset"] = -Number(offset);
            let pipeline = await Promise.all([
                _builders_1.default.User.DashboardBuiler.bookingListing(payload, userId),
                _builders_1.default.User.DashboardBuiler.ongoingBookingListing(payload, userId),
                _builders_1.default.User.DashboardBuiler.bookingRequestListing(payload, userId),
                _builders_1.default.User.DashboardBuiler.propertyListing(payload, userId),
                _builders_1.default.User.DashboardBuiler.invoiceAmountCount(payload, userId),
                _builders_1.default.User.DashboardBuiler.payoutAmountCount(payload, userId)
            ]);
            let bookingData = await Promise.all([
                _entity_1.BookingV1.basicAggregate(pipeline[0]),
                _entity_1.BookingV1.basicAggregate(pipeline[1]),
                _entity_1.BookingV1.basicAggregate(pipeline[2]),
                _entity_1.PropertyV1.basicAggregate(pipeline[3]),
                _entity_1.BookingV1.basicAggregate(pipeline[4]),
                _entity_1.PayV1.basicAggregate(pipeline[5])
            ]);
            if (now.getMonth() + 1 != payload.month || now.getFullYear() != payload.year) {
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                    booingCount: bookingData[0].length,
                    ongoingBookingCount: 0,
                    requestCount: bookingData[2].length,
                    propeties: bookingData[3].length,
                    invoiceAmount: bookingData[4].length > 0 ? bookingData[4][0].count : 0,
                    totalPayout: bookingData[5].length > 0 ? bookingData[5][0].count - (bookingData[5][0].count * .20) : 0,
                });
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                booingCount: bookingData[0].length,
                ongoingBookingCount: bookingData[1].length,
                requestCount: bookingData[2].length,
                propeties: bookingData[3].length,
                invoiceAmount: bookingData[4].length > 0 ? bookingData[4][0].count : 0,
                totalPayout: bookingData[5].length > 0 ? bookingData[5][0].count - (bookingData[5][0].count * .20) : 0,
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async getPropertyAnalyticsData(req, res, next) {
        try {
            let payload = req.query;
            let userId = res.locals.userId;
            switch (payload.type) {
                case "views":
                    let pipeline = await _builders_1.default.User.DashboardBuiler.userAnalyticsData(payload, userId);
                    if (pipeline.length) {
                        let details = await _entity_1.UserAnalyticsV1.basicAggregate(pipeline);
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { viewData: details });
                    }
                    else {
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
                    }
                case "booking":
                    let pipeline2 = await _builders_1.default.User.DashboardBuiler.bookingAnalyticsData(payload, userId);
                    if (pipeline2.length) {
                        let details2 = await _entity_1.BookingV1.basicAggregate(pipeline2);
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { bookingData: details2 });
                    }
                    else {
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
                    }
                default:
                    let bookingData = _builders_1.default.User.DashboardBuiler.bookingAnalyticsData(payload, userId);
                    let userData = _builders_1.default.User.DashboardBuiler.userAnalyticsData(payload, userId);
                    if (bookingData.length && userData.length) {
                        let detailsData = await Promise.all([
                            _entity_1.BookingV1.basicAggregate(bookingData),
                            _entity_1.UserAnalyticsV1.basicAggregate(userData)
                        ]);
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { bookingData: detailsData[0], viewData: detailsData[1] });
                    }
                    else {
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
                    }
            }
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async getCategoryAnalyticsData(req, res, next) {
        var _a, _b, _c, _d, _e;
        try {
            let payload = req.query;
            payload.property = [];
            let property = await _entity_1.PropertyV1.findMany({ userId: mongoose_1.Types.ObjectId(res.locals.userId), status: 'active' });
            property.filter((list) => payload.property.push(mongoose_1.Types.ObjectId(list._id)));
            const headers = req.headers;
            const offset = parseInt(headers.offset);
            payload["offset"] = -Number(offset);
            let userId = res.locals.userId;
            let pipeline = await Promise.all([
                _builders_1.default.User.DashboardBuiler.categoryBookingData(payload, userId),
                _builders_1.default.User.DashboardBuiler.existUnits(payload, userId),
                _builders_1.default.User.DashboardBuiler.calendarDataCategoryWise(payload, userId)
            ]);
            let bookingDetails = await Promise.all([
                _entity_1.BookingV1.basicAggregate(pipeline[0]),
                _entity_1.PropertySpaceV1.basicAggregate(pipeline[1]),
                _entity_1.CalendarV1.basicAggregate(pipeline[2])
            ]);
            let noOfDays;
            if (payload.year && payload.month) {
                noOfDays = await this.daysInThisMonth();
            }
            else {
                noOfDays = await this.daysInThisMonth();
            }
            if (bookingDetails[2].length < bookingDetails[0].length) {
                function inFirstOnly(list1, list2) {
                    return _builders_1.default.User.DashboardBuiler.operation1(list1, list2);
                }
                let inFirst = inFirstOnly(bookingDetails[1], bookingDetails[2]);
                for (let i = 0; i < inFirst.length; i++) {
                    let response = { _id: inFirst[i].subCategory._id, count: 0 };
                    bookingDetails[2].push(response);
                }
            }
            let keys = ['_id'], filtered = bookingDetails[2].filter((s => (o) => (k => !s.has(k) && s.add(k))(keys.map(k => o[k]).join('|')))(new Set));
            bookingDetails[2] = filtered;
            let dashboard = [];
            for (let i = 0; i < bookingDetails[0].length; i++) {
                let k = 0;
                for (let j = 0; j < bookingDetails[1].length; j++) {
                    if (((_b = (_a = bookingDetails[2][i]) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) == ((_e = (_d = (_c = bookingDetails[1][j]) === null || _c === void 0 ? void 0 : _c.subCategory) === null || _d === void 0 ? void 0 : _d._id) === null || _e === void 0 ? void 0 : _e.toString())) {
                        let bookedPercent = bookingDetails[1][j].totalSum * noOfDays;
                        let occupied = bookingDetails[2][i].count;
                        let percentData = (occupied / bookedPercent) * 100;
                        bookingDetails[0][i].percentVal = percentData.toFixed(2);
                        dashboard.push(bookingDetails[0][i]);
                        ++k;
                        break;
                    }
                    if (k == 0 && j == bookingDetails[0].length - 1) {
                        let emptyObj = {
                            bookingCount: 0,
                            cancelllationCount: 0,
                            rejectedCount: 0,
                            completedCount: 0,
                            percentVal: 0
                        };
                        bookingDetails[1][i].bookingCount = emptyObj.bookingCount,
                            bookingDetails[1][i].cancelllationCount = emptyObj.cancelllationCount,
                            bookingDetails[1][i].rejectedCount = emptyObj.rejectedCount,
                            bookingDetails[1][i].completedCount = emptyObj.completedCount,
                            bookingDetails[1][i].percentVal = emptyObj.percentVal,
                            dashboard.push(bookingDetails[1][i]);
                    }
                }
            }
            for (let i = 0; i < dashboard.length; i++) {
                const element = dashboard[i];
                if (element.percentVal > 100) {
                    element.percentVal = 100;
                }
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                subCategoryDetails: dashboard
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async daysInThisMonth() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }
    async getRevenueBasedListing(req, res, next) {
        try {
            let payload = req.query;
            let userId = res.locals.userId;
            const headers = req.headers;
            const offset = parseInt(headers.offset);
            payload["offset"] = -Number(offset);
            let pipeline = await Promise.all([
                _builders_1.default.User.DashboardBuiler.revenueBasedPropertyData(payload, userId),
                _builders_1.default.User.DashboardBuiler.calendarData(payload, userId),
            ]);
            let bookingDetails = await Promise.all([
                _entity_1.PropertyV1.basicAggregate(pipeline[0]),
                _entity_1.CalendarV1.basicAggregate(pipeline[1]),
            ]);
            let calendarData = bookingDetails[1];
            let dashboard = [];
            let daysInCurrentMonth = await this.daysInThisMonth();
            for (let i = 0; i < bookingDetails[0].length; i++) {
                for (let j = 0; j < calendarData.length; j++) {
                    if (bookingDetails[0][i]._id.toString() == calendarData[j]._id.toString()) {
                        let count = bookingDetails[0][i].propertyData.totalCount * daysInCurrentMonth;
                        let finalpercentage = (bookingDetails[1][j].count * 100) / count;
                        bookingDetails[0][i].percentVal = finalpercentage.toFixed(2);
                        dashboard.push(bookingDetails[0][i]);
                        break;
                    }
                }
            }
            const dashboardResponse = await dashboard.map((x) => {
                if (x.percentVal > 100) {
                    return {
                        _id: x._id,
                        name: x.name,
                        propertyData: { totalCount: x.propertyData.totalCount, propertyId: x.propertyData.propertyId },
                        bookingDetails: { count: x.bookingDetails.count, totalPayment: x.bookingDetails.totalPayment },
                        percentVal: 100
                    };
                }
                else
                    return x;
            });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, dashboardResponse);
        }
        catch (error) {
            console.error("Error", error);
        }
    }
    async mapOrder(array, order, key) {
        array.sort(function (a, b) {
            var A = a[key], B = b[key];
            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            }
            else {
                return -1;
            }
        });
        return array;
    }
    ;
    async getRevenueCustomerBasedListing(req, res, next) {
        try {
            let payload = req.query;
            let userId = res.locals.userId;
            let revenuePipeline = _builders_1.default.User.DashboardBuiler.revenueCustomerBasedData(payload, userId);
            let customerPipeline = _builders_1.default.User.DashboardBuiler.overallCustomerData(payload, userId);
            let bookingDetails = await Promise.all([
                _entity_1.BookingV1.basicAggregate(revenuePipeline),
                _entity_1.BookingV1.basicAggregate(customerPipeline)
            ]);
            let totalFirstCustomer = 0;
            let returnCustomer = 0;
            if (!bookingDetails[1].length) {
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                    firstTimeCustomer: 0,
                    returningCustomer: 0
                });
            }
            for (let i = 0; i < bookingDetails[0].length; i++) {
                if (bookingDetails[0][i].userBookingCount === 1)
                    totalFirstCustomer++;
                else
                    returnCustomer++;
            }
            let firstTimeCustomer = (totalFirstCustomer / bookingDetails[1][0].totalCustomers) * 100;
            let returnTimeCustomer = (returnCustomer / bookingDetails[1][0].totalCustomers) * 100;
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                firstTimeCustomer: firstTimeCustomer,
                returningCustomer: returnTimeCustomer
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async getStates(req, res, next) {
        try {
            let stateData;
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let countrId = [];
                let cohost = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "country.id": parseInt(req.params.countryId), accessLevel: { $ne: 4 } }, { state: 1 });
                for (let i = 0; i < cohost.length; i++) {
                    {
                        for (let j = 0; j < cohost[i].state.length; j++) {
                            countrId.push(cohost[i].state[j].id);
                        }
                    }
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(countrId);
                stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
            }
            else {
                let data = await _entity_1.CityV1.findMany({ countryId: req.params.countryId, isDelete: false, status: "active" });
                let payload = [];
                for (let i = 0; i < data.length; i++) {
                    payload.push(data[i].stateId);
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
                stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
            }
            if (stateData.length == 0)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NO_STATE_DATA, []);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
        }
        catch (err) {
            next(err);
        }
    }
    async getCities(req, res, next) {
        try {
            let cityData;
            let cityIds = [];
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let [state, city] = await Promise.all([
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.params.stateId), accessLevel: 2 }, { "state": 1 }),
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.params.stateId), accessLevel: 3 }, { city: 1 })
                ]);
                if (city.length > 0) {
                    for (let i = 0; i < city.length; i++) {
                        for (let j = 0; j < city[i].city.length; j++)
                            cityIds.push(mongoose_1.Types.ObjectId(city[i].city[j]._id));
                    }
                    cityData = await _entity_1.CityV1.findMany({ _id: { $in: cityIds } });
                }
                else if (state.length > 0) {
                    let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
                    cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
                }
            }
            else {
                let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
                cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, cityData);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "booking list",
        path: '',
        parameters: {
            query: {
                countryId: {
                    description: 'id',
                    required: false,
                },
                stateId: {
                    description: 'id',
                    required: false,
                },
                cityId: {
                    description: 'mongoId',
                    required: false,
                },
                propertyId: {
                    description: 'mongoId',
                    required: false,
                },
                year: {
                    description: '2020',
                    required: false,
                },
                month: {
                    description: '06',
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
], HostDashboardClass.prototype, "getBookingStatusList", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "analytics data",
        path: '/property/statistics',
        parameters: {
            query: {
                countryId: {
                    description: 'id',
                    required: false,
                },
                stateId: {
                    description: 'id',
                    required: false,
                },
                cityId: {
                    description: 'mongoId',
                    required: false,
                },
                propertyId: {
                    description: 'mongoId',
                    required: false,
                },
                year: {
                    description: '2020',
                    required: false,
                },
                month: {
                    description: '06',
                    required: false,
                },
                type: {
                    description: 'views/booking',
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
], HostDashboardClass.prototype, "getPropertyAnalyticsData", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "analytics data",
        path: '/category/performance',
        parameters: {
            query: {
                countryId: {
                    description: 'id',
                    required: false,
                },
                stateId: {
                    description: 'id',
                    required: false,
                },
                cityId: {
                    description: 'mongoId',
                    required: false,
                },
                propertyId: {
                    description: 'mongoId',
                    required: false,
                },
                year: {
                    description: '2020',
                    required: false,
                },
                month: {
                    description: '06',
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
], HostDashboardClass.prototype, "getCategoryAnalyticsData", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "analytics data",
        path: '/revenue',
        parameters: {
            query: {
                countryId: {
                    description: 'id',
                    required: false,
                },
                stateId: {
                    description: 'id',
                    required: false,
                },
                cityId: {
                    description: 'mongoId',
                    required: false,
                },
                propertyId: {
                    description: 'mongoId',
                    required: false,
                },
                year: {
                    description: '2020',
                    required: false,
                },
                month: {
                    description: '06',
                    required: false,
                },
                sortOrder: {
                    description: '1/-1',
                    required: false
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
], HostDashboardClass.prototype, "getRevenueBasedListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "analytics data",
        path: '/revenue/customer',
        parameters: {
            query: {
                countryId: {
                    description: 'id',
                    required: false,
                },
                stateId: {
                    description: 'id',
                    required: false,
                },
                cityId: {
                    description: 'mongoId',
                    required: false,
                },
                propertyId: {
                    description: 'mongoId',
                    required: false,
                },
                year: {
                    description: '2020',
                    required: false,
                },
                month: {
                    description: '06',
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
], HostDashboardClass.prototype, "getRevenueCustomerBasedListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getStates/{countryId}',
        parameters: {
            path: {
                countryId: {
                    description: 'countryId',
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
], HostDashboardClass.prototype, "getStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getCities/{stateId}',
        parameters: {
            path: {
                stateId: {
                    description: 'stateId',
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
], HostDashboardClass.prototype, "getCities", null);
HostDashboardClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/dashboard",
        name: "Host dashboard Module",
        security: {
            apiKeyHeader: []
        }
    }),
    __metadata("design:paramtypes", [])
], HostDashboardClass);
exports.HostDashboardController = new HostDashboardClass();
//# sourceMappingURL=host.dashboard.controller.js.map