"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const demoSchema = new mongoose_1.Schema({
    remark: { type: String, trim: true },
    demoDate: { type: Date, required: true },
    demoTime: { type: String, trim: true, required: true },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId, index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    status: {
        type: mongoose_1.Schema.Types.Number,
        enum: _common_1.ENUM_ARRAY.DEMO.STATUS,
        default: _common_1.ENUM.PROPERTY.DEMO_STATUS.PENDING
    }
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.PROPERTY_DEMO,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.PROPERTY_DEMO, demoSchema);
//# sourceMappingURL=demo.model.js.map