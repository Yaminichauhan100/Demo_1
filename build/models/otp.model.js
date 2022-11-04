"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constant_common_1 = require("./../common/constant.common");
const common_1 = require("../common");
const otpSchema = new mongoose_1.Schema({
    otp: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    phoneNo: { type: String, trim: true },
    countryCode: { type: String, trim: true },
    type: { type: mongoose_1.SchemaTypes.Number, trim: true },
    userId: { type: mongoose_1.SchemaTypes.ObjectId },
    otpTimeStamp: { type: Number, default: new Date().getTime() }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.OTP,
    timestamps: true
});
otpSchema.index({ "createdAt": 1 }, { expireAfterSeconds: constant_common_1.DATABASE.MONGO_TTL.EXPIRED_OTP });
exports.default = mongoose_1.model(common_1.ENUM.COL.OTP, otpSchema);
//# sourceMappingURL=otp.model.js.map