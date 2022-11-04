"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const amenitiesSchema = new mongoose_1.Schema({
    "name": { type: mongoose_1.SchemaTypes.String },
    "type": { type: mongoose_1.SchemaTypes.String },
    "iconImage": { type: mongoose_1.SchemaTypes.String },
    "status": { type: mongoose_1.SchemaTypes.String, default: common_1.ENUM.AMENITIES.STATUS.ACTIVE },
    "isFeatured": { type: mongoose_1.SchemaTypes.Number, default: 0 },
    "isDelete": { type: mongoose_1.SchemaTypes.Boolean, default: false },
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.AMENITIES,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.AMENITIES, amenitiesSchema);
//# sourceMappingURL=amenities.model.js.map