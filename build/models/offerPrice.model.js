"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const offerPriceSchema = new mongoose_1.Schema({
    seasonName: { type: mongoose_1.Schema.Types.String, trim: true, index: true },
    spaceId: [{ type: mongoose_1.Schema.Types.ObjectId, required: true }],
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    startDate: {
        type: mongoose_1.Schema.Types.Date,
        required: true
    },
    endDate: {
        type: mongoose_1.Schema.Types.Date,
        required: true
    },
    status: {
        type: mongoose_1.Schema.Types.String,
        enum: [
            common_1.ENUM.PROPERTY.STATUS.ACTIVE,
            common_1.ENUM.PROPERTY.STATUS.INACTIVE
        ],
        default: common_1.ENUM.PROPERTY.STATUS.ACTIVE
    },
    priceDetails: [
        {
            discountLabelType: {
                type: mongoose_1.Schema.Types.Number,
                enum: [
                    common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION,
                    common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION,
                    common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS
                ]
            },
            months: {
                type: mongoose_1.Schema.Types.Number,
                min: [0, `Month can't be 0`],
                max: [12, `Month can't be greater than 12`]
            },
            days: { type: mongoose_1.Schema.Types.Number },
            discountPercentage: { type: mongoose_1.Schema.Types.Number },
            minUnits: { type: mongoose_1.Schema.Types.Number },
            maxUnits: { type: mongoose_1.Schema.Types.Number },
            _id: false,
        }
    ],
    priceRange: {
        dailyPrice: {
            min: {
                type: mongoose_1.Schema.Types.Number,
            },
            max: {
                type: mongoose_1.Schema.Types.Number,
            }
        },
        monthlyPrice: {
            min: {
                type: mongoose_1.Schema.Types.Number,
            },
            max: {
                type: mongoose_1.Schema.Types.Number,
            }
        },
        hourlyPrice: {
            min: {
                type: mongoose_1.Schema.Types.Number,
            },
            max: {
                type: mongoose_1.Schema.Types.Number,
            }
        }
    }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.OFFER_PRICE,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.OFFER_PRICE, offerPriceSchema);
//# sourceMappingURL=offerPrice.model.js.map