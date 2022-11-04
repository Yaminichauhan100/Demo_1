"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPropertySpaceDetails = exports.employeePropertySpaceDetails = exports.employeePropertyDetails = exports.fetchOfferPricingQuery = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
exports.fetchOfferPricingQuery = (payload) => {
    const { propertyId, fromDate, toDate } = payload;
    let offerPipeline = {};
    let matchCondition = {};
    matchCondition['propertyId'] = mongoose_1.Types.ObjectId(propertyId);
    matchCondition['status'] = _common_1.ENUM.PROPERTY.STATUS.ACTIVE;
    let pipelineMatchCondition = {
        "$expr": {
            "$and": [
                { "$eq": [["$$spaceId"], "$spaceId"] },
            ]
        }
    };
    if (fromDate && toDate) {
        pipelineMatchCondition['$expr']['$and'] =
            [
                { "$eq": [["$$spaceId"], "$spaceId"] },
                { '$gte': [_common_1.DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload === null || payload === void 0 ? void 0 : payload.offset), '$startDate'] },
                { '$lte': [_common_1.DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload === null || payload === void 0 ? void 0 : payload.offset), '$endDate'] }
            ];
    }
    offerPipeline['$lookup'] = {
        "from": "offers",
        "let": { "spaceId": "$_id" },
        "pipeline": [
            {
                "$match": pipelineMatchCondition
            },
            {
                $project: {
                    priceDetails: {
                        $filter: {
                            input: "$priceDetails",
                            as: "elem",
                            cond: { $ne: ["$$elem.discountPercentage", 0] }
                        }
                    }
                }
            }
        ],
        "as": "offerPricing"
    };
    return offerPipeline;
};
exports.employeePropertyDetails = (payload) => {
    let pipeline = [];
    let startTime;
    let endTime;
    if (payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.HOURLY) {
        startTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyFromDate(payload.fromDate, payload.offset);
        endTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyToDate(payload.toDate, payload.offset);
    }
    else {
        startTime = _common_1.DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset);
        endTime = _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset);
    }
    pipeline.push({
        $match: { "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), "partnerId": mongoose_1.Types.ObjectId(payload.partnerId), "floorNumber": payload.floorNumber, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
    }, {
        '$group': {
            _id: {
                "category": '$category._id'
            },
            categoryDetail: {
                '$push': {
                    floorId: '$spaceId',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    "floorNumber": '$floorNumber',
                    "availableUnit": "$employeeUnits",
                    "pricing": "$pricing",
                    "isLowest": '$isLowest',
                    "capacity": '$capacity',
                    "propertyId": "$propertyId",
                    "floorDescription": "$floorDescription",
                    "floorLabel": '$floorLabel'
                }
            }
        }
    });
    pipeline.push({ $unwind: { path: "$categoryDetail", preserveNullAndEmptyArrays: true } });
    pipeline.push({
        $lookup: {
            from: "booking",
            let: { spaceId: "$categoryDetail.floorId", propertyId: "$categoryDetail.propertyId", categoryId: "$categoryDetail.categoryData._id", floorNumber: "$categoryDetail.floorNumber" },
            pipeline: [
                {
                    $match: {
                        isEmployee: true,
                        bookingStatus: { $in: [_common_1.ENUM.BOOKING.STATUS.ACCEPTED, _common_1.ENUM.BOOKING.STATUS.ONGOING, _common_1.ENUM.BOOKING.STATUS.UPCOMING, _common_1.ENUM.BOOKING.STATUS.PENDING] },
                        $expr: {
                            $and: [
                                { $eq: ['$floorNumber', '$$floorNumber'] },
                                { $eq: ['$spaceId', '$$spaceId'] }
                            ],
                        }
                    }
                },
                {
                    $match: {
                        $or: [
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                            { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                            { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalBookedSlots: { $sum: "$quantity" }
                    }
                }
            ],
            as: "bookedSlots"
        }
    });
    pipeline.push({ $unwind: { path: "$bookedSlots", preserveNullAndEmptyArrays: true } });
    pipeline.push({
        $addFields: {
            bookedCount: {
                $cond: {
                    if: { $not: ["$bookedSlots"] },
                    then: 0,
                    else: "$bookedSlots.totalBookedSlots"
                }
            }
        }
    });
    pipeline.push({
        $addFields: {
            availableUnitCount: {
                $subtract: ['$categoryDetail.availableUnit', '$bookedCount']
            }
        }
    });
    pipeline.push({
        $group: {
            _id: "$_id.category",
            categoryDetail: {
                $push: "$$ROOT"
            },
        }
    });
    return pipeline;
};
exports.employeePropertySpaceDetails = (payload) => {
    let pipeline = [];
    let startTime;
    let endTime;
    if (payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.HOURLY) {
        startTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyFromDate(payload.fromDate, payload.offset);
        endTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyToDate(payload.toDate, payload.offset);
    }
    else {
        startTime = _common_1.DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset);
        endTime = _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset);
    }
    if (payload.spaceId) {
        pipeline.push({
            $match: { _id: mongoose_1.Types.ObjectId(payload.spaceId), "partnerId": mongoose_1.Types.ObjectId(payload.partnerId), "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), "floorNumber": payload.floorNumber, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
        });
    }
    else {
        pipeline.push({
            $match: { "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), "partnerId": mongoose_1.Types.ObjectId(payload.partnerId), "floorNumber": payload.floorNumber, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
        });
    }
    switch (payload.bookingType) {
        case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
            pipeline.push({ $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: true } });
            pipeline.push({
                $lookup: {
                    from: "booking",
                    let: { spaceId: "$_id", propertyId: "$propertyId" },
                    pipeline: [
                        {
                            $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: true, bookingStatus: { $in: [_common_1.ENUM.BOOKING.STATUS.ACCEPTED, _common_1.ENUM.BOOKING.STATUS.ONGOING, _common_1.ENUM.BOOKING.STATUS.UPCOMING, _common_1.ENUM.BOOKING.STATUS.PENDING] }, $expr: { '$in': ['$$spaceId', '$cartInfo.spaceId'] } }
                        },
                        {
                            $match: {
                                $or: [
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                                    { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                                ]
                            }
                        },
                    ],
                    as: "bookedSlots"
                }
            });
            break;
        case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
            pipeline.push({ $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY, isEmployee: true } });
            pipeline.push({
                $lookup: {
                    from: "booking",
                    let: { spaceId: "$_id", propertyId: "$propertyId" },
                    pipeline: [
                        {
                            $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY, isEmployee: true, bookingStatus: { $in: [_common_1.ENUM.BOOKING.STATUS.ACCEPTED, _common_1.ENUM.BOOKING.STATUS.ONGOING, _common_1.ENUM.BOOKING.STATUS.UPCOMING, _common_1.ENUM.BOOKING.STATUS.PENDING] }, $expr: { $eq: ['$spaceId', '$$spaceId'] } }
                        },
                        {
                            $match: {
                                $or: [
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                                    { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                                ]
                            }
                        },
                    ],
                    as: "bookedSlots"
                }
            });
            break;
        case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
            pipeline.push({ $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM, isEmployee: true } });
            pipeline.push({
                $lookup: {
                    from: "booking",
                    let: { spaceId: "$_id", propertyId: "$propertyId" },
                    pipeline: [
                        {
                            $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM, isEmployee: true, bookingStatus: { $in: [_common_1.ENUM.BOOKING.STATUS.ACCEPTED, _common_1.ENUM.BOOKING.STATUS.ONGOING, _common_1.ENUM.BOOKING.STATUS.UPCOMING, _common_1.ENUM.BOOKING.STATUS.PENDING] }, $expr: { $eq: ['$spaceId', '$$spaceId'] } }
                        },
                        {
                            $match: {
                                $or: [
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                                    { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                                ]
                            }
                        },
                    ],
                    as: "bookedSlots"
                }
            });
            break;
    }
    pipeline.push({ $match: { bookedSlots: { $size: 0 } } });
    pipeline.push({
        '$group': {
            _id: '$category._id',
            floorImage: {
                '$first': '$floorImage'
            },
            categoryDetail: {
                '$push': {
                    offerPricing: '$offerPricing',
                    spaceId: '$_id',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    floorNumber: '$floorNumber',
                    floorLabel: '$floorLabel',
                    availableUnit: '$units',
                    pricing: '$pricing',
                    isLowest: '$isLowest',
                    capacity: '$capacity',
                    propertyId: '$propertyId',
                    floorDescription: '$floorDescription',
                    totalUnits: '$units',
                    bookingType: '$bookingType',
                    position: '$position',
                    isEmployee: '$isEmployee',
                    gridRow: '$gridRow',
                    gridColumn: '$gridColumn',
                    spaceLabel: '$spaceLabel',
                    floorGridDetails: 1,
                    availableUnits: 1,
                    isAvailable: { $cond: { if: { $eq: [{ $size: "$bookedSlots" }, 0] }, then: 1, else: 0 } }
                }
            }
        }
    });
    return pipeline;
};
exports.userPropertySpaceDetails = (payload) => {
    let pipeline = [];
    let startTime;
    let endTime;
    if (payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.HOURLY) {
        startTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyFromDate(payload.fromDate, payload.offset);
        endTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyToDate(payload.toDate, payload.offset);
    }
    else {
        startTime = _common_1.DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset);
        endTime = _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset);
    }
    const offerPipeline = exports.fetchOfferPricingQuery(payload);
    if (payload.spaceId) {
        pipeline.push({
            $match: { _id: mongoose_1.Types.ObjectId(payload.spaceId), "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), "floorNumber": payload.floorNumber, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
        });
    }
    else {
        pipeline.push({
            $match: { "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), "floorNumber": payload.floorNumber, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
        });
    }
    switch (payload.bookingType) {
        case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
            pipeline.push({ $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: false } });
            pipeline.push(offerPipeline);
            pipeline.push({
                $lookup: {
                    from: "booking",
                    let: { spaceId: "$_id", propertyId: "$propertyId" },
                    pipeline: [
                        {
                            $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: false, bookingStatus: { $in: [_common_1.ENUM.BOOKING.STATUS.ACCEPTED, _common_1.ENUM.BOOKING.STATUS.ONGOING, _common_1.ENUM.BOOKING.STATUS.UPCOMING, _common_1.ENUM.BOOKING.STATUS.PENDING] }, $expr: { '$in': ['$$spaceId', '$cartInfo.spaceId'] } }
                        },
                        {
                            $match: {
                                $or: [
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                                    { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                                ]
                            }
                        },
                    ],
                    as: "bookedSlots"
                }
            });
            break;
        case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
            pipeline.push({ $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY, isEmployee: false } });
            pipeline.push(offerPipeline);
            pipeline.push({
                $lookup: {
                    from: "booking",
                    let: { spaceId: "$_id", propertyId: "$propertyId" },
                    pipeline: [
                        {
                            $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY, isEmployee: false, bookingStatus: { $in: [_common_1.ENUM.BOOKING.STATUS.ACCEPTED, _common_1.ENUM.BOOKING.STATUS.ONGOING, _common_1.ENUM.BOOKING.STATUS.UPCOMING, _common_1.ENUM.BOOKING.STATUS.PENDING] }, $expr: { '$in': ['$$spaceId', '$cartInfo.spaceId'] } }
                        },
                        {
                            $match: {
                                $or: [
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                                    { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                                ]
                            }
                        },
                    ],
                    as: "bookedSlots"
                }
            });
            break;
        case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
            pipeline.push({ $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM, isEmployee: false } });
            pipeline.push(offerPipeline);
            pipeline.push({
                $lookup: {
                    from: "booking",
                    let: { spaceId: "$_id", propertyId: "$propertyId" },
                    pipeline: [
                        {
                            $match: { bookingType: _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM, isEmployee: false, bookingStatus: { $in: [_common_1.ENUM.BOOKING.STATUS.ACCEPTED, _common_1.ENUM.BOOKING.STATUS.ONGOING, _common_1.ENUM.BOOKING.STATUS.UPCOMING, _common_1.ENUM.BOOKING.STATUS.PENDING] }, $expr: { '$in': ['$$spaceId', '$cartInfo.spaceId'] } }
                        },
                        {
                            $match: {
                                $or: [
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                                    { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                                    { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                                ]
                            }
                        },
                    ],
                    as: "bookedSlots"
                }
            });
            break;
    }
    pipeline.push({
        '$group': {
            _id: '$category._id',
            floorImage: {
                '$first': '$floorImage'
            },
            categoryDetail: {
                '$push': {
                    offerPricing: '$offerPricing',
                    spaceId: '$_id',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    floorNumber: '$floorNumber',
                    floorLabel: '$floorLabel',
                    availableUnit: '$units',
                    pricing: '$pricing',
                    isLowest: '$isLowest',
                    capacity: '$capacity',
                    propertyId: '$propertyId',
                    floorDescription: '$floorDescription',
                    totalUnits: '$units',
                    bookingType: '$bookingType',
                    position: '$position',
                    isEmployee: '$isEmployee',
                    gridRow: '$gridRow',
                    gridColumn: '$gridColumn',
                    spaceLabel: '$spaceLabel',
                    floorGridDetails: 1,
                    availableUnits: 1,
                    isAvailable: { $cond: { if: { $eq: [{ $size: "$bookedSlots" }, 0] }, then: 1, else: 0 } }
                }
            }
        }
    });
    return pipeline;
};
//# sourceMappingURL=user.employee.builder.js.map