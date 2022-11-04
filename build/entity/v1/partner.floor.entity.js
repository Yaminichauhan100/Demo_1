"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerFloorV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const host_partner_floor_model_1 = __importDefault(require("@models/host.partner.floor.model"));
class FloorEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        let faqData = await new this.model(payload).save();
        return faqData.toObject();
    }
}
exports.PartnerFloorV1 = new FloorEntity(host_partner_floor_model_1.default);
//# sourceMappingURL=partner.floor.entity.js.map