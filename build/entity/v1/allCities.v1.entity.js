"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllCityV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const allCities_model_1 = __importDefault(require("@models/allCities.model"));
class AllCityEntity extends base_entity_1.default {
    async createCityByAdmin(payload) {
        let createDataPayload = {
            name: payload.cityName,
            state_id: payload.stateId,
            country_id: payload.countryId,
            iconImage: payload.iconImage,
            cityId: payload.cityId
        };
        let city = await new this.model(createDataPayload).save();
        return city.toObject();
    }
    constructor(model) {
        super(model);
    }
}
exports.AllCityV1 = new AllCityEntity(allCities_model_1.default);
//# sourceMappingURL=allCities.v1.entity.js.map