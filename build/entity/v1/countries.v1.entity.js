"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const countries_model_1 = __importDefault(require("@models/countries.model"));
const mongoose_1 = require("mongoose");
class CountriesEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async fetchUniqueCountries(countryIds) {
        try {
            let countryArray = [];
            countryIds.forEach((element) => {
                countryArray.push(mongoose_1.Types.ObjectId(element));
            });
            const pipeline = [
                {
                    $match: { _id: { $in: countryArray } }
                }
            ];
            return await this.basicAggregate(pipeline);
        }
        catch (error) {
            console.error(`we have an error in fetchUniqueCountries ==> ${error}`);
        }
    }
    async fetchCountryByCountryId(payload) {
        try {
            return await this.findOne({ id: payload.countryId }, { name: 1 });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
}
exports.CountriesV1 = new CountriesEntity(countries_model_1.default);
//# sourceMappingURL=countries.v1.entity.js.map