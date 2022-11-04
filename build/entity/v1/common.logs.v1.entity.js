"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonLogsV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const logs_model_1 = __importDefault(require("@models/logs.model"));
class CalendarEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createCronLog(type, data) {
        try {
            await this.createOne({ type, data });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
}
exports.CommonLogsV1 = new CalendarEntity(logs_model_1.default);
//# sourceMappingURL=common.logs.v1.entity.js.map