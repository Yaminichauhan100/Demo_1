"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const adminSessionSchema = new mongoose_1.Schema({
    adminId: { type: mongoose_1.SchemaTypes.ObjectId, required: true, index: true },
    deviceData: {
        platform: { type: mongoose_1.SchemaTypes.String, default: common_1.ENUM.ADMIN.DEVICE_PLATFORM.WEB },
        name: { type: mongoose_1.SchemaTypes.String, trim: true },
        version: { type: mongoose_1.SchemaTypes.String, trim: true }
    },
    isActive: { type: mongoose_1.SchemaTypes.Boolean, default: true },
    networkData: {
        ipAddress: { type: mongoose_1.SchemaTypes.String }
    }
}, {
    versionKey: false,
    timestamps: true,
    collection: common_1.ENUM.COL.ADMIN_SESSION
});
exports.default = mongoose_1.model(common_1.ENUM.COL.ADMIN_SESSION, adminSessionSchema);
//# sourceMappingURL=admin_session.model.js.map