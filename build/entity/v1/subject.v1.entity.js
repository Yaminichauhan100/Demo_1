"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const subject_model_1 = __importDefault(require("@models/subject.model"));
class StatesEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        let data = await new this.model(payload).save();
        return data.toObject();
    }
}
exports.SubjectV1 = new StatesEntity(subject_model_1.default);
//# sourceMappingURL=subject.v1.entity.js.map