"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostPaymentDetails = exports.hostBookingDetails = exports.hostPropertyDetails = exports.PropertyDetails = exports.ClaimedPropertyListing = exports.PropertyList = void 0;
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const _common_1 = require("@common");
exports.PropertyList = (payload) => {
    let pipeline = [];
    let filterConditions = [];
    let sortOrder = -1;
    if (payload.sortOrder && payload.sortOrder != '')
        sortOrder = payload.sortOrder;
    pipeline.push({ $match: { $or: [{ status: { $nin: [_common_1.ENUM.PROPERTY.STATUS.ISDELETE] } }, { "claimedStatus": false }] } });
    if (payload.search) {
        filterConditions.push({ name: { $regex: payload.search, $options: "si" } });
    }
    if (payload.hostName) {
        filterConditions.push({ "userData.name": { $regex: payload.hostName, $options: "si" } });
    }
    pipeline.push({
        "$lookup": {
            "from": "propertySpace",
            "let": { "propertyId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$propertyId', '$$propertyId'] } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: '$category._id',
                        categoryDetail: {
                            $addToSet: {
                                categoryData: '$category',
                                status: "$status",
                                spaceId: "$spaceId",
                                price: '$capacity',
                                units: '$units',
                                endDate: '$endDate',
                                isOfferPrice: "$isOfferPrice",
                                subCategory: '$subCategory',
                                pricing: '$pricing'
                            }
                        }
                    }
                }
            ],
            "as": "spaceDetails"
        }
    }, {
        '$lookup': {
            from: 'booking',
            let: {
                propertyId: '$_id'
            },
            pipeline: [
                {
                    '$match': {
                        '$and': [
                            {
                                '$expr': {
                                    '$eq': [
                                        '$propertyData.propertyId',
                                        '$$propertyId'
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            as: 'bookingArray'
        }
    });
    if (payload.status) {
        filterConditions.push({ status: payload.status });
    }
    if (payload.claimedStatus) {
        filterConditions.push({ claimedStatus: payload.claimedStatus });
    }
    if (payload.countryId) {
        filterConditions.push({ "country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        filterConditions.push({ "state.id": parseInt(payload.stateId) });
    }
    if (payload.regStartDate) {
        filterConditions.push({ createdAt: { '$gte': moment_1.default(payload.regStartDate).startOf('day').toDate() } });
    }
    if (payload.regEndDate) {
        filterConditions.push({ createdAt: { '$lte': moment_1.default(payload.regEndDate).endOf('day').toDate() } });
    }
    if (payload.minBooking || payload.maxBooking) {
        pipeline.push({
            "$lookup": {
                "from": "booking",
                "let": { "propertyId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$propertyData.propertyId', '$$propertyId'] } }
                            ]
                        }
                    },
                ],
                "as": "spaceD"
            }
        }, { $project: { size_of_name: { $size: "$spaceD" }, name: 1, status: 1, userData: 1, builtUpArea: 1, description: 1, rating: 1, countryName: '$country.name', stateName: '$state.name', cityName: '$city.cityName', amenities: 1, startingPrice: 1, startingPriceType: 1, zipCode: 1, floor: 1, images: 1, spaceDetails: 1, isFeaturedProperty: 1 } }, { $match: { "size_of_name": { $gt: 0 } } });
    }
    if (payload.minBooking)
        filterConditions.push({ "size_of_name": { $gte: payload.minBooking } });
    if (payload.maxBooking)
        filterConditions.push({ "size_of_name": { $lte: payload.maxBooking } });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.sortKey) {
        if (payload.sortKey == "name")
            pipeline.push({ $sort: { name: sortOrder } });
        if (payload.sortKey == "createdAt")
            pipeline.push({ $sort: { createdAt: sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    if (payload.minBooking || payload.maxBooking)
        pipeline.push({
            '$project': {
                _id: 1, name: 1, status: 1, userData: 1, builtUpArea: 1, description: 1, rating: 1, countryName: 1, stateName: 1, cityName: 1, amenities: 1, startingPrice: 1, startingPriceType: 1, zipCode: 1, floor: 1, images: 1, spaceDetails: 1, isFeaturedProperty: 1, totalBookingCount: {
                    $size: {
                        $filter: {
                            input: "$bookingArray",
                            as: "booking",
                            cond: { $ne: ["$$booking.bookingStatus", 5] }
                        }
                    }
                }
            }
        });
    else
        pipeline.push({
            '$project': {
                _id: 1, claimedStatus: 1, createdAt: 1,
                name: 1, status: 1, userData: 1, builtUpArea: 1, description: 1, rating: 1, countryName: '$country.name', stateName: '$state.name', cityName: '$city.cityName', amenities: 1, startingPrice: 1, zipCode: 1, floor: 1, images: 1, spaceDetails: 1, isFeaturedProperty: 1, totalBookingCount: {
                    $size: {
                        $filter: {
                            input: "$bookingArray",
                            as: "booking",
                            cond: { $ne: ["$$booking.bookingStatus", 5] }
                        }
                    }
                }
            }
        });
    return pipeline;
};
exports.ClaimedPropertyListing = (payload) => {
    let pipeline = [{ $match: { status: _common_1.ENUM.PROPERTY.CLAIMED_PROPERTY_STATUS.PENDING } }];
    let filterConditions = [];
    let sortOrder = -1;
    let pipelineMatchConditions = [
        { $expr: { $eq: ['$_id', '$$propertyId'] } },
        { $expr: { $eq: ["$claimedStatus", false] } }
    ];
    if (payload === null || payload === void 0 ? void 0 : payload.fromDate) {
        pipelineMatchConditions.push({ $expr: { $gte: ["$createdAt", payload === null || payload === void 0 ? void 0 : payload.fromDate] } });
    }
    if (payload === null || payload === void 0 ? void 0 : payload.toDate) {
        pipelineMatchConditions.push({ $expr: { $lte: ["$createdAt", payload === null || payload === void 0 ? void 0 : payload.toDate] } });
    }
    if (payload === null || payload === void 0 ? void 0 : payload.countryId) {
        pipelineMatchConditions.push({ $expr: { $eq: ["country.id", payload === null || payload === void 0 ? void 0 : payload.countryId] } });
    }
    if (payload === null || payload === void 0 ? void 0 : payload.stateId) {
        pipelineMatchConditions.push({ $expr: { $eq: ["state.id", payload === null || payload === void 0 ? void 0 : payload.stateId] } });
    }
    pipeline.push({
        "$lookup": {
            "from": "properties",
            "let": { "propertyId": "$propertyId" },
            "pipeline": [
                {
                    '$match': {
                        $and: pipelineMatchConditions
                    }
                }
            ],
            "as": "propertyDetail"
        }
    }, {
        "$lookup": {
            "from": "hosts",
            "let": { "userId": "$userId" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$_id', '$$userId'] } },
                        ]
                    }
                },
                { $project: { "name": 1, email: 1, phoneNo: 1 } }
            ],
            "as": "hostDetail"
        }
    });
    if (payload.sortOrder && payload.sortOrder != '')
        sortOrder = payload.sortOrder;
    if (payload.search) {
        filterConditions.push({ name: { $regex: payload.search, $options: "si" } });
    }
    if (payload.status) {
        filterConditions.push({ status: payload.status });
    }
    if (payload.countryId) {
        filterConditions.push({ "country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        filterConditions.push({ "state.id": parseInt(payload.stateId) });
    }
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.sortKey) {
        if (payload.sortKey == "name")
            pipeline.push({ $sort: { name: sortOrder } });
        if (payload.sortKey == "createdAt")
            pipeline.push({ $sort: { createdAt: sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    return pipeline;
};
exports.PropertyDetails = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(id) } });
    pipeline.push({
        '$project': {
            _id: 1,
            name: 1,
            status: 1,
            isLike: { $literal: true },
            userData: 1,
            builtUpArea: 1,
            description: 1,
            rating: 1,
            countryName: '$country.name',
            stateName: '$state.name',
            location: '$location.coordinates',
            floor: 1,
            images: 1,
            spaceDetails: 1,
            address: 1,
            amenities: 1,
            totalCapacity: 1,
            claimedStatus: 1,
            addressPrimary: '$addressPrimary',
            addressSecondary: '$addressSecondary',
            propertyType: 1,
            zipCode: 1,
            country: 1,
            state: 1,
            city: 1,
            totalFloorCount: 1,
            startingPrice: 1,
            floorCorners: 1
        }
    });
    return pipeline;
};
exports.hostPropertyDetails = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { 'userData.userId': mongoose_1.Types.ObjectId(id), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE } });
    pipeline.push({
        "$lookup": {
            "from": "propertySpace",
            "let": { "propertyId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$propertyId', '$$propertyId'] } },
                            { $expr: { $eq: ["$status", 'active'] } }
                        ]
                    }
                },
                { $project: { "categoryName": "$category.name", pricing: 1, "capacity": "$capacity", "subCategoryName": "$subCategory.name" } }
            ],
            "as": "spaceDetails"
        }
    });
    pipeline.push({
        '$project': {
            _id: 1, name: 1, status: 1,
            isLike: { $literal: true },
            userData: 1, builtUpArea: 1, description: 1, rating: 1, countryName: '$country.name', stateName: '$state.name', location: '$location.coordinates', floor: 1, images: 1, spaceDetails: 1, address: 1, amenities: 1, totalCapacity: 1
        }
    });
    return pipeline;
};
exports.hostBookingDetails = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { hostId: mongoose_1.Types.ObjectId(id), bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED } } }, { $project: { bookingStatus: 1, _id: 1 } }, {
        $group: {
            _id: "$hostId",
            bookingDetailsUserWise: {
                '$addToSet': {
                    bookingId: '$_id',
                    bookingStatus: '$bookingStatus'
                }
            }
        }
    }, {
        $project: {
            _id: 0,
            totalBookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsUserWise",
                        as: "bookingDetails",
                        cond: { $ne: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ABANDONED] }
                    }
                }
            },
            upcomingBookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsUserWise",
                        as: "bookingDetails",
                        cond: { $eq: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.UPCOMING] }
                    }
                }
            }
        }
    });
    return pipeline;
};
exports.hostPaymentDetails = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { hostId: mongoose_1.Types.ObjectId(id) } }, {
        $group: {
            _id: "$hostId",
            paymentData: {
                $addToSet: {
                    payoutStatus: "$payoutStatus",
                    paymentId: "$_id",
                    price: "$price",
                }
            }
        }
    }, {
        $project: {
            _id: 0,
            pendingPayment: {
                $sum: {
                    "$map": {
                        "input": "$paymentData",
                        "as": "item",
                        "in": {
                            "$cond": [
                                { "$eq": ["$$item.payoutStatus", false] },
                                "$$item.price",
                                0
                            ]
                        }
                    }
                }
            },
            totalPayment: {
                $sum: {
                    "$map": {
                        "input": "$paymentData",
                        "as": "item",
                        "in": {
                            "$cond": [
                                {
                                    $or: [
                                        { $eq: ["$$item.payoutStatus", false] },
                                        { $eq: ["$$item.payoutStatus", true] }
                                    ]
                                },
                                "$$item.price",
                                0
                            ]
                        }
                    }
                }
            },
        }
    });
    return pipeline;
};
//# sourceMappingURL=admin.property.builder.js.map