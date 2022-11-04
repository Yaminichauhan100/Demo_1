"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const admin_advprice_model_1 = __importDefault(require("@models/admin.advprice.model"));
class AdvEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        let advData = await new this.model(payload).save();
        return advData.toObject();
    }
}
exports.AdvV1 = new AdvEntity(admin_advprice_model_1.default);
//# sourceMappingURL=advprice.v1.entity.js.map