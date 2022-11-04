"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPolicyV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const appPolicy_model_1 = __importDefault(require("@models/appPolicy.model"));
class AppConfigEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        let tAndC = await new this.model(payload).save();
        return tAndC.toObject();
    }
    async listAllAppConfig(params) {
        let pipeline = [];
        let matchCriteria = { $match: { $and: [] } };
        matchCriteria.$match.$and.push({ status: 'active' });
        matchCriteria.$match.$and.push({ lang: params.lang });
        pipeline.push(matchCriteria);
        let details = await exports.AppPolicyV1.paginateAggregate(pipeline, { limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 2, page: params.page, getCount: true });
        return details;
    }
}
exports.AppPolicyV1 = new AppConfigEntity(appPolicy_model_1.default);
//# sourceMappingURL=appPolicy.v1.entity.js.map