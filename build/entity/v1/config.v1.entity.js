"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const config_model_1 = __importDefault(require("@models/config.model"));
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
class ConfigEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async partnerTypeList(params) {
        let pipeline = [];
        let filterConditions = [];
        filterConditions.push({ isDeleted: false });
        filterConditions.push({ type: _common_1.ENUM_ARRAY.CONFIG_TYPE.PARTNER_TYPE });
        if (params.search) {
            filterConditions.push({ 'data.title': { $regex: params.search, $options: "si" } });
        }
        if (params.id)
            filterConditions.push({ _id: mongoose_1.Types.ObjectId(params.id) });
        pipeline.push({ $match: { $and: filterConditions } });
        pipeline.push({
            $project: {
                _id: 1,
                type: 1,
                title: '$data.title',
                image: '$data.image',
                createdAt: 1,
                updatedAt: 1
            }
        });
        let details = await exports.ConfigV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 2, page: params.page });
        return details;
    }
}
exports.ConfigV1 = new ConfigEntity(config_model_1.default);
//# sourceMappingURL=config.v1.entity.js.map