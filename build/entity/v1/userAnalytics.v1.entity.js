"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAnalyticsV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const userAnalytics_model_1 = __importDefault(require("@models/userAnalytics.model"));
class UserAnalyticsEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
}
exports.UserAnalyticsV1 = new UserAnalyticsEntity(userAnalytics_model_1.default);
//# sourceMappingURL=userAnalytics.v1.entity.js.map