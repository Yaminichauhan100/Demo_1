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
exports.AdminBookingController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const _builders_1 = __importDefault(require("@builders"));
let AdminBookingClass = class AdminBookingClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async bookingHistory(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Booking.BookingList(payload);
            let data = await _entity_1.BookingV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchBookingDetail(req, res, next) {
        try {
            let response = await _entity_1.AdminV1.fetchBookingDetail(req.query.bookingId);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Host Reset Password",
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
                    description: 'booking id',
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
                categoryId: {
                    description: 'String of categoryIds',
                    required: false,
                },
                subCategoryId: {
                    description: 'String of categoryIds',
                    required: false,
                },
                type: {
                    description: "Request : 0, Accepted : 1, Rejected : 2, OFFLINE: 3",
                    required: false
                },
                sortKey: {
                    description: '0/1',
                    required: false,
                },
                minAmount: {
                    description: '1000',
                    required: false,
                },
                maxAmount: {
                    description: '100000',
                    required: false,
                },
                countryId: {
                    description: '123',
                    required: false,
                },
                cityId: {
                    description: 'objectId',
                    required: false,
                },
                stateId: {
                    description: '38',
                    required: false,
                },
                sortOrder: {
                    description: '-1/1',
                    required: false,
                },
                bookingType: {
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
], AdminBookingClass.prototype, "bookingHistory", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get booking detail for admin",
        path: '/booking',
        parameters: {
            query: {
                bookingId: {
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
], AdminBookingClass.prototype, "fetchBookingDetail", null);
AdminBookingClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/booking",
        name: "Admin Boking Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminBookingClass);
exports.AdminBookingController = new AdminBookingClass();
//# sourceMappingURL=admin.booking.controller.js.map