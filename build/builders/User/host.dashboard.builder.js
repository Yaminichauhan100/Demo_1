"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueBasedData = exports.occupiedUnits = exports.calendarDataCategoryWise = exports.calendarData = exports.propertyListDashboard = exports.existUnits = exports.overallCustomerData = exports.revenueReturnCustomerData = exports.revenueCustomerBasedData = exports.revenueBasedPropertyData = exports.operation2 = exports.operation1 = exports.operation = exports.categoryBookedData = exports.categoryRejectedData = exports.categoryCompletedData = exports.categoryBookingData = exports.userAnalyticsData = exports.bookingAnalyticsData = exports.payoutAmountCount = exports.invoiceAmountCount = exports.propertyListing = exports.bookingRequestListing = exports.ongoingBookingListing = exports.bookingListing = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const moment_1 = __importDefault(require("moment"));
exports.bookingListing = (payload, userId) => {
    let pipeline = [];
    pipeline.push({ $match: { hostId: mongoose_1.Types.ObjectId(userId), bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED } } });
    pipeline.push({
        "$lookup": {
            "from": "properties",
            "let": { "propertyId": "$propertyData.propertyId" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$_id', '$$propertyId'] } },
                            { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } }
                        ]
                    }
                },
                { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
            ],
            "as": "propertyDetails"
        }
    });
    pipeline.push({ $unwind: { path: "$propertyDetails", 'preserveNullAndEmptyArrays': true } });
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').subtract(payload.offset).toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').subtract(payload.offset).toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').subtract(payload.offset).toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').subtract(payload.offset).toDate();
    let matchCriteria = [];
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ fromDate: { $gte: moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { $lte: moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ fromDate: { $gte: moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { $lte: moment_1.default(monthEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        $project: {
            _id: 0,
            bookingStatus: 1,
            userData: 1,
            hostId: 1,
            propertyData: 1
        }
    });
    return pipeline;
};
exports.ongoingBookingListing = (payload, userId) => {
    let pipeline = [];
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: _common_1.ENUM.BOOKING.STATUS.ONGOING
        },
    });
    pipeline.push({
        "$lookup": {
            "from": "properties",
            "let": { "propertyId": "$propertyData.propertyId" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$_id', '$$propertyId'] } },
                            { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                            { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                        ]
                    }
                },
                { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
            ],
            "as": "propertyDetails"
        }
    });
    pipeline.push({ $unwind: "$propertyDetails" });
    let matchCriteria = [];
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        $project: {
            _id: 0,
            bookingStatus: 1,
            userData: 1,
            hostId: 1,
            propertyData: 1
        }
    });
    return pipeline;
};
exports.bookingRequestListing = (payload, userId) => {
    let pipeline = [];
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: _common_1.ENUM.BOOKING.STATUS.PENDING,
            'propertyData.autoAcceptUpcomingBooking': false
        },
    });
    pipeline.push({
        "$lookup": {
            "from": "properties",
            "let": { "propertyId": "$propertyData.propertyId" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$_id', '$$propertyId'] } },
                            { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                            { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                        ]
                    }
                },
                { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
            ],
            "as": "propertyDetails"
        }
    });
    pipeline.push({ $unwind: "$propertyDetails" });
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').subtract(payload.offset).toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    let matchCriteria = [];
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ fromDate: { $gte: moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { $lte: moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ fromDate: { $gte: moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { $lte: moment_1.default(monthEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        $project: {
            _id: 0,
            bookingStatus: 1,
            userData: 1,
            hostId: 1,
            propertyData: 1
        }
    });
    return pipeline;
};
exports.propertyListing = (payload, userId) => {
    let pipeline = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').add(payload.offset).toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').add(payload.offset).toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').subtract(payload.offset).toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').add(payload.offset).toDate();
    let matchCriteria = [];
    if (payload.countryId) {
        matchCriteria.push({ "country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "state.id": parseInt(payload.stateId), userId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "city._id": payload.cityId, userId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ createdAt: { $gte: moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ createdAt: { $lte: moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { $gte: moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ createdAt: { $lte: moment_1.default(monthEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    if (payload.propertyId) {
        pipeline.push({
            $match: { _id: mongoose_1.Types.ObjectId(payload.propertyId), userId: mongoose_1.Types.ObjectId(userId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
        });
    }
    pipeline.push({
        $match: { userId: mongoose_1.Types.ObjectId(userId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
    });
    pipeline.push({
        "$lookup": {
            "from": "propertySpace",
            "let": { "propertyId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$propertyId', '$$propertyId'] } },
                            { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } }
                        ]
                    }
                },
                { $project: { userId: 1, status: 1, propertyId: 1 } }
            ],
            "as": "propertyData"
        },
    }, { $match: { spaceDetails: { $ne: [] } } }, { "$unwind": "$propertyData" }, {
        "$group": {
            "_id": "$propertyData.propertyId",
            "count": { "$sum": 1 }
        }
    });
    return pipeline;
};
exports.invoiceAmountCount = (payload, userId) => {
    let pipeline = [];
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').subtract(payload.offset).toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    let matchCriteria = [];
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ fromDate: { $gte: moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { $lte: moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ fromDate: { $gte: moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { $lte: moment_1.default(monthEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': {
            $and: [
                { hostId: mongoose_1.Types.ObjectId(userId) },
                { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED } },
                { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.PENDING } },
                { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.CANCELLED } },
                { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.REJECTED } }
            ]
        }
    }, {
        $group: {
            _id: null,
            count: { $sum: "$totalPayable" }
        }
    });
    pipeline.push({
        $project: {
            _id: 0,
            count: 1
        }
    });
    return pipeline;
};
exports.payoutAmountCount = (payload, userId) => {
    let pipeline = [];
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').subtract(payload.offset).toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    let matchCriteria = [];
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ fromDate: { $gte: moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { $lte: moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ fromDate: { $gte: moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { $lte: moment_1.default(monthEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': { hostId: mongoose_1.Types.ObjectId(userId), payoutStatus: true },
    }, {
        $group: {
            _id: null,
            count: { $sum: "$price" }
        }
    });
    pipeline.push({
        $project: {
            _id: 0,
            count: 1
        }
    });
    return pipeline;
};
exports.bookingAnalyticsData = (payload, userId) => {
    let pipeline = [];
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    let matchCriteria = [];
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    if (payload.year && !payload.month) {
        let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
        let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
        pipeline.push({
            "$match": {
                "$and": [
                    { "createdAt": { '$gte': yearStart } },
                    { "createdAt": { '$lte': yearEnd } },
                    { hostId: mongoose_1.Types.ObjectId(userId) }
                ]
            }
        }, {
            $group: {
                _id: {
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 },
                date: { $first: "$createdAt" }
            }
        }, { $sort: { "date": 1 } }, {
            $project: {
                _id: 0,
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$date"
                    }
                },
                count: 1
            }
        });
    }
    if (payload.year && payload.month) {
        let monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        let monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
        pipeline.push({
            "$match": {
                "$and": [
                    { "createdAt": { "$gte": monthStart } },
                    { "createdAt": { "$lte": monthEnd } },
                    { "hostId": mongoose_1.Types.ObjectId(userId) }
                ]
            }
        }, {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$createdAt" }
                },
                count: { $sum: 1 },
                date: { $first: "$createdAt" }
            }
        }, { $sort: { "date": 1 } }, {
            $project: {
                _id: 0,
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$date"
                    }
                },
                count: 1
            }
        });
    }
    return pipeline;
};
exports.userAnalyticsData = (payload, userId) => {
    let pipeline = [];
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    let matchCriteria = [];
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    if (payload.year && !payload.month) {
        let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
        let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
        pipeline.push({
            "$match": {
                "$and": [
                    { "updatedAt": { "$gte": yearStart } },
                    { "updatedAt": { "$lte": yearEnd } },
                    { "hostId": mongoose_1.Types.ObjectId(userId) }
                ]
            }
        }, {
            $group: {
                _id: {
                    month: { $month: "$updatedAt" }
                },
                count: { $sum: "$viewCount" },
                date: { $first: "$updatedAt" }
            }
        }, { $sort: { "date": 1 } }, {
            $project: {
                _id: 0,
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$date"
                    }
                },
                count: 1
            }
        });
    }
    if (payload.year && payload.month) {
        let monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        let monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
        pipeline.push({
            "$match": {
                "$and": [
                    { "updatedAt": { "$gte": monthStart } },
                    { "updatedAt": { "$lte": monthEnd } },
                    { "hostId": mongoose_1.Types.ObjectId(userId) }
                ]
            }
        }, {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$updatedAt" }
                },
                count: { $sum: "$viewCount" },
                date: { $first: "$updatedAt" }
            }
        }, { $sort: { "date": 1 } }, {
            $project: {
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$date"
                    }
                },
                count: 1,
                _id: 0
            }
        });
    }
    return pipeline;
};
exports.categoryBookingData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').subtract(payload.offset).toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').subtract(payload.offset).toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ fromDate: { '$gte': moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { '$lte': moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ fromDate: { '$gte': moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate() } });
        matchCriteria.push({ fromDate: { '$lte': moment_1.default(monthEnd).startOf('day').add(payload.offset).toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        $match: { "hostId": mongoose_1.Types.ObjectId(userId), status: { $ne: 'isDeleted' } }
    }, { $project: { bookingStatus: 1, category: 1, subCategory: 1, _id: 1, quantity: 1 } }, {
        '$group': {
            _id: '$subCategory._id',
            occupied: {
                '$sum': '$quantity'
            },
            bookingDetailsCategoryWise: {
                '$addToSet': {
                    category: '$category',
                    subCategory: '$subCategory',
                    bookingId: '$_id',
                    totalPayable: '$occupied',
                    bookingStatus: '$bookingStatus'
                }
            },
            category: {
                '$first': '$category'
            },
            subCategory: {
                '$first': '$subCategory'
            }
        },
    }, {
        $project: {
            _id: 0,
            occupied: 1,
            subCategory: 1,
            category: 1,
            bookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsCategoryWise",
                        as: "bookingDetails",
                        cond: { $ne: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ABANDONED] }
                    }
                }
            },
            cancelllationCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsCategoryWise",
                        as: "bookingDetails",
                        cond: { $eq: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.CANCELLED] }
                    }
                }
            },
            rejectedCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsCategoryWise",
                        as: "bookingDetails",
                        cond: { $eq: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.REJECTED] }
                    }
                }
            },
            completedCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsCategoryWise",
                        as: "bookingDetails",
                        cond: { $eq: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.COMPLETED] }
                    }
                }
            }
        }
    });
    pipeline.push({ $sort: { "subCategory._id": -1 } });
    return pipeline;
};
exports.categoryCompletedData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(yearStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(yearEnd).endOf('day').toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(monthStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(monthEnd).endOf('day').toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: _common_1.ENUM.BOOKING.STATUS.COMPLETED
        }
    }, {
        $group: {
            _id: "$subCategory._id",
            count: { $sum: 1 },
            categoryData: { $push: "$subCategory" }
        }
    }, {
        $project: {
            _id: 0,
            count: 1,
            categoryData: 1
        }
    });
    return pipeline;
};
exports.categoryRejectedData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(yearStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(yearEnd).endOf('day').toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(monthStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(monthEnd).endOf('day').toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: _common_1.ENUM.BOOKING.STATUS.REJECTED
        }
    }, {
        $group: {
            _id: "$subCategory._id",
            count: { $sum: 1 },
            categoryData: { $push: "$subCategory" }
        }
    }, {
        $project: {
            _id: 0,
            count: 1,
            categoryData: 1
        }
    });
    return pipeline;
};
exports.categoryBookedData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(yearStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(yearEnd).endOf('day').toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(monthStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(monthEnd).endOf('day').toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED
        }
    }, {
        $group: {
            _id: "$subCategory._id",
            count: { $sum: 1 },
            categoryData: { $first: "$category" }
        }
    }, {
        $project: {
            _id: 0,
            count: 1,
            categoryData: 1
        }
    });
    return pipeline;
};
function operation(list1, list2, isUnion) {
    var result = [];
    for (var i = 0; i < list1.length; i++) {
        var item1 = list1[i], found = false;
        for (var j = 0; j < list2.length && !found; j++) {
            found = item1._id === list2[j]._id;
        }
        if (found === !!isUnion) {
            result.push(item1);
        }
    }
    return result;
}
exports.operation = operation;
function operation1(list1, list2, isUnion) {
    var result = [];
    for (var i = 0; i < list1.length; i++) {
        var item1 = list1[i], found = false;
        for (var j = 0; j < list2.length && !found; j++) {
            found = item1.subCategory._id === list2[j]._id;
        }
        if (found === !!isUnion) {
            result.push(item1);
        }
    }
    return result;
}
exports.operation1 = operation1;
function operation2(list1, list2, isUnion) {
    var result = [];
    for (var i = 0; i < list1.length; i++) {
        var item1 = list1[i], found = false;
        for (var j = 0; j < list2.length && !found; j++) {
            found = item1.subCategory._id === list2[j].subCategory._id;
        }
        if (found === !!isUnion) {
            result.push(item1);
        }
    }
    return result;
}
exports.operation2 = operation2;
exports.revenueBasedPropertyData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').subtract(payload.offset).toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    pipeline.push({
        $match: { userId: mongoose_1.Types.ObjectId(userId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
    });
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
    }, { $match: { spaceD: { $ne: [] } } });
    if (payload.year && payload.month) {
        pipeline.push({
            "$lookup": {
                "from": "booking",
                "let": { "propertyId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            $expr: {
                                $and: [
                                    { $eq: ['$propertyData.propertyId', '$$propertyId'] },
                                    { $eq: ['$hostId', mongoose_1.Types.ObjectId(userId)] },
                                    { $gte: ["$fromDate", moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate()] },
                                    { $lte: ["$fromDate", moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate()] },
                                    { $gte: ["$fromDate", moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate()] },
                                    { $lte: ["$fromDate", moment_1.default(monthEnd).startOf('day').add(payload.offset).toDate()] },
                                    { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.ABANDONED] },
                                    { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.REJECTED] },
                                    { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.CANCELLED] },
                                    { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.PENDING] }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$propertyData.propertyId",
                            count: { $sum: 1 },
                            totalPayment: { $sum: "$totalPayable" },
                        }
                    },
                    { $project: { _id: 0, count: 1, totalPayment: 1 } }
                ],
                "as": "bookingDetails"
            }
        });
    }
    else if (payload.year) {
        pipeline.push({
            "$lookup": {
                "from": "booking",
                "let": { "propertyId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$propertyData.propertyId', '$$propertyId'] } },
                                { $expr: { $eq: ['$hostId', mongoose_1.Types.ObjectId(userId)] } },
                                { $expr: { $gte: ["$fromDate", moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate()] } },
                                { $expr: { $lte: ["$fromDate", moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate()] } },
                                { $expr: { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.ABANDONED] } },
                                { $expr: { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.REJECTED] } },
                                { $expr: { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.CANCELLED] } },
                                { $expr: { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.PENDING] } }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: "$propertyData.propertyId",
                            count: { $sum: 1 },
                            totalPayment: { $sum: "$totalPayable" }
                        }
                    },
                    { $project: { _id: 0, count: 1, totalPayment: 1 } }
                ],
                "as": "bookingDetails"
            }
        });
    }
    else {
        pipeline.push({
            "$lookup": {
                "from": "booking",
                "let": { "propertyId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$propertyData.propertyId', '$$propertyId'] } },
                                { $expr: { $eq: ['$hostId', mongoose_1.Types.ObjectId(userId)] } },
                                { $expr: { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.ABANDONED] } },
                                { $expr: { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.REJECTED] } },
                                { $expr: { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.CANCELLED] } },
                                { $expr: { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.PENDING] } }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: "$propertyData.propertyId",
                            count: { $sum: 1 },
                            totalPayment: { $sum: "$totalPayable" }
                        }
                    },
                    { $project: { _id: 0, count: 1, totalPayment: 1 } }
                ],
                "as": "bookingDetails"
            }
        });
    }
    pipeline.push({ $unwind: "$bookingDetails" });
    if (payload.countryId) {
        matchCriteria.push({ "country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "state.id": parseInt(payload.stateId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "city._id": payload.cityId });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "_id": mongoose_1.Types.ObjectId(payload.propertyId), userId: mongoose_1.Types.ObjectId(userId) });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    let sortOrder = -1;
    if (payload.sortOrder && payload.sortOrder != '') {
        sortOrder = payload.sortOrder;
    }
    pipeline.push({ $sort: { "bookingDetails.totalPayment": -(sortOrder) } });
    pipeline.push({
        $project: {
            name: 1,
            propertyData: { totalCount: '$totalUnits', propertyId: '$_id' },
            bookingDetails: 1
        }
    });
    return pipeline;
};
exports.revenueCustomerBasedData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(yearStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(yearEnd).startOf('day').toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(monthStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(monthEnd).startOf('day').toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: {
                $nin: [
                    _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                    _common_1.ENUM.BOOKING.STATUS.PENDING,
                    _common_1.ENUM.BOOKING.STATUS.CANCELLED
                ]
            }
        }
    }, { $project: { bookingStatus: 1, userData: 1 } }, {
        '$group': {
            _id: '$userData.userId',
            userBookingCount: { $sum: 1 },
            userDetails: {
                '$addToSet': {
                    bookingStatus: '$bookingStatus',
                    userData: '$userData'
                }
            },
        }
    }, {
        '$project': {
            _id: 1,
            userBookingCount: 1,
            userData: 1,
        }
    });
    return pipeline;
};
exports.revenueReturnCustomerData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(yearStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(yearEnd).startOf('day').toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(monthStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(monthEnd).startOf('day').toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED
        }
    }, {
        $group: {
            _id: "$userData.userId"
        }
    }, {
        $count: "returningCustomer"
    });
    return pipeline;
};
exports.overallCustomerData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.year) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(yearStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(yearEnd).startOf('day').toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(monthStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(monthEnd).startOf('day').toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: {
                $nin: [
                    _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                    _common_1.ENUM.BOOKING.STATUS.PENDING,
                    _common_1.ENUM.BOOKING.STATUS.CANCELLED
                ]
            }
        }
    }, {
        $group: {
            _id: "$userData.userId",
        }
    }, { $count: "totalCustomers" });
    return pipeline;
};
exports.existUnits = (payload, userId) => {
    let pipeline = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    console.log("dates ==>", monthStart, monthEnd);
    let matchCriteria = [];
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    if (payload.propertyId) {
        pipeline.push({
            $match: {
                propertyId: mongoose_1.Types.ObjectId(payload.propertyId),
                status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE
            }
        }, {
            '$group': {
                _id: '$subCategory._id',
                totalSum: {
                    '$sum': 1
                },
                subCategory: {
                    '$first': '$subCategory'
                },
                category: {
                    '$first': '$category'
                }
            }
        }, {
            '$project': { _id: 0, totalSum: 1, category: 1, subCategory: 1 }
        });
    }
    else {
        pipeline.push({
            $match: {
                propertyId: { $in: payload.property },
                status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE
            }
        }, {
            '$group': {
                _id: '$subCategory._id',
                totalSum: {
                    '$sum': 1
                },
                subCategory: {
                    '$first': '$subCategory'
                },
                category: {
                    '$first': '$category'
                }
            }
        }, {
            '$project': { _id: 0, totalSum: 1, category: 1, subCategory: 1 }
        });
    }
    pipeline.push({ $sort: { "subCategory._id": -1 } });
    return pipeline;
};
exports.propertyListDashboard = (payload, userId) => {
    let pipeline = [];
    if (payload.propertyId)
        pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.propertyId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE } });
    else
        pipeline.push({ $match: { userId: mongoose_1.Types.ObjectId(userId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE } });
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').subtract(payload.offset).toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    pipeline.push({
        "$lookup": {
            "from": "propertySpace",
            "let": { "propertyId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $expr: {
                            $and: [
                                { $eq: ['$propertyId', '$$propertyId'] },
                                { $eq: ["$status", 'active'] }
                            ]
                        }
                    }
                },
                { $project: { totalUnits: 1 } }
            ],
            "as": "spaceDetails"
        }
    }, { $match: { 'spaceDetails': { $ne: [] } } });
    if (payload.year && payload.month) {
        pipeline.push({
            "$lookup": {
                "from": "booking",
                "let": { "propertyId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    { $gte: ["$fromDate", moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate()] },
                                    { $lte: ["$fromDate", moment_1.default(yearEnd).startOf('day').add(payload.offset).toDate()] },
                                    { $gte: ["$fromDate", moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate()] },
                                    { $lte: ["$fromDate", moment_1.default(monthEnd).startOf('day').add(payload.offset).toDate()] },
                                    {
                                        '$eq': [
                                            '$propertyData.propertyId',
                                            '$$propertyId'
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.ABANDONED
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.PENDING
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.CANCELLED
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.REJECTED
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                ],
                "as": "spaceD"
            }
        }, { $match: { spaceD: { $ne: [] } } }, { $project: { totalUnits: 1 } });
    }
    else if (payload.year) {
        pipeline.push({
            "$lookup": {
                "from": "booking",
                "let": { "propertyId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    { $gte: ["$fromDate", moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate()] },
                                    { $lte: ["$fromDate", moment_1.default(yearEnd).endOf('day').startOf('day').add(payload.offset).toDate()] },
                                    {
                                        '$eq': [
                                            '$propertyData.propertyId',
                                            '$$propertyId'
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.ABANDONED
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.PENDING
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.CANCELLED
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.REJECTED
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                ],
                "as": "spaceD"
            }
        }, { $match: { spaceD: { $ne: [] } } }, { $project: { totalUnits: 1 } });
    }
    else {
        pipeline.push({
            "$lookup": {
                "from": "booking",
                "let": { "propertyId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$propertyData.propertyId',
                                            '$$propertyId'
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.ABANDONED
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.PENDING
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.CANCELLED
                                        ]
                                    },
                                    {
                                        '$ne': [
                                            '$bookingStatus',
                                            _common_1.ENUM.BOOKING.STATUS.REJECTED
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                ],
                "as": "spaceD"
            }
        }, { $match: { spaceD: { $ne: [] } } }, { $project: { totalUnits: 1 } });
    }
    pipeline.push({ $sort: { _id: 1 } });
    return pipeline;
};
exports.calendarData = (payload, userId) => {
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').subtract(payload.offset).toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').subtract(payload.offset).toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    let matchCriteria = [];
    let pipeline = [];
    pipeline.push({
        $match: {
            "hostId": mongoose_1.Types.ObjectId(userId)
        }
    });
    pipeline.push({ "$unwind": "$bookingDetails" });
    if (payload.propertyId) {
        matchCriteria.push({
            "bookingDetails.bookingStatus": {
                $nin: [
                    _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                    _common_1.ENUM.BOOKING.STATUS.PENDING,
                    _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                    _common_1.ENUM.BOOKING.STATUS.REJECTED
                ]
            }, propertyId: mongoose_1.Types.ObjectId(payload.propertyId),
        });
        if (payload.year && payload.month) {
            matchCriteria.push({ date: { $gte: moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } }, { date: { $lte: moment_1.default(yearEnd).startOf('day').toDate() } }, { date: { $gte: moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate() } }, { date: { $lte: moment_1.default(monthEnd).startOf('day').toDate() } });
        }
        else if (payload.year) {
            matchCriteria.push({ date: { $gte: moment_1.default(yearStart).subtract(payload.offset).startOf('day').toDate() } }, { date: { $lte: moment_1.default(yearEnd).startOf('day').toDate() } });
        }
    }
    else {
        matchCriteria.push({
            "hostId": mongoose_1.Types.ObjectId(userId),
            "bookingDetails.bookingStatus": {
                $nin: [
                    _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                    _common_1.ENUM.BOOKING.STATUS.PENDING,
                    _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                    _common_1.ENUM.BOOKING.STATUS.REJECTED
                ]
            },
        });
        if (payload.year && payload.month) {
            matchCriteria.push({ date: { $gte: moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } }, { date: { $lte: moment_1.default(yearEnd).startOf('day').toDate() } }, { date: { $gte: moment_1.default(monthStart).startOf('day').subtract(payload.offset).toDate() } }, { date: { $lte: moment_1.default(monthEnd).startOf('day').toDate() } });
        }
        else if (payload.year) {
            matchCriteria.push({ date: { $gte: moment_1.default(yearStart).startOf('day').subtract(payload.offset).toDate() } }, { date: { $lte: moment_1.default(yearEnd).startOf('day').toDate() } });
        }
    }
    pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        $group: {
            "_id": {
                propertyId: "$propertyId",
                date: "$date",
            },
            bookingDetails: { "$push": "$bookingDetails" },
            quantitySum: { $sum: { $sum: "$bookingDetails.quantity" } },
        }
    }, {
        $group: {
            "_id": "$_id.propertyId",
            count: { $sum: "$quantitySum" }
        }
    });
    pipeline.push({ $sort: { propertyId: 1 } });
    return pipeline;
};
exports.calendarDataCategoryWise = (payload, userId) => {
    let monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
    let monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    let matchCriteria = [];
    let pipeline = [];
    if (payload.propertyId) {
        matchCriteria.push({
            "hostId": mongoose_1.Types.ObjectId(userId),
            "bookingDetails": {
                $elemMatch: {
                    bookingStatus: {
                        $nin: [
                            _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                            _common_1.ENUM.BOOKING.STATUS.PENDING,
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED
                        ]
                    }
                }
            }, propertyId: mongoose_1.Types.ObjectId(payload.propertyId), date: { $gte: moment_1.default(monthStart).startOf('day').toDate(), $lte: moment_1.default(monthEnd).startOf('day').toDate() }
        });
    }
    else {
        matchCriteria.push({
            "hostId": mongoose_1.Types.ObjectId(userId),
            "bookingDetails": {
                $elemMatch: {
                    bookingStatus: {
                        $nin: [
                            _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                            _common_1.ENUM.BOOKING.STATUS.PENDING,
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED,
                        ]
                    }
                }
            }, date: { $gte: moment_1.default(monthStart).startOf('day').toDate(), $lte: moment_1.default(monthEnd).startOf('day').toDate() }
        });
    }
    pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({ "$unwind": "$bookingDetails" }, {
        $match: {
            "bookingDetails.bookingStatus": {
                '$nin': [
                    5,
                    7,
                    2,
                    4
                ]
            }
        }
    }, {
        "$group": {
            "_id": "$bookingDetails.subCategory._id",
            count: { $sum: "$bookingDetails.quantity" }
        }
    });
    return pipeline;
};
exports.occupiedUnits = (payload, userId) => {
    let pipeline = [];
    let monthStart;
    let monthEnd;
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.month) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let matchCriteria = [];
    if (payload.year) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(yearStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(yearEnd).endOf('day').toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(monthStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(monthEnd).endOf('day').toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        $match: {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: {
                $nin: [
                    _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                    _common_1.ENUM.BOOKING.STATUS.PENDING,
                    _common_1.ENUM.BOOKING.STATUS.CANCELLED
                ]
            }
        }
    }, {
        $group: {
            _id: "$propertyData.propertyId",
            totalSum: { $sum: "$quantity" },
            propertyId: { $first: "$propertyData.propertyId" },
            subCategory: { $first: "$subCategory" }
        }
    }, {
        $project: {
            _id: 0,
            totalSum: 1,
            propertyId: 1,
            subCategory: 1
        }
    });
    return pipeline;
};
exports.revenueBasedData = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = [];
    let monthStart;
    let monthEnd;
    if (payload.year) {
        monthStart = moment_1.default([payload.year, payload.month - 1]).startOf('month').toDate();
        monthEnd = moment_1.default([payload.year, payload.month - 1]).endOf('month').toDate();
    }
    else {
        monthStart = moment_1.default().month(payload.month - 1).startOf('month').toDate();
        monthEnd = moment_1.default().month(payload.month - 1).endOf('month').toDate();
    }
    let yearStart = moment_1.default([payload.year]).startOf('year').toDate();
    let yearEnd = moment_1.default([payload.year]).endOf('year').toDate();
    if (payload.countryId || payload.stateId || payload.cityId) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                { $expr: { $eq: ['$status', _common_1.ENUM.PROPERTY.STATUS.ACTIVE] } },
                                { $expr: { $eq: ['$userId', mongoose_1.Types.ObjectId(userId)] } }
                            ]
                        }
                    },
                    { $project: { country: 1, state: 1, city: 1, hostId: 1, propertyId: 1 } }
                ],
                "as": "propertyDetails"
            }
        });
        pipeline.push({ $unwind: "$propertyDetails" });
    }
    if (payload.countryId) {
        matchCriteria.push({ "propertyDetails.country.id": parseInt(payload.countryId) });
    }
    if (payload.stateId) {
        matchCriteria.push({ "propertyDetails.state.id": parseInt(payload.stateId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.cityId) {
        matchCriteria.push({ "propertyDetails.city._id": payload.cityId, hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.propertyId) {
        matchCriteria.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId), hostId: mongoose_1.Types.ObjectId(userId) });
    }
    if (payload.year) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(yearStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(yearEnd).startOf('day').toDate() } });
    }
    if (payload.month) {
        matchCriteria.push({ createdAt: { '$gte': moment_1.default(monthStart).startOf('day').toDate() } });
        matchCriteria.push({ createdAt: { '$lte': moment_1.default(monthEnd).startOf('day').toDate() } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(userId),
            bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED
        }
    }, {
        $group: {
            _id: "$userData.userId",
            count: { $sum: 1 },
            createdAt: { $push: "$createdAt" }
        }
    }, {
        $project: {
            _id: 0,
            count: 1,
            createdAt: 1
        }
    });
    return pipeline;
};
//# sourceMappingURL=host.dashboard.builder.js.map