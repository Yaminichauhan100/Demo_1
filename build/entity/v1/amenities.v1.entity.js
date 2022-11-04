"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenitiesV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const amenities_model_1 = __importDefault(require("@models/amenities.model"));
const _builders_1 = __importDefault(require("@builders"));
class AdminEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createAmenities(payload) {
        let amenities = await new this.model(payload).save();
        return amenities.toObject();
    }
    async checkDuplicateAmenities(name) {
        return await amenities_model_1.default.aggregate(await _builders_1.default.Admin.Amenities.duplicateAmenities(name));
    }
    async getAmenitiesList() {
        return await amenities_model_1.default.aggregate(await _builders_1.default.Admin.Amenities.amenitiesList());
    }
    async fetchAmenitiesList(payload) {
        try {
            let amenitiesList = await exports.AmenitiesV1.findMany({ _id: { $in: payload.amenities } }, { name: 1, iconImage: 1, type: 1 });
            payload['amenities'] = [];
            for (let i = 0; i < amenitiesList.length; i++) {
                const amenitiesKeys = amenitiesList[i];
                payload.amenities.push({
                    amenityId: amenitiesKeys._id,
                    name: amenitiesKeys.name,
                    iconImage: amenitiesKeys.iconImage,
                    type: amenitiesKeys.type
                });
            }
            ;
            return payload;
        }
        catch (error) {
            console.error(`we have an error while fetching Amenity list ==> ${error}`);
        }
    }
}
exports.AmenitiesV1 = new AdminEntity(amenities_model_1.default);
//# sourceMappingURL=amenities.v1.entity.js.map