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
exports.AdminGiftCardController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
let AdminGiftCardClass = class AdminGiftCardClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async giftCardListing(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _entity_1.GiftV1.adminGiftCardListing(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, pipeline);
        }
        catch (err) {
            next(err);
        }
    }
    async giftCardInfo(req, res, next) {
        try {
            let payload = req.query;
            let data = await _entity_1.GiftV1.adminGiftCardDetails(payload);
            data && data.length > 0 ? data = data[0] : data = {};
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "admin Gift Card Listing",
        path: '',
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
                fromDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
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
], AdminGiftCardClass.prototype, "giftCardListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "admin Gift Card Detail",
        path: '/info',
        parameters: {
            query: {
                id: {
                    description: '1',
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
], AdminGiftCardClass.prototype, "giftCardInfo", null);
AdminGiftCardClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/giftcard",
        name: "Admin Gift Card Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminGiftCardClass);
exports.AdminGiftCardController = new AdminGiftCardClass();
//# sourceMappingURL=admin.giftcard.controller.js.map