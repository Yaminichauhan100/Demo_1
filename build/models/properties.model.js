"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const propertySchema = new mongoose_1.Schema({
    isFeaturedProperty: { type: mongoose_1.SchemaTypes.Boolean, default: false, index: true },
    name: { type: mongoose_1.Schema.Types.String, index: true },
    addressPrimary: { type: mongoose_1.Schema.Types.String, index: true },
    addressSecondary: { type: mongoose_1.Schema.Types.String, index: true },
    totalUnits: { type: mongoose_1.Schema.Types.Number, index: true },
    zipCode: { type: mongoose_1.Schema.Types.String, index: true },
    shareUrl: { type: mongoose_1.Schema.Types.String },
    coHostId: [{ type: mongoose_1.Schema.Types.ObjectId, index: true }],
    isCohost: { type: mongoose_1.Schema.Types.String, index: true },
    userData: {
        name: { type: mongoose_1.Schema.Types.String },
        image: { type: mongoose_1.Schema.Types.String },
        userId: { type: mongoose_1.Schema.Types.ObjectId },
        email: { type: mongoose_1.Schema.Types.String },
        bio: { type: mongoose_1.Schema.Types.String },
        fbUrl: { type: mongoose_1.SchemaTypes.String },
        twitterUrl: { type: mongoose_1.SchemaTypes.String },
        linkedinUrl: { type: mongoose_1.SchemaTypes.String },
        instaUrl: { type: mongoose_1.SchemaTypes.String },
        youtubeUrl: { type: mongoose_1.SchemaTypes.String },
        slackUrl: { type: mongoose_1.SchemaTypes.String }
    },
    location: {
        type: { type: mongoose_1.Schema.Types.String },
        coordinates: [mongoose_1.Schema.Types.Number, mongoose_1.Schema.Types.Number]
    },
    address: { type: mongoose_1.Schema.Types.String },
    images: [{ type: mongoose_1.SchemaTypes.String }],
    userId: { type: mongoose_1.Schema.Types.ObjectId },
    claimingHosts: [{ type: mongoose_1.Schema.Types.ObjectId }],
    startingPrice: { type: mongoose_1.Schema.Types.Number },
    startingPriceType: { type: mongoose_1.Schema.Types.Number, enum: _common_1.ENUM_ARRAY.PROPERTY.PRICING_TYPE },
    autoAcceptUpcomingBooking: { type: mongoose_1.Schema.Types.Boolean, default: true },
    status: { type: mongoose_1.Schema.Types.String, default: _common_1.ENUM.PROPERTY.STATUS.DRAFT },
    claimedStatus: { type: mongoose_1.Schema.Types.Boolean, enum: _common_1.ENUM_ARRAY.PROPERTY.CLAIMED_STATUS },
    stepCounter: {
        type: mongoose_1.Schema.Types.Number,
        enum: _common_1.ENUM_ARRAY.PROPERTY.STEP_COUNTER,
        default: _common_1.ENUM.PROPERTY.STEP_COUNTER.ADD_NAME_AND_ADDRESS
    },
    stepNumber: { type: mongoose_1.Schema.Types.Number },
    amenities: [{
            name: { type: mongoose_1.Schema.Types.String },
            iconImage: { type: mongoose_1.Schema.Types.String },
            amenityId: { type: mongoose_1.Schema.Types.ObjectId },
            status: { type: mongoose_1.Schema.Types.String, default: _common_1.ENUM.AMENITIES.STATUS.ACTIVE },
            type: { type: mongoose_1.Schema.Types.String },
            isFeatured: { type: mongoose_1.Schema.Types.Number, default: 0 },
        }],
    heading: { type: mongoose_1.Schema.Types.String },
    description: { type: mongoose_1.Schema.Types.String },
    rating: {
        avgRating: { type: mongoose_1.Schema.Types.Number, default: 0 },
        count: { type: mongoose_1.Schema.Types.Number, default: 0 }
    },
    country: {
        sortname: { type: mongoose_1.SchemaTypes.String },
        name: { type: mongoose_1.SchemaTypes.String },
        id: { type: mongoose_1.SchemaTypes.Number },
        tax: { type: mongoose_1.SchemaTypes.Number, default: 0 },
        _id: 0
    },
    propertyType: { type: mongoose_1.Schema.Types.Number, enum: _common_1.ENUM_ARRAY.PROPERTY.PROPERTY_TYPE },
    state: {
        id: { type: mongoose_1.SchemaTypes.Number },
        name: { type: mongoose_1.SchemaTypes.String },
        "tax": { type: mongoose_1.SchemaTypes.Number, default: 0 },
        _id: 0
    },
    city: {
        cityName: { type: mongoose_1.SchemaTypes.String },
        iconImage: { type: mongoose_1.SchemaTypes.String },
        isFeatured: { type: mongoose_1.SchemaTypes.Boolean, default: false },
        _id: 0
    },
    holidays: [{
            name: { type: mongoose_1.Schema.Types.String },
            toDate: { type: mongoose_1.Schema.Types.Date },
            fromDate: { type: mongoose_1.Schema.Types.Date },
            createdAt: { type: mongoose_1.Schema.Types.Date }
        }],
    totalBookingsCount: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    averageDuration: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    ongoingBookingCount: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    upComingBookingCount: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    totalCapacity: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    totalCapacityBySeats: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    unitsBooked: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    termsAndCond: { type: mongoose_1.SchemaTypes.String, default: "" },
    totalFloorCount: { type: mongoose_1.SchemaTypes.Number, default: 0 },
    floorCorners: [
        {
            _id: 0,
            floorNumber: { type: mongoose_1.Schema.Types.Number, required: true, index: true },
            cornerLabels: [
                {
                    _id: 0,
                    floorKey: { type: mongoose_1.Schema.Types.String, trim: true },
                    floorLabel: { type: mongoose_1.Schema.Types.String, trim: true }
                }
            ]
        }
    ]
}, {
    versionKey: false,
    collection: _common_1.ENUM.COL.PROPERTY,
    timestamps: true
});
propertySchema.index({ "location": "2dsphere" });
propertySchema.index({ "userId": 1 });
propertySchema.index({ "status": 1 });
propertySchema.index({ "createdAt": 1 });
exports.default = mongoose_1.model(_common_1.ENUM.COL.PROPERTY, propertySchema);
//# sourceMappingURL=properties.model.js.map