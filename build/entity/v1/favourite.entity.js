"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const favourite_model_1 = __importDefault(require("@models/favourite.model"));
class FavouriteEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
}
exports.FavouriteV1 = new FavouriteEntity(favourite_model_1.default);
//# sourceMappingURL=favourite.entity.js.map