"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const notificationSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    entityId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    type: {
        type: mongoose_1.Schema.Types.Number, enum: _common_1.ENUM_ARRAY.NOTIFICATION_TYPE,
        required: true
    },
    data: { type: mongoose_1.Schema.Types.Mixed },
    status: { type: mongoose_1.Schema.Types.String, default: _common_1.ENUM.PROPERTY.STATUS.ACTIVE },
    isRead: { type: mongoose_1.Schema.Types.Boolean, default: false },
    title: { type: mongoose_1.Schema.Types.String },
    image: { type: mongoose_1.Schema.Types.String },
    message: { type: mongoose_1.Schema.Types.String, trim: true },
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.NOTIFICATION,
    timestamps: true
});
exports.default = mongoose_1.model(_common_1.ENUM.COL.NOTIFICATION, notificationSchema);
//# sourceMappingURL=notification.model.js.map