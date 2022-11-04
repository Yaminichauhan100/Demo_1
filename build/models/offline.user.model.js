"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const offlineUserSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, trim: true },
    email: { type: mongoose_1.Schema.Types.String, trim: true },
    image: { type: mongoose_1.Schema.Types.String, default: _common_1.ENUM.USER.DEFAULT_IMAGE },
    fullMobileNumber: { type: mongoose_1.Schema.Types.String, trim: true },
    companyName: { type: mongoose_1.Schema.Types.String, trim: true },
    companyEmail: { type: mongoose_1.Schema.Types.String, trim: true },
    companyOfficeNumber: { type: mongoose_1.Schema.Types.String, trim: true },
    houseNumber: { type: mongoose_1.Schema.Types.Number },
    street: { type: mongoose_1.Schema.Types.String, trim: true },
    landmark: { type: mongoose_1.Schema.Types.String, trim: true },
    country: { type: mongoose_1.Schema.Types.String, trim: true },
    zipCode: { type: mongoose_1.Schema.Types.String, trim: true },
    state: { type: mongoose_1.Schema.Types.String, trim: true },
    city: { type: mongoose_1.Schema.Types.String, trim: true },
    registrationNumber: { type: mongoose_1.Schema.Types.String, trim: true }
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.OFFLINE_USER,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.OFFLINE_USER, offlineUserSchema);
//# sourceMappingURL=offline.user.model.js.map