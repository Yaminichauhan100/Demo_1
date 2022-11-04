"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentCountListing = exports.GetHostPaymentListing = exports.GetPaymentListing = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const moment_1 = __importDefault(require("moment"));
exports.GetPaymentListing = async (payload) => {
    let pipeline = [];
    let matchCriteria = [];
    let sortOrder = -1;
    let filterConditions = [];
    matchCriteria.push({ userId: payload.userId });
    if (payload.sortOrder && payload.sortOrder != '')
        sortOrder = payload.sortOrder;
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        "$lookup": {
            "from": "booking",
            "let": { "bookingId": "$bookingId" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$_id', '$$bookingId'] } }
                        ]
                    }
                },
            ],
            "as": "categoryData"
        }
    });
    pipeline.push({
        "$unwind": "$categoryData"
    });
    if (payload.search) {
        filterConditions.push({ "categoryData.propertyData.name": { $regex: payload.search, $options: "si" } });
    }
    if (payload.minAmount)
        filterConditions.push({ price: { $gte: payload.minAmount } });
    if (payload.maxAmount)
        filterConditions.push({ price: { $lte: payload.maxAmount } });
    if (payload.fromDate)
        filterConditions.push({ "categoryData.fromDate": { $gte: moment_1.default(payload.fromDate).startOf('day').toDate() } });
    if (payload.toDate)
        filterConditions.push({ "categoryData.toDate": { $lte: moment_1.default(payload.toDate).endOf('day').toDate() } });
    if (payload.status)
        filterConditions.push({ status: parseInt(payload.status) });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.sortKey) {
        if (payload.sortKey == "name")
            pipeline.push({ $sort: { "categoryData.propertyData.name": sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    pipeline.push({
        $project: {
            transactionId: 1,
            last4: 1,
            propertyName: "$categoryData.propertyData.name",
            items: "$categoryData.subCategory.name",
            fromDate: "$categoryData.fromDate",
            toDate: "$categoryData.toDate",
            quantity: "$categoryData.quantity",
            price: 1,
            status: 1,
            createdAt: 1,
            paymentType: "$paymentPlan",
            paymentPlan: 1,
            subCategory: "$categoryData.subCategory",
        }
    });
    return pipeline;
};
exports.GetHostPaymentListing = async (payload) => {
    let pipeline = [];
    let matchCriteria = [];
    let sortOrder = -1;
    let cityArray = [];
    let filterConditions = [];
    if (payload.userData.isCohost)
        matchCriteria.push({ hostId: mongoose_1.Types.ObjectId(payload.userData.hostId) });
    else
        matchCriteria.push({ hostId: mongoose_1.Types.ObjectId(payload.userId) });
    if (payload.sortOrder)
        sortOrder = payload.sortOrder;
    if (payload.propertyId)
        matchCriteria.push({ propertyId: mongoose_1.Types.ObjectId(payload.propertyId) });
    if (payload.paymentStatus) {
        matchCriteria.push({ status: parseInt(payload.paymentStatus) });
    }
    let propertyArray = [];
    if (payload.propertyIds) {
        propertyArray = payload.propertyIds.split(",");
        for (let i = 0; i < propertyArray.length; i++)
            propertyArray[i] = mongoose_1.Types.ObjectId(propertyArray[i]);
        matchCriteria.push({ 'propertyId': { $in: propertyArray } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        "$lookup": {
            "from": "booking",
            "let": { "bookingId": "$bookingId" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$_id', '$$bookingId'] } }
                        ]
                    }
                },
            ],
            "as": "categoryData"
        }
    });
    pipeline.push({
        "$unwind": "$categoryData"
    });
    if (payload.userData.isCohost && payload.userData.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } }
                            ]
                        }
                    },
                    { $project: { city: 1, state: 1, country: 1 } },
                ],
                "as": "property"
            }
        });
        pipeline.push({
            '$unwind': {
                path: '$property',
                preserveNullAndEmptyArrays: false
            }
        });
    }
    else if (payload.userData.isCohost) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } },
                                {
                                    '$expr': {
                                        '$in': [
                                            mongoose_1.Types.ObjectId(payload.userId),
                                            '$coHostId',
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    { $project: { city: 1, state: 1, country: 1 } },
                ],
                "as": "property"
            }
        });
        pipeline.push({
            '$unwind': {
                path: '$property',
                preserveNullAndEmptyArrays: false
            }
        });
    }
    else {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$propertyId'] } }
                            ]
                        }
                    },
                    { $project: { city: 1, state: 1, country: 1 } },
                ],
                "as": "property"
            }
        });
        pipeline.push({
            '$unwind': {
                path: '$property'
            }
        });
    }
    if (payload.search) {
        filterConditions.push({ "transactionId": { $regex: payload.search, $options: "si" } });
    }
    if (payload.fromDate)
        filterConditions.push({ "categoryData.fromDate": { $gte: new Date(payload.fromDate) } });
    if (payload.toDate)
        filterConditions.push({ "categoryData.toDate": { $lte: new Date(payload.toDate) } });
    if (payload.status)
        filterConditions.push({ status: parseInt(payload.status) });
    if (payload.countryId)
        filterConditions.push({ "property.country.id": parseInt(payload.countryId) });
    if (payload.stateId)
        filterConditions.push({ "property.state.id": parseInt(payload.stateId) });
    if (payload.cityId) {
        let catArrayObjectId = [];
        cityArray = payload.cityId.split(",");
        for (let i = 0; i < cityArray.length; i++) {
            cityArray[i] = cityArray[i], catArrayObjectId.push(mongoose_1.Types.ObjectId(cityArray[i]));
        }
        matchCriteria.push({ $or: [{ "property.city._id": { $in: cityArray } }, { 'property.city._id': { $in: catArrayObjectId } }] });
    }
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.sortKey) {
        if (payload.sortKey == "transactionId")
            pipeline.push({ $sort: { name: sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    pipeline.push({
        $project: {
            transactionId: 1,
            last4: 1,
            propertyName: "$categoryData.propertyData.name",
            items: "$categoryData.subCategory.name",
            fromDate: "$categoryData.fromDate",
            toDate: "$categoryData.toDate",
            quantity: "$categoryData.quantity",
            price: 1,
            status: "$categoryData.paymentStatus",
            createdAt: 1,
            paymentType: "$categoryData.paymentPlan",
            name: "$categoryData.userData.name",
            image: "$categoryData.userData.image",
            paymentMethod: 1,
            bookingStatus: "$categoryData.bookingStatus",
            action: { $literal: _common_1.ENUM.PAYMENT.ACTION.RECEIVED },
            subCategory: "$categoryData.subCategory",
            adminCommissionAmount: '$categoryData.adminCommission',
            invoiceUrl: "$categoryData.hostInvoice",
            bookingType: "$categoryData.bookingType",
            bookingDuration: "$categoryData.bookingDuration"
        }
    });
    return pipeline;
};
exports.GetPaymentCountListing = async (payload) => {
    var _a, _b;
    let pipeline = [];
    let matchCriteria = [];
    let cityArray = [];
    let filterConditions = [];
    if (payload.paymentStatus) {
        matchCriteria.push({ status: parseInt(payload.paymentStatus) });
    }
    let propertyArray = [];
    if (payload.propertyIds) {
        propertyArray = payload.propertyIds.split(",");
        for (let i = 0; i < propertyArray.length; i++)
            propertyArray[i] = mongoose_1.Types.ObjectId(propertyArray[i]);
        matchCriteria.push({ 'propertyId': { $in: propertyArray } });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    if (payload.countryId)
        filterConditions.push({ "property.country.id": parseInt(payload.countryId) });
    if (payload.stateId)
        filterConditions.push({ "property.state.id": parseInt(payload.stateId) });
    if (payload.cityId) {
        cityArray = payload.cityId.split(",");
        for (let i = 0; i < cityArray.length; i++) {
            cityArray[i] = mongoose_1.Types.ObjectId(cityArray[i]);
        }
        filterConditions.push({ "property.city._id": { $in: cityArray } });
    }
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    let hostCommissionAmount = ((_a = payload === null || payload === void 0 ? void 0 : payload.userData) === null || _a === void 0 ? void 0 : _a.commissionAmount) ? { "$subtract": ["$totalPayment", { "$divide": ["$totalPayment", (_b = payload === null || payload === void 0 ? void 0 : payload.userData) === null || _b === void 0 ? void 0 : _b.commissionAmount] }] } : "$totalPayment";
    if (payload.userData.isCohost) {
        pipeline.push({ $match: { hostId: mongoose_1.Types.ObjectId(payload.userData.hostId) } }, {
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
                settledPayment: {
                    $sum: {
                        "$map": {
                            "input": "$paymentData",
                            "as": "item",
                            "in": {
                                "$cond": [
                                    { "$eq": ["$$item.payoutStatus", true] },
                                    "$$item.price",
                                    0
                                ]
                            }
                        }
                    }
                },
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
        }, { $project: {
                settledPayment: 1,
                _id: 1,
                pendingPayment: 1,
                totalPayment: 1,
                paymentAfterCommission: hostCommissionAmount
            } });
    }
    else {
        pipeline.push({ $match: { hostId: mongoose_1.Types.ObjectId(payload.userId) } }, {
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
                _id: 1,
                settledPayment: {
                    $sum: {
                        "$map": {
                            "input": "$paymentData",
                            "as": "item",
                            "in": {
                                "$cond": [
                                    { "$eq": ["$$item.payoutStatus", true] },
                                    "$$item.price",
                                    0
                                ]
                            }
                        }
                    }
                },
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
        }, { $project: {
                settledPayment: 1,
                _id: 1,
                pendingPayment: 1,
                totalPayment: 1,
                paymentAfterCommission: hostCommissionAmount
            } });
    }
    return pipeline;
};
//# sourceMappingURL=payment.builder.js.map