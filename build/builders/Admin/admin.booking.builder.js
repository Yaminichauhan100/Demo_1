"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingList = exports.HostList = void 0;
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
exports.HostList = (payload) => {
    let pipeline = [];
    let filterConditions = { $match: { $and: [] } };
    if (payload.type == _common_1.CONSTANT.BOOKING.REQUEST)
        filterConditions.$match.$and.push({ 'propertyData.autoAcceptUpcomingBooking': false });
    filterConditions.$match.$and.push({ hostId: payload.userId });
    pipeline.push(filterConditions);
    pipeline.push({
        "$lookup": {
            "from": "propertySpace",
            "let": { "propertyId": "$spaceId" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$_id', '$$propertyId'] } }
                        ]
                    }
                },
                { $project: { category: 1, subCategory: 1, pricing: 1 } },
                { $limit: 10 },
            ],
            "as": "categoryData"
        }
    });
    let matchCriteria = [];
    pipeline.push({ $unwind: "$categoryData" });
    if (payload.categoryId)
        matchCriteria.push({ 'categoryData.category._id': mongoose_1.Types.ObjectId(payload.categoryId) });
    if (payload.subCategoryId)
        matchCriteria.push({ 'categoryData.subCategory.id': mongoose_1.Types.ObjectId(payload.subCategoryId) });
    if (payload.status)
        matchCriteria.push({ 'bookingStatus': parseInt(payload.status) });
    if (payload.mode)
        matchCriteria.push({ 'bookingMode': parseInt(payload.mode) });
    if (payload.fromDate) {
        matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
    }
    if (payload.toDate)
        matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
    payload && payload.limit ? payload.limit = payload.limit : payload.limit = 10;
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        $project: {
            propertyData: 1,
            bookingStatus: 1,
            bookingMode: 1,
            timing: 1,
            categoryData: 1,
            fromDate: 1,
            toDate: 1,
            occupancy: 1,
            createdAt: 1,
            userData: 1,
            totalPayable: 1,
            quantity: 1,
            userBookingStatus: 1,
            bookingId: 1
        }
    });
    return pipeline;
};
exports.BookingList = (payload) => {
    let pipeline = [];
    let matchCriteria = [];
    let sortOrder = -1;
    if (payload.sortOrder && payload.sortOrder != '')
        sortOrder = payload.sortOrder;
    let filterConditions = [];
    switch (payload.type) {
        case _common_1.ENUM.BOOKING.STATUS.PENDING:
            filterConditions.push({
                'propertyData.autoAcceptUpcomingBooking': false,
                bookingStatus: _common_1.ENUM.BOOKING.STATUS.PENDING
            });
            break;
        case _common_1.ENUM.BOOKING.STATUS.REJECTED:
            filterConditions.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.REJECTED });
            break;
        case 8:
            filterConditions.push({ bookingMode: _common_1.ENUM.BOOKING_MODE.STATUS.OFFLINE });
            break;
        case _common_1.ENUM.BOOKING.STATUS.ONGOING:
            filterConditions.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.ONGOING });
            break;
        case _common_1.ENUM.BOOKING.STATUS.COMPLETED:
            filterConditions.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.COMPLETED });
            break;
        case _common_1.ENUM.BOOKING.STATUS.UPCOMING:
            filterConditions.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.UPCOMING });
            break;
        case _common_1.ENUM.BOOKING.STATUS.CANCELLED:
            filterConditions.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.CANCELLED });
            break;
    }
    if (payload === null || payload === void 0 ? void 0 : payload.propertyId) {
        filterConditions.push({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.propertyId) });
    }
    if (payload.search)
        filterConditions.push({
            $or: [
                {
                    bookingId: { $regex: payload.search, $options: "si" }
                },
                { "propertyData.hostName": { $regex: payload.search, $options: "si" } }
            ]
        });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.cityId || payload.countryId || payload.stateId) {
        pipeline.push({
            '$lookup': {
                from: 'properties',
                let: {
                    propertyId: '$propertyData.propertyId'
                },
                pipeline: [
                    {
                        '$match': {
                            '$and': [
                                {
                                    '$expr': {
                                        '$eq': [
                                            '$_id',
                                            '$$propertyId'
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        '$project': {
                            state: 1,
                            city: 1,
                            country: 1
                        }
                    }
                ],
                as: 'property'
            }
        });
        if (payload.cityId)
            matchCriteria.push({ "property.city._id": payload.cityId });
        if (payload.stateId)
            matchCriteria.push({ "property.state.id": parseInt(payload.stateId) });
        if (payload.countryId)
            matchCriteria.push({ "property.country.id": parseInt(payload.countryId) });
    }
    if (payload.categoryId)
        matchCriteria.push({ 'category._id': payload.categoryId });
    if (payload.subCategoryId)
        matchCriteria.push({ 'subCategory._id': payload.subCategoryId });
    if (payload.status)
        matchCriteria.push({ 'bookingStatus': parseInt(payload.status) });
    if (payload.mode)
        matchCriteria.push({ 'bookingMode': parseInt(payload.mode) });
    if (payload.fromDate) {
        matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
    }
    if (payload.toDate)
        matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
    if (payload.bookingType)
        matchCriteria.push({ bookingType: payload.bookingType });
    payload && payload.limit ? payload.limit = payload.limit : payload.limit = 10;
    if (payload.minAmount)
        matchCriteria.push({ totalPayable: { $gte: payload.minAmount } });
    if (payload.maxAmount)
        matchCriteria.push({ totalPayable: { $lte: payload.maxAmount } });
    console.log(matchCriteria);
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$group': {
            _id: '$_id',
            propertyData: { $first: '$propertyData' },
            bookingStatus: { $first: '$bookingStatus' },
            bookingMode: { $first: '$bookingMode' },
            timing: { $first: '$timing' },
            categoryData: {
                '$first': {
                    category: '$category',
                    pricing: '$pricing',
                    subCategory: '$subCategory'
                }
            },
            fromDate: { $first: '$fromDate' },
            toDate: { $first: '$toDate' },
            occupancy: { $first: '$occupancy' },
            createdAt: { $first: '$createdAt' },
            userData: { $first: '$userData' },
            totalPayable: { $first: '$totalPayable' },
            quantity: { $first: '$quantity' },
            userBookingStatus: { $first: '$userBookingStatus' },
            bookingId: { $first: '$bookingId' },
            invoiceUrl: { $first: '$invoiceUrl' },
            isEmployee: { $first: '$isEmployee' },
            bookingType: { $first: '$bookingType' },
            bookingDuration: { $first: '$bookingDuration' },
            cartInfo: { $first: '$cartInfo' },
            hostInvoice: { $first: '$hostInvoice' }
        }
    });
    switch (payload.sortKey) {
        case "propertyName":
            pipeline.push({ $sort: { "propertyData.name": sortOrder } });
            break;
        case "userName":
            pipeline.push({ $sort: { "userData.name": sortOrder } });
            break;
        case "totalPayable":
            pipeline.push({ $sort: { "totalPayable": sortOrder } });
            break;
        default:
            pipeline.push({ $sort: { createdAt: sortOrder } });
    }
    if (!payload.sortKey)
        pipeline.push({ $sort: { createdAt: sortOrder } });
    pipeline.push({
        $project: {
            propertyData: 1,
            bookingStatus: 1,
            bookingMode: 1,
            timing: 1,
            categoryData: 1,
            fromDate: 1,
            toDate: 1,
            occupancy: 1,
            createdAt: 1,
            userData: 1,
            totalPayable: 1,
            quantity: 1,
            userBookingStatus: 1,
            bookingId: 1,
            isEmployee: 1,
            floorNumber: 1,
            bookingType: 1,
            floorDescription: 1,
            floorLabel: 1,
            invoiceUrl: 1,
            hostInvoice: 1
        }
    });
    return pipeline;
};
//# sourceMappingURL=admin.booking.builder.js.map