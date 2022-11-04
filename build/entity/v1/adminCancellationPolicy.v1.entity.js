"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationPolicyV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const cancellation_policy_model_1 = __importDefault(require("@models/cancellation.policy.model"));
class CancellationPolicyEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        try {
            let cancellationPolicy = await new this.model(payload).save();
            return cancellationPolicy;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async getCancellationPolicy(payload) {
        try {
            return await exports.CancellationPolicyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id), lang: payload.lang });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async getAllCancellationPolicy(payload) {
        try {
            let cancellationList = await exports.CancellationPolicyV1.findMany({ lang: 'EN', userType: 1 });
            return cancellationList;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async getAllCancellationPolicyForHost(payload) {
        try {
            let matchCondition;
            if (payload === null || payload === void 0 ? void 0 : payload.lang)
                matchCondition = { lang: payload.lang, userType: payload.userType };
            let arrayData = await exports.CancellationPolicyV1.findMany(matchCondition);
            return arrayData;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
}
exports.CancellationPolicyV1 = new CancellationPolicyEntity(cancellation_policy_model_1.default);
//# sourceMappingURL=adminCancellationPolicy.v1.entity.js.map