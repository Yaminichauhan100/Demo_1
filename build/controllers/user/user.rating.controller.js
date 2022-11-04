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
exports.UserRatingController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const _services_1 = require("@services");
const mongoose_1 = require("mongoose");
let UserRatingClass = class UserRatingClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async addRatingAndReviews(req, res, next) {
        try {
            let payload = req.body;
            let userId = res.locals.userId;
            payload.review ? payload.review = payload.review : payload.review = "";
            payload['status'] = _common_1.CONSTANT.STATUS.ACTIVE;
            payload['createdAt'] = new Date();
            let ratingData = await _entity_1.RatingV1.updateDocument({
                bookingId: payload.bookingId, propertyId: payload.propertyId, userId: userId
            }, Object.assign(Object.assign(Object.assign({}, payload), { userId }), {
                status: _common_1.CONSTANT.STATUS.ACTIVE,
                isFeatured: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }), { upsert: true, new: true });
            let rating = await _entity_1.PropertyV1.updateAverageRatingAndCount(payload);
            await Promise.all([
                _entity_1.PropertyV1.updateDocument({ _id: payload.propertyId }, { 'rating.count': rating[0].count, 'rating.avgRating': await _services_1.roundOffNumbers(rating[0].avgRating) }),
                _entity_1.BookingV1.updateDocument({ _id: payload.bookingId }, { reviewData: ratingData }, { new: true })
            ]);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error in updating rating ==> ${err}`);
            next(err);
        }
    }
    async getPropertyRatingList(req, res, next) {
        try {
            let query = req.query;
            let userId = res.locals.userId;
            let result = await _entity_1.RatingV1.getPropertyRatingList(Object.assign(Object.assign({}, query), userId));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
        }
        catch (err) {
            next(err);
        }
    }
    async deleteRatingAndReviews(req, res, next) {
        try {
            let payload = req.query;
            let userId = res.locals.userId;
            let ratingData = await Promise.all([
                _entity_1.RatingV1.remove({ bookingId: mongoose_1.Types.ObjectId(payload.bookingId), userId: mongoose_1.Types.ObjectId(userId) }),
                _entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, { reviewData: { reply: [] } }),
            ]);
            let rating = await _entity_1.PropertyV1.updateAverageRatingAndCount(ratingData[1].propertyData);
            if (rating && rating.length) {
                await _entity_1.PropertyV1.updateDocument({ _id: ratingData[1].propertyData.propertyId }, { 'rating.count': rating[0].count, 'rating.avgRating': await _services_1.roundOffNumbers(rating[0].avgRating) });
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error in updating rating ==> ${err}`);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add ratings and review",
        path: '',
        parameters: {
            body: {
                description: 'Body for add rating and review',
                required: true,
                model: 'ReqRatingModel'
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
], UserRatingClass.prototype, "addRatingAndReviews", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property ratings list",
        path: '/list',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: true,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                propertyId: {
                    description: 'propertyId',
                    required: false,
                },
                sortBy: {
                    description: '1 Asc -1 desc',
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
], UserRatingClass.prototype, "getPropertyRatingList", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "Review Delete",
        path: '',
        parameters: {
            path: {
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
], UserRatingClass.prototype, "deleteRatingAndReviews", null);
UserRatingClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/user/rating",
        name: "User rating Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], UserRatingClass);
exports.UserRatingController = new UserRatingClass();
//# sourceMappingURL=user.rating.controller.js.map