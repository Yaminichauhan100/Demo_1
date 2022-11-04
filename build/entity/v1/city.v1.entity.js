"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const city_model_1 = __importDefault(require("@models/city.model"));
const mongoose_1 = require("mongoose");
class CityEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createCity(payload) {
        try {
            let city = await new this.model(payload).save();
            return city.toObject();
        }
        catch (error) {
            console.error(`we have an error in createCity --> ${error}`);
        }
    }
    async fetchUniqueCities(cityIds, payload) {
        try {
            let cityArray = [];
            cityIds.forEach((element) => {
                cityArray.push(mongoose_1.Types.ObjectId(element));
            });
            const pipeline = [
                {
                    $match: {
                        _id: { $in: cityArray },
                        countryId: payload.countryId
                    }
                }
            ];
            return await this.basicAggregate(pipeline);
        }
        catch (error) {
            console.error(`we have an error while fetchUniqueCities ==> ${error}`);
        }
    }
}
exports.CityV1 = new CityEntity(city_model_1.default);
//# sourceMappingURL=city.v1.entity.js.map