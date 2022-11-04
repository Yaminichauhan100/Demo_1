"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const hostSessionSchema = new mongoose_1.Schema({
    "userId": { type: mongoose_1.SchemaTypes.ObjectId, required: true },
    "device": {
        "id": { type: mongoose_1.SchemaTypes.String, trim: true },
        "model": { type: mongoose_1.SchemaTypes.String, trim: true },
        "token": { type: mongoose_1.SchemaTypes.String, trim: true },
        "type": {
            type: mongoose_1.SchemaTypes.Number,
            enum: common_1.ENUM.USER.DEVICE_TYPE, trim: true
        },
    },
    notificationEnabled: {
        type: mongoose_1.Schema.Types.Number, enum: [
            common_1.ENUM_ARRAY.NOTIFICATION.ENABLE,
            common_1.ENUM_ARRAY.NOTIFICATION.DISABLE
        ],
        default: common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
    },
    mailNotificationEnabled: {
        type: mongoose_1.Schema.Types.Number, enum: [
            common_1.ENUM_ARRAY.NOTIFICATION.ENABLE,
            common_1.ENUM_ARRAY.NOTIFICATION.DISABLE
        ],
        default: common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
    },
    "isActive": { type: mongoose_1.SchemaTypes.Boolean, default: true }
}, {
    versionKey: false,
    timestamps: true,
    collection: common_1.ENUM.COL.HOST_SESSION
});
exports.default = mongoose_1.model(common_1.ENUM.COL.HOST_SESSION, hostSessionSchema);
//# sourceMappingURL=host_session.model.js.map