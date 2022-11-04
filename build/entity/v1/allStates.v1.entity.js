"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllStatesV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const allStates_model_1 = __importDefault(require("@models/allStates.model"));
class AllCityEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
}
exports.AllStatesV1 = new AllCityEntity(allStates_model_1.default);
//# sourceMappingURL=allStates.v1.entity.js.map