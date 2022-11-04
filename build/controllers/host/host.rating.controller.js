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
exports.HostRatingController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
let HostRatingClass = class HostRatingClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async ratingReply(req, res, next) {
        try {
            let payload = req.body;
            let userId = res.locals.userId;
            await _entity_1.RatingV1.updateEntity({ _id: payload.reviewId }, {
                reply: [{
                        userId: userId,
                        review: payload.review
                    }]
            }, { new: true });
            await _entity_1.BookingV1.updateEntity({ 'reviewData._id': payload.reviewId }, {
                'reviewData.reply': [{
                        userId: userId,
                        review: payload.review
                    }]
            }, { new: true });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async getRatingList(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            payload.userData = res.locals.userData;
            let result = await _entity_1.RatingV1.getRatingList(Object.assign({}, payload));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async deleteRatingAndReviews(req, res, next) {
        try {
            const payload = req.query;
            await _entity_1.RatingV1.updateEntity({ bookingId: mongoose_1.Types.ObjectId(payload.bookingId) }, { reply: [] }, { multi: true });
            await _entity_1.BookingV1.updateEntity({ bookingId: mongoose_1.Types.ObjectId(payload.bookingId) }, {
                'reviewData.reply': []
            }, { multi: true });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error in deleteRatingAndReviews ==> ${err}`);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "reply to rating",
        path: '/reply',
        parameters: {
            body: {
                description: 'Reply to rating',
                required: true,
                model: 'ReqHostRatingModel'
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
], HostRatingClass.prototype, "ratingReply", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "ratings list",
        path: '',
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
                rating: {
                    description: 'rating',
                    required: false,
                },
                sortBy: {
                    description: '1 Asc -1 desc',
                    required: false,
                },
                cityId: {
                    description: 'city Id',
                    required: false,
                },
                stateId: {
                    description: 'city Id',
                    required: false,
                },
                countryId: {
                    description: 'city Id',
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
], HostRatingClass.prototype, "getRatingList", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "Review Delete",
        path: '',
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
], HostRatingClass.prototype, "deleteRatingAndReviews", null);
HostRatingClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/rating",
        name: "Host Rating Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], HostRatingClass);
exports.HostRatingController = new HostRatingClass();
//# sourceMappingURL=host.rating.controller.js.map