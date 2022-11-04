"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const contact_model_1 = __importDefault(require("@models/contact.model"));
class ContactEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        let tAndC = await new this.model(payload).save();
        return tAndC.toObject();
    }
}
exports.ContactV1 = new ContactEntity(contact_model_1.default);
//# sourceMappingURL=contact.v1.entity.js.map