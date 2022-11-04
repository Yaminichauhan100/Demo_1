"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const allCitySchema = new mongoose_1.Schema({
    "name": { type: mongoose_1.SchemaTypes.String },
    "state_id": { type: mongoose_1.SchemaTypes.Number },
    "country_id": { type: mongoose_1.SchemaTypes.Number },
    "id": { type: mongoose_1.SchemaTypes.Number },
    "country_code": { type: mongoose_1.SchemaTypes.String },
    "cityId": { type: mongoose_1.SchemaTypes.ObjectId }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.ALLCITIES,
    timestamps: true
});
allCitySchema.index({ country_code: 1, id: 1, state_id: 1 });
exports.default = mongoose_1.model(common_1.ENUM.COL.ALLCITIES, allCitySchema);
//# sourceMappingURL=allCities.model.js.map