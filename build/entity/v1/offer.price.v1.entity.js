"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPriceV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const offerPrice_model_1 = __importDefault(require("@models/offerPrice.model"));
const _services_1 = require("@services");
const _common_1 = require("@common");
class OPriceEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async saveMultipleOfferPrice(offerDataArray, spaceId, propertyId, offset) {
        try {
            offerDataArray.forEach(async (obj, index) => {
                obj['startDate'] = _common_1.DATABASE.DATE_CONSTANTS.fromDate(obj.startDate, offset);
                obj['endDate'] = _common_1.DATABASE.DATE_CONSTANTS.toDate(obj.endDate, offset);
                obj['spaceId'] = spaceId;
                obj['propertyId'] = propertyId;
                if (offerDataArray.length - 1 == index) {
                    return await this.insertMany(offerDataArray);
                }
            });
        }
        catch (error) {
            console.error(`we have an error in saving saveMultipleOfferPrice ==> ${error}`);
        }
    }
    ;
    async updateMultipleOfferPrice(offerDataArray, spaceData, propertyId, offset) {
        try {
            await exports.OPriceV1.removeAll({ spaceId: spaceData });
            offerDataArray.forEach(async (obj, index) => {
                obj['startDate'] = _common_1.DATABASE.DATE_CONSTANTS.fromDate(obj.startDate, offset);
                obj['endDate'] = _common_1.DATABASE.DATE_CONSTANTS.toDate(obj.endDate, offset);
                obj['spaceId'] = spaceData;
                obj['propertyId'] = propertyId;
                if (offerDataArray.length - 1 == index)
                    return await this.insertMany(offerDataArray);
            });
            return;
        }
        catch (error) {
            console.error(`we have an error in updateMultipleOfferPrice ==> ${error}`);
        }
    }
    ;
    async addDynamicPriceLabels(labelArray) {
        try {
            return await _services_1.redisDOA.insertKeyInRedisHash(_common_1.DATABASE.REDIS.KEY_NAMES.APP_CONFIG, _common_1.DATABASE.REDIS.KEY_NAMES.DYNAMIC_PRICE_LABEL, labelArray);
        }
        catch (error) {
            throw error;
        }
    }
    ;
    async getPriceLabels() {
        try {
            return await _services_1.redisDOA.getKeyFromRedisHash(_common_1.DATABASE.REDIS.KEY_NAMES.APP_CONFIG, _common_1.DATABASE.REDIS.KEY_NAMES.DYNAMIC_PRICE_LABEL);
        }
        catch (error) {
            throw error;
        }
    }
    ;
    async validateRedundantSeason(payload, spaceId) {
        try {
            const seasonExistenceCheck = await this.findMany({
                spaceId: mongoose_1.Types.ObjectId(spaceId),
                startDate: { $gte: new Date(payload.startDate) },
                endDate: { $gte: new Date(payload.endDate) }
            });
            return seasonExistenceCheck;
        }
        catch (error) {
            console.error(`we have an error while validating redundant season ==> ${error}`);
        }
    }
}
exports.OPriceV1 = new OPriceEntity(offerPrice_model_1.default);
//# sourceMappingURL=offer.price.v1.entity.js.map