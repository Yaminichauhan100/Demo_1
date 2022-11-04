"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const calendar_model_1 = __importDefault(require("@models/calendar.model"));
class CalendarEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
}
exports.CalendarV1 = new CalendarEntity(calendar_model_1.default);
//# sourceMappingURL=calendar.v1.entity.js.map