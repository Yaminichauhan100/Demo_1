"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const adminNotificationSchema = new mongoose_1.Schema({
    title: { type: mongoose_1.Schema.Types.String },
    image: { type: mongoose_1.Schema.Types.String },
    description: { type: mongoose_1.Schema.Types.String },
    recipientType: { type: mongoose_1.Schema.Types.Number, enum: common_1.ENUM_ARRAY.ADMIN.NOTIFICATION.RECIEVER },
    otherRecipientIds: [{ type: mongoose_1.Schema.Types.ObjectId }],
    queued: { type: mongoose_1.Schema.Types.Number, enum: [1], default: 1 },
    sent: { type: mongoose_1.Schema.Types.Number, enum: [0, 1], default: 1 },
    sentCount: { type: mongoose_1.Schema.Types.Number, default: 0 },
    hostList: [{ type: mongoose_1.Schema.Types.String }],
    userList: [{ type: mongoose_1.Schema.Types.String }]
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.ADMIN_NOTIFICATION,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.ADMIN_NOTIFICATION, adminNotificationSchema);
//# sourceMappingURL=admin.notification.model.js.map