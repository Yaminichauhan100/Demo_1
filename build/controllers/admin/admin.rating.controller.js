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
exports.AdminRatingController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
let AdminRatingClass = class AdminRatingClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getRatingList(req, res, next) {
        try {
            let params = req.query;
            let ratingList = await _entity_1.RatingV1.getAdminRatingList(Object.assign({}, params));
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, ratingList);
        }
        catch (err) {
            next(err);
        }
    }
    async getRatingInfo(req, res, next) {
        try {
            let params = req.query;
            let ratingList = await _entity_1.RatingV1.getAdminRatingInfo(Object.assign({}, params));
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, ratingList);
        }
        catch (err) {
            next(err);
        }
    }
    async updateRatingsFeatureStatus(req, res, next) {
        try {
            let payload = req.body;
            let rating = await _entity_1.RatingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) });
            if (!rating)
                return await this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).RATING_NOT_FOUND);
            let featuredRatingCount = await _entity_1.RatingV1.count({ isFeatured: 1 });
            if (featuredRatingCount && featuredRatingCount >= 6 && (payload === null || payload === void 0 ? void 0 : payload.isFeatured)) {
                return await this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).RATING_FEATURED_LIMIT);
            }
            await Promise.all([
                _entity_1.RatingV1.updateEntity({ _id: payload.id }, { isFeatured: payload.isFeatured }),
                _entity_1.BookingV1.updateEntity({ 'reviewData._id': payload.id }, { 'reviewData.isFeatured': payload.isFeatured }),
            ]);
            return await this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).RATING_UPDATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Rating listing",
        path: '',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                rating: {
                    description: '1,2',
                    required: false,
                },
                propertyId: {
                    description: 'propertyId',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                startDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                endDate: {
                    description: '2021-04-01T10:30:49.426Z',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                sortBy: {
                    description: '1 and -1',
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
], AdminRatingClass.prototype, "getRatingList", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "rating Info",
        path: '/info',
        parameters: {
            query: {
                ratingId: {
                    description: 'ratingId',
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
], AdminRatingClass.prototype, "getRatingInfo", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Update Rating Featured status",
        path: '/isFeatured',
        parameters: {
            body: {
                description: 'Body for add faetures amenities',
                required: true,
                model: 'ReqUpdateAmenitiesFeatureModel'
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
], AdminRatingClass.prototype, "updateRatingsFeatureStatus", null);
AdminRatingClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/rating",
        name: "Admin Rating Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminRatingClass);
exports.AdminRatingController = new AdminRatingClass();
//# sourceMappingURL=admin.rating.controller.js.map