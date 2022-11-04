"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const reviews_model_1 = __importDefault(require("@models/reviews.model"));
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const booking_v1_entity_1 = require("./booking.v1.entity");
const _common_1 = require("@common");
class RatingEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async getRatingList(_a) {
        var params = __rest(_a, []);
        let pipeline = [];
        let cityArray = [];
        let filterConditions = [];
        params && params.sortBy ? params.sortBy = params.sortBy : params.sortBy = -1;
        let matchCriteria = { $match: { $and: [] } };
        if (params.userData.isCohost)
            matchCriteria.$match.$and.push({ hostId: mongoose_1.Types.ObjectId(params.userData.hostId) });
        else
            matchCriteria.$match.$and.push({ hostId: mongoose_1.Types.ObjectId(params.userId) });
        if (params && params.rating) {
            params.rating = params.rating.split(",");
            matchCriteria.$match.$and.push({ rating: { $in: await _services_1.toNumberString(params.rating) } });
        }
        if (params && params.propertyId) {
            params.propertyId = params.propertyId.split(",");
            matchCriteria.$match.$and.push({ propertyId: { $in: await _services_1.toObjectId(params.propertyId) } });
        }
        pipeline.push(matchCriteria);
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
                "as": "booking"
            },
        }, {
            "$replaceRoot": { "newRoot": { "$mergeObjects": [{ "$arrayElemAt": ["$booking", 0] }, "$$ROOT"] } }
        });
        if (params.userData.isCohost && params.userData.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
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
                        }
                    ],
                    "as": "property"
                }
            });
        }
        else if (params.userData.isCohost) {
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
                                                mongoose_1.Types.ObjectId(params.userId),
                                                '$coHostId',
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
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
                        }
                    ],
                    "as": "property"
                }
            });
        }
        if (params.countryId)
            filterConditions.push({ "property.country.id": parseInt(params.countryId) });
        if (params.stateId)
            filterConditions.push({ "property.state.id": parseInt(params.stateId) });
        if (params.cityId) {
            cityArray = params.cityId.split(",");
            for (let i = 0; i < cityArray.length; i++) {
                cityArray[i] = mongoose_1.Types.ObjectId(cityArray[i]);
            }
            filterConditions.push({ "property.city._id": { $in: cityArray } });
        }
        if (filterConditions.length)
            pipeline.push({ $match: { $and: filterConditions } });
        pipeline.push({ $sort: { rating: params.sortBy, createdAt: params.sortBy } });
        pipeline.push({
            "$project": {
                review: 1,
                rating: 1,
                propertyId: 1,
                reply: { $ifNull: ['$reply', []] },
                userData: { userId: '$userData.userId', name: '$userData.name', image: '$userData.image' },
                hostData: { userId: '$hostId', name: '$propertyData.hostName', image: '$propertyData.hostImage' },
                'propertyName': '$propertyData.name',
                createdAt: 1,
                updatedAt: 1,
                bookingId: 1
            }
        });
        let details = await exports.RatingV1.paginateAggregate(pipeline, { limit: params && params.limit ? params.limit = params.limit : params.limit = 10, page: params.page });
        return details;
    }
    async getPropertyRatingList(_a) {
        var params = __rest(_a, []);
        let pipeline = [];
        let matchCriteria = { $match: { $and: [] } };
        params && params.sortBy ? params.sortBy = parseInt(params.sortBy) : params.sortBy = -1;
        matchCriteria.$match.$and.push({ propertyId: mongoose_1.Types.ObjectId(params.propertyId) });
        if (params && params.isFeatured)
            matchCriteria.$match.$and.push({ isFeatured: params.isFeatured });
        pipeline.push(matchCriteria);
        pipeline.push({ $sort: { rating: params.sortBy, createdAt: params.sortBy } });
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
                "as": "booking"
            },
        }, {
            "$replaceRoot": { "newRoot": { "$mergeObjects": [{ "$arrayElemAt": ["$booking", 0] }, "$$ROOT"] } }
        }, {
            "$project": {
                review: 1,
                rating: 1,
                isFeatured: 1,
                propertyId: 1,
                reply: { $ifNull: ['$reply', []] },
                'propertyName': '$propertyData.name',
                userData: { userId: '$userData.userId', name: '$userData.name', image: '$userData.image' },
                hostData: { userId: '$hostId', name: '$propertyData.hostName', image: '$propertyData.hostImage' },
                createdAt: 1,
                updatedAt: 1
            }
        });
        let details = await exports.RatingV1.paginateAggregate(pipeline, { limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 2, page: params.page, getCount: true });
        return details;
    }
    async getAdminRatingList(_a) {
        var params = __rest(_a, []);
        let pipeline = [];
        let matchCriteria = { $match: { $and: [] } };
        params && params.sortBy ? params.sortBy = parseInt(params.sortBy) : params.sortBy = -1;
        matchCriteria.$match.$and.push({ 'status': 'active' });
        if (params && params.rating) {
            params.rating = params.rating.split(",");
            matchCriteria.$match.$and.push({ 'rating': { $in: await _services_1.toNumberString(params.rating) } });
        }
        if (params && params.propertyId) {
            matchCriteria.$match.$and.push({ propertyId: mongoose_1.Types.ObjectId(params.propertyId) });
        }
        if (params.startDate)
            matchCriteria.$match.$and.push({ 'createdAt': { $gte: new Date(params.startDate) } });
        if (params.endDate)
            matchCriteria.$match.$and.push({ 'createdAt': { $lte: new Date(params.endDate) } });
        if (params.isFeatured)
            matchCriteria.$match.$and.push({ 'isFeatured': params.isFeatured });
        pipeline.push(matchCriteria);
        pipeline.push({ $sort: { 'rating': params.sortBy, createdAt: params.sortBy } });
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
                "as": "booking"
            },
        }, {
            "$replaceRoot": { "newRoot": { "$mergeObjects": [{ "$arrayElemAt": ["$booking", 0] }, "$$ROOT"] } }
        }, {
            $sort: { createdAt: -1 }
        }, {
            "$project": {
                review: 1,
                rating: 1,
                isFeatured: 1,
                propertyId: 1,
                reply: { $ifNull: ['$reply', []] },
                'propertyName': '$propertyData.name',
                userData: { userId: '$userData.userId', name: '$userData.name', image: '$userData.image' },
                hostData: { userId: '$hostId', name: '$propertyData.hostName', image: '$propertyData.hostImage' },
                createdAt: 1,
                updatedAt: 1
            }
        });
        if (params.search)
            pipeline.push({ $match: { 'propertyName': { $regex: `.*${params.search}.*`, $options: "si" } } });
        let details = await exports.RatingV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 6, page: params.page });
        return details;
    }
    async getAdminRatingInfo(_a) {
        var params = __rest(_a, []);
        let pipeline = [];
        let matchCriteria = { $match: { $and: [] } };
        matchCriteria.$match.$and.push({ 'reviewData.status': 'active' });
        matchCriteria.$match.$and.push({ 'reviewData._id': mongoose_1.Types.ObjectId(params.ratingId) });
        pipeline.push(matchCriteria);
        pipeline.push({
            "$project": {
                _id: '$reviewData._id',
                review: '$reviewData.review',
                rating: '$reviewData.rating',
                propertyId: 1,
                isFeatured: '$reviewData.isFeatured',
                reply: { $ifNull: ['$reviewData.reply', []] },
                propertyName: '$propertyData.name',
                userData: { userId: '$userData.userId', name: '$userData.name', image: '$userData.image' },
                hostData: { userId: '$hostId', name: '$propertyData.hostName', image: '$propertyData.hostImage' },
                createdAt: '$reviewData.createdAt',
                updatedAt: '$reviewData.updatedAt',
            }
        });
        let details = await booking_v1_entity_1.BookingV1.basicAggregate(pipeline);
        return details[0];
    }
    async getRatingCount(payload) {
        let pipeline = [];
        let matchCriteria = [];
        matchCriteria.push({ 'status': 'active' });
        if (payload.fromDate)
            matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
        if (payload.toDate)
            matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
        pipeline.push({ $match: { $and: matchCriteria } });
        pipeline.push({ $group: { _id: null, couny: { $sum: 1 } } }, { $project: { _id: 0 } });
        let details = await exports.RatingV1.basicAggregate(pipeline);
        details && details.length > 0 ? details = details[0] : details = { count: 0 };
        return details === null || details === void 0 ? void 0 : details.count;
    }
}
exports.RatingV1 = new RatingEntity(reviews_model_1.default);
//# sourceMappingURL=rating.v1.entity.js.map