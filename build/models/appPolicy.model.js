"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const appConfigSchema = new mongoose_1.Schema({
    type: { type: Number, required: true },
    editType: { type: Number },
    content: { type: String },
    status: { type: String, default: _common_1.ENUM.PROPERTY.STATUS.ACTIVE },
    lang: { type: String },
    userType: {
        type: Number,
        required: true
    }
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.APPCONFIG,
    timestamps: true
});
appConfigSchema.index({ type: 1 });
exports.default = mongoose_1.model(_common_1.ENUM.COL.APPCONFIG, appConfigSchema);
//# sourceMappingURL=appPolicy.model.js.map