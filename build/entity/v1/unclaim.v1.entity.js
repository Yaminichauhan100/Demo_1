"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnclaimV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const unclaimed_properties_model_1 = __importDefault(require("@models/unclaimed.properties.model"));
class UnclaimedEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async saveProperty(payload) {
        return await new this.model(payload).save();
    }
}
exports.UnclaimV1 = new UnclaimedEntity(unclaimed_properties_model_1.default);
//# sourceMappingURL=unclaim.v1.entity.js.map