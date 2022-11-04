"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const admin_faq_model_1 = __importDefault(require("@models/admin_faq.model"));
class FaqEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        let faqData = await new this.model(payload).save();
        return faqData.toObject();
    }
}
exports.FaqV1 = new FaqEntity(admin_faq_model_1.default);
//# sourceMappingURL=faq.v1.entity.js.map