"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const citySchema = new mongoose_1.Schema({
    "countryId": { type: mongoose_1.SchemaTypes.Number },
    "stateId": { type: mongoose_1.SchemaTypes.Number },
    "cityName": { type: mongoose_1.SchemaTypes.String },
    "iconImage": { type: mongoose_1.SchemaTypes.String },
    "zipCodes": [{ type: mongoose_1.SchemaTypes.String }],
    "isFeatured": { type: mongoose_1.SchemaTypes.Boolean, default: false },
    "status": { type: mongoose_1.SchemaTypes.String, default: common_1.ENUM.CITY.STATUS.ACTIVE },
    "isDelete": { type: mongoose_1.SchemaTypes.Boolean, default: false },
    "countryName": { type: mongoose_1.SchemaTypes.String, trim: true },
    "stateName": { type: mongoose_1.SchemaTypes.String, trim: true },
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.CITY,
    timestamps: true
});
citySchema.index({ countryId: 1, stateId: 1 });
exports.default = mongoose_1.model(common_1.ENUM.COL.CITY, citySchema);
//# sourceMappingURL=city.model.js.map