"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentSearchV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const recent_search_model_1 = __importDefault(require("@models/recent_search.model"));
class RecentSearchEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async updateRecentCityList(details) {
        try {
            let data = await new this.model(details).save();
            return data;
        }
        catch (error) {
            console.error(`we have an error while updating recent search => ${error}`);
            return Promise.reject(error);
        }
    }
}
exports.RecentSearchV1 = new RecentSearchEntity(recent_search_model_1.default);
//# sourceMappingURL=recent.search.v1.entity.js.map