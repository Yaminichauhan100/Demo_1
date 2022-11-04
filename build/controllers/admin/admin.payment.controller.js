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
exports.AdminPaymentController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const _builders_1 = __importDefault(require("@builders"));
let AdminPaymentClass = class AdminPaymentClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async fetchPaymentListing(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Payment.fetchPaymentListing(payload);
            let data = await _entity_1.PayV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Fetch Payment Listing For Admin",
        path: '/',
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
                bookingAmount: {
                    description: '{min:1,max:100',
                    required: false,
                },
                transactionStatus: {
                    description: 'Refer Enum of transaction status',
                    required: false,
                },
                paymentStatus: {
                    description: 'Refer Enum of payment status',
                    required: false
                },
                bookingStatus: {
                    description: 'Refer Enum of booking status',
                    required: false
                },
                sortkey: {
                    description: 'send -1/1',
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
], AdminPaymentClass.prototype, "fetchPaymentListing", null);
AdminPaymentClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/payment",
        name: "Admin Payment Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminPaymentClass);
exports.AdminPaymentController = new AdminPaymentClass();
//# sourceMappingURL=admin.payment.controller.js.map