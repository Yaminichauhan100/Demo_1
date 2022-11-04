"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const host_promotion_model_1 = __importDefault(require("@models/host.promotion.model"));
const _common_1 = require("@common");
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
const _entity_1 = require("@entity");
const _services_1 = require("@services");
class HostPromotionEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createPromotionEntity(payload) {
        try {
            return await this.createOne(payload);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
    async endPromotion(promotionId) {
        try {
            await this.updateDocument({ _id: mongoose_1.Types.ObjectId(promotionId) }, { promotionStatus: _common_1.ENUM.PROPERTY.PROMOTION_STATUS.EXPIRED });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async startPromotion(promotionId) {
        try {
            let promotionDetail = await this.updateDocument({ _id: mongoose_1.Types.ObjectId(promotionId) }, { promotionStatus: _common_1.ENUM.PROPERTY.PROMOTION_STATUS.ONGOING });
            const expireTime = _services_1.calculateDiffInSeconds(promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.fromDate, false, promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.toDate);
            await _services_1.redisDOA.setKey(`${_common_1.ENUM.PROPERTY.PROMOTION_FLAG.END}_${promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail._id}`, promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.fromDate);
            await _services_1.redisDOA.expireKey(`${_common_1.ENUM.PROPERTY.PROMOTION_FLAG.END}_${promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail._id}`, expireTime);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async checkSlotAvailability(payload) {
        try {
            let flag = true;
            return flag;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
    async updateAdAnalytics(propertyId, userId) {
        var _a, _b, _c;
        try {
            let pipeline = [];
            let filterConditions = { $match: { $and: [] } };
            pipeline.push({
                $match: {
                    "status": _common_1.ENUM.PROPERTY.STATUS.ACTIVE,
                    _id: mongoose_1.Types.ObjectId(propertyId)
                }
            }, {
                '$lookup': {
                    from: 'promotions',
                    let: {
                        propertyId: '$_id'
                    },
                    pipeline: [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$propertyId',
                                                '$$propertyId'
                                            ]
                                        },
                                        {
                                            '$eq': [
                                                '$promotionStatus',
                                                0
                                            ]
                                        },
                                        {
                                            '$eq': [
                                                '$listingType',
                                                1
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        { $limit: 3 },
                        { $project: { slotType: 1 } }
                    ],
                    as: 'promotions'
                }
            }, {
                $unwind: {
                    path: "$promotions",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                "$lookup": {
                    "from": "propertySpace",
                    "let": { "propertyId": "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ['$propertyId', '$$propertyId'] },
                                        { $eq: ["$status", 'active'] }
                                    ]
                                }
                            }
                        },
                        { $project: { "categoryName": "$category.name", pricing: 1, "categoryId": "$category._id", "capacity": "$capacity", "subCategoryName": "$subCategory.name" } }
                    ],
                    "as": "spaceDetails"
                }
            });
            filterConditions.$match.$and.push({ 'spaceDetails': { $ne: [] } });
            pipeline.push({ '$project': { promotions: 1 } });
            let propertyResponse = await _entity_1.PropertyV1.basicAggregate(pipeline);
            if ((_a = propertyResponse[0]) === null || _a === void 0 ? void 0 : _a.promotions) {
                await exports.PromotionV1.update({ _id: mongoose_1.Types.ObjectId((_c = (_b = propertyResponse[0]) === null || _b === void 0 ? void 0 : _b.promotions) === null || _c === void 0 ? void 0 : _c._id) }, {
                    $inc: {
                        "analytics.viewCount": 1
                    },
                });
            }
        }
        catch (error) {
            console.error(`we have an error while updating analytics ==> ${error}`);
        }
    }
    async calculateDates(duration, offset) {
        try {
            switch (duration) {
                case _common_1.ENUM.PROPERTY.PROMOTION.DURATION.DAILY:
                    {
                        const today = moment_1.default().endOf('day').subtract(offset, "minute").toDate();
                        let response = {};
                        response['fromDate'] = today;
                        response['toDate'] = moment_1.default(today).endOf('day').add(1, 'd').subtract(offset, "minute").toDate();
                        return response;
                    }
                case _common_1.ENUM.PROPERTY.PROMOTION.DURATION.WEEKLY:
                    {
                        const today = moment_1.default().endOf('day').subtract(offset, "minute").toDate();
                        let response = {};
                        response['fromDate'] = today;
                        response['toDate'] = moment_1.default(today).endOf('day').add(1, 'w').subtract(offset, "minute").toDate();
                        return response;
                    }
                case _common_1.ENUM.PROPERTY.PROMOTION.DURATION.MONTHLY:
                    {
                        const today = moment_1.default().endOf('day').subtract(offset, "minute").toDate();
                        let response = {};
                        response['fromDate'] = today;
                        response['toDate'] = moment_1.default(today).endOf('day').add(1, 'M').subtract(offset, "minute").toDate();
                        return response;
                    }
            }
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
}
exports.PromotionV1 = new HostPromotionEntity(host_promotion_model_1.default);
//# sourceMappingURL=host.promotions.v1.entity.js.map