"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const cancellationPolicySchema = new mongoose_1.Schema({
    reason: { type: String, trim: true, required: true, index: true },
    lang: { type: String, required: true, index: true },
    status: { type: String, default: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, trim: true, index: true },
    userType: {
        type: Number,
        enum: [_common_1.ENUM.USER.TYPE.USER, _common_1.ENUM.USER.TYPE.HOST],
        required: true,
        index: true
    }
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.CANCELLATION_POLICY,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.CANCELLATION_POLICY, cancellationPolicySchema);
//# sourceMappingURL=cancellation.policy.model.js.map