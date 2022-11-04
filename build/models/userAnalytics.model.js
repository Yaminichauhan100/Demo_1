"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const analyticsSchema = new mongoose_1.Schema({
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    hostId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    viewCount: {
        type: mongoose_1.Schema.Types.Number,
        default: 0
    },
    deviceDetails: {
        type: { type: Number, enum: common_1.ENUM.USER.DEVICE_TYPE },
        token: { type: String, trim: true },
        deviceId: { type: String },
        _id: 0
    }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.USER_ANALYTIC,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.USER_ANALYTIC, analyticsSchema);
//# sourceMappingURL=userAnalytics.model.js.map