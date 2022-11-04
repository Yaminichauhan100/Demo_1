"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const reviewSchema = new mongoose_1.Schema({
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    hostId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    rating: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
        default: 0
    },
    isFeatured: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
        default: 0
    },
    review: {
        type: mongoose_1.Schema.Types.String,
        default: ''
    },
    status: { type: mongoose_1.Schema.Types.String, default: common_1.ENUM.PROPERTY.STATUS.ACTIVE },
    reply: [{
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
            },
            review: {
                type: mongoose_1.Schema.Types.String,
                default: ''
            },
            createdAt: {
                type: mongoose_1.Schema.Types.Date,
                default: new Date()
            },
            _id: 0
        }],
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.REVIEWS,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.REVIEWS, reviewSchema);
//# sourceMappingURL=reviews.model.js.map