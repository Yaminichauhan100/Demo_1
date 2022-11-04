"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const unclaimedPropertySchema = new mongoose_1.Schema({
    docs: [{
            _id: 0,
            name: { type: mongoose_1.Schema.Types.String },
            url: { type: mongoose_1.Schema.Types.String },
            type: { type: mongoose_1.Schema.Types.String }
        }],
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    status: { type: mongoose_1.Schema.Types.Number, default: _common_1.ENUM.PROPERTY.CLAIMED_PROPERTY_STATUS.PENDING },
    message: { type: mongoose_1.Schema.Types.String },
    administrativeRight: { type: mongoose_1.Schema.Types.Boolean },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId },
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.UNCLAIMED_PROPERTY,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.UNCLAIMED_PROPERTY, unclaimedPropertySchema);
//# sourceMappingURL=unclaimed.properties.model.js.map