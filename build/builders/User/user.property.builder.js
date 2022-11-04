"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingData = exports.fetchPartnerProperties = exports.fetchHostpropertyDetails = exports.holidayListing = exports.floorDetails = exports.coworkerContactListing = exports.clientListing = exports.propertyAvergeRating = exports.favCity = exports.HolidaysProperty = exports.BookingListing = exports.BookingSummary = exports.BookingSummaryFilter = exports.calendarPipeline = exports.BookingFilter = exports.userFavFilter = exports.parentCategories = exports.propertyDetails = exports.userPropertyDetails = exports.PropertyDetails = exports.amenitiesList = exports.categoryList = exports.featuredAdminPropertyList = exports.featuredPropertyList = exports.cityPropertyDetails = exports.LocationList = exports.NearbyPropertyList = exports.SimilarPropertyListByRating = exports.SimilarPropertyList = exports.PropertyList = exports.partnerArray = exports.partnerListArray = exports.HolidaysPropertyList = void 0;
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const _services_1 = require("@services");
const _entity_1 = require("@entity");
exports.HolidaysPropertyList = async (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            holidays: {
                $elemMatch: {
                    $or: [
                        {
                            $and: [
                                {
                                    fromDate: {
                                        '$lte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, payload.offset)
                                    },
                                }, {
                                    toDate: {
                                        '$gte': _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.fromDate, payload.offset)
                                    }
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    fromDate: {
                                        '$lte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.toDate, payload.offset)
                                    },
                                },
                                {
                                    toDate: {
                                        '$gte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.toDate, payload.offset)
                                    },
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    fromDate: {
                                        '$gte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, payload.offset)
                                    },
                                },
                                {
                                    toDate: {
                                        '$lte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.toDate, payload.offset)
                                    },
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }, { $project: { _id: 1 } });
    let propertyData = await _entity_1.PropertyV1.basicAggregate(pipeline);
    let response = [];
    for (let i = 0; i < propertyData.length; i++)
        response.push(mongoose_1.Types.ObjectId(propertyData[i]._id));
    return response;
};
exports.partnerListArray = (payload) => {
    if (payload === null || payload === void 0 ? void 0 : payload.partnerAvailability) {
        return {
            '$lookup': {
                from: 'partners',
                let: {
                    propertyId: '$_id',
                    partnerId: payload.partnerArray
                },
                pipeline: [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$property._id',
                                            '$$propertyId'
                                        ]
                                    },
                                    {
                                        '$in': [
                                            '$_id',
                                            '$$partnerId'
                                        ]
                                    },
                                    {
                                        '$eq': [
                                            '$status',
                                            'active'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            name: 1,
                            email: 1,
                            image: 1
                        }
                    }
                ],
                as: 'partnerDetails'
            }
        };
    }
    else { }
};
exports.partnerArray = async (payload) => {
    var _a;
    if (payload === null || payload === void 0 ? void 0 : payload.userId) {
        let userDetails = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { partnerId: 1 });
        if (userDetails) {
            let partnerArray = [];
            (_a = userDetails === null || userDetails === void 0 ? void 0 : userDetails.partnerId) === null || _a === void 0 ? void 0 : _a.forEach((element) => {
                partnerArray.push(mongoose_1.Types.ObjectId(element));
            });
            payload['partnerAvailability'] = 1;
            payload['partnerArray'] = partnerArray;
            return payload;
        }
        else {
            payload['partnerAvailability'] = 0;
            return payload;
        }
    }
    else {
        payload['partnerAvailability'] = 0;
        return payload;
    }
};
exports.PropertyList = (payload) => {
    let pipeline = [];
    let radius = 100 * 1000;
    let bookingTypeFilterCondition = {};
    let filterConditions = { $match: { $and: [] } };
    let matchConditions = { $match: { $and: [] } };
    if (payload === null || payload === void 0 ? void 0 : payload.zoomLevel) {
        if (_services_1.isBetween(payload === null || payload === void 0 ? void 0 : payload.zoomLevel, 0, 6)) {
            radius = 2000 * 1000;
        }
        else if (_services_1.isBetween(payload === null || payload === void 0 ? void 0 : payload.zoomLevel, 7, 9)) {
            radius = 10000 * 1000;
        }
        else if (_services_1.isBetween(payload === null || payload === void 0 ? void 0 : payload.zoomLevel, 10, 11)) {
            radius = 500 * 1000;
        }
        else if (_services_1.isBetween(payload === null || payload === void 0 ? void 0 : payload.zoomLevel, 12, 13)) {
            radius = 300 * 1000;
        }
        else if (_services_1.isBetween(payload === null || payload === void 0 ? void 0 : payload.zoomLevel, 14, 16)) {
            radius = 80 * 1000;
        }
        else {
            radius = 80 * 1000;
        }
    }
    if (payload.lat && payload.long) {
        pipeline.push({
            "$geoNear": {
                "near": { "type": "Point", "coordinates": [Number(payload.long), Number(payload.lat)] },
                "maxDistance": radius,
                "spherical": true,
                "distanceField": "distance"
            }
        });
    }
    matchConditions = {
        '$match': {
            '$and': [
                {
                    '$or': [
                        {
                            status: 'active'
                        },
                        {
                            claimedStatus: false
                        }
                    ]
                }
            ]
        }
    };
    if (payload.cityArray) {
        matchConditions.$match.$and.push({ "city._id": { $in: payload.cityArray } });
    }
    pipeline.push(matchConditions);
    pipeline.push({
        '$lookup': {
            from: 'promotions',
            let: {
                propertyId: '$_id'
            },
            pipeline: [
                {
                    '$match': {
                        '$expr': {
                            '$and': [
                                {
                                    '$eq': [
                                        '$propertyId',
                                        '$$propertyId'
                                    ]
                                },
                                {
                                    '$eq': [
                                        '$promotionStatus',
                                        0
                                    ]
                                },
                                {
                                    '$eq': [
                                        '$listingType',
                                        1
                                    ]
                                }
                            ]
                        }
                    }
                },
                { $limit: 3 },
                { $project: { slotType: 1 } }
            ],
            as: 'promotions'
        }
    }, {
        $unwind: {
            path: "$promotions",
            preserveNullAndEmptyArrays: true
        }
    });
    if (payload === null || payload === void 0 ? void 0 : payload.bookingType) {
        switch (payload.bookingType) {
            case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                bookingTypeFilterCondition = {
                    $filter: {
                        input: "$spaceDetailsArray",
                        as: "space",
                        cond: { $eq: ["$$space.bookingType", _common_1.ENUM.USER.BOOKING_TYPE.HOURLY] }
                    }
                };
                break;
            case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                bookingTypeFilterCondition = {
                    $filter: {
                        input: "$spaceDetailsArray",
                        as: "space",
                        cond: { $eq: ["$$space.bookingType", _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY] }
                    }
                };
                break;
            case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                bookingTypeFilterCondition = {
                    $filter: {
                        input: "$spaceDetailsArray",
                        as: "space",
                        cond: { $eq: ["$$space.bookingType", _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM] }
                    }
                };
                break;
            case _common_1.ENUM.USER.BOOKING_TYPE.EMPLOYEE:
                bookingTypeFilterCondition = {
                    $filter: {
                        input: "$spaceDetailsArray",
                        as: "space",
                        cond: { $eq: ["$$space.isEmployee", true] }
                    }
                };
                break;
        }
    }
    if (!payload.partnerArray)
        payload.partnerArray = [];
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
                                { $eq: ["$status", 'active'] },
                                {
                                    $or: [
                                        {
                                            '$eq': [
                                                '$isEmployee',
                                                false
                                            ]
                                        }, {
                                            $in: [
                                                '$partnerId',
                                                payload.partnerArray
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                { $project: { "categoryName": "$category.name", units: 1, partnerId: 1, pricing: 1, "categoryId": "$category._id", "capacity": "$capacity", "subCategoryName": "$subCategory.name", bookingType: 1, isEmployee: 1 } }
            ],
            "as": "spaceDetailsArray"
        },
    }, {
        $project: {
            spaceDetails: (bookingTypeFilterCondition === null || bookingTypeFilterCondition === void 0 ? void 0 : bookingTypeFilterCondition.$filter) ? bookingTypeFilterCondition : 1,
            categoryDetails: "$spaceDetailsArray",
            isEmployeeFalseSpaces: {
                $filter: {
                    input: "$spaceDetailsArray",
                    as: "space",
                    cond: { $and: [{ $eq: ["$$space.isEmployee", false] }, {
                                '$eq': [
                                    '$$space.bookingType',
                                    payload === null || payload === void 0 ? void 0 : payload.bookingType
                                ]
                            }] }
                }
            },
            promotions: 1,
            _id: 1,
            name: 1,
            status: 1,
            userData: 1,
            tags: 1,
            builtUpArea: 1,
            address: 1,
            description: 1,
            rating: 1,
            city: 1,
            state: 1,
            country: 1,
            amenities: 1,
            startingPrice: 1,
            startingPriceType: 1,
            zipCode: 1,
            floor: 1,
            images: 1,
            partnerDetails: 1,
            location: 1,
            createdAt: 1,
            claimedStatus: 1,
            floorCorners: 1
        }
    });
    pipeline.push({
        "$addFields": {
            "exclude": {
                "$map": {
                    "input": "$categoryDetails",
                    "as": "el",
                    "in": "$$el.categoryName"
                }
            }
        }
    });
    filterConditions.$match.$and.push({
        $or: [
            { spaceDetails: { '$ne': [] } },
            { "claimedStatus": false }
        ]
    });
    pipeline.push({
        "$lookup": {
            "from": "favourite",
            "let": {
                "propertyId": "$_id"
            },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            {
                                $expr: {
                                    $eq: [
                                        '$userId',
                                        mongoose_1.Types.ObjectId(payload.userId)
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $eq: [
                                        '$property._id',
                                        "$$propertyId"
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "as": "favData"
        }
    });
    if (payload.userId && payload.partnerArray) {
        pipeline.push({
            '$lookup': {
                from: 'partners',
                let: {
                    propertyId: '$_id',
                    partnerId: payload.partnerArray
                },
                pipeline: [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$property._id',
                                            '$$propertyId'
                                        ]
                                    },
                                    {
                                        '$in': [
                                            '$_id',
                                            '$$partnerId'
                                        ]
                                    },
                                    {
                                        '$eq': [
                                            '$status',
                                            'active'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            name: 1,
                            email: 1,
                            image: 1
                        }
                    }
                ],
                as: 'partnerDetails'
            }
        });
    }
    if (payload.categoryArray) {
        filterConditions.$match.$and.push({ _id: { $in: payload.categoryArray } });
    }
    if (payload.subCategoryArray) {
        filterConditions.$match.$and.push({ _id: { $in: payload.subCategoryArray } });
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.autoAcceptUpcomingBooking) == false || (payload === null || payload === void 0 ? void 0 : payload.autoAcceptUpcomingBooking) == true) {
        filterConditions.$match.$and.push({ autoAcceptUpcomingBooking: payload.autoAcceptUpcomingBooking });
    }
    if (payload.amenitiesArray) {
        filterConditions.$match.$and.push({ "amenities": { $elemMatch: { amenityId: { $in: payload.amenitiesArray }, status: _common_1.ENUM.USER.STATUS.ACTIVE } } });
    }
    if (payload.minimumFloor)
        filterConditions.$match.$and.push({ floor: { $gte: payload.minimumFloor } });
    if (payload.maximumFloor)
        filterConditions.$match.$and.push({ floor: { $lte: payload.maximumFloor } });
    if (payload.minimumArea)
        filterConditions.$match.$and.push({ builtUpArea: { $gte: payload.minimumArea } });
    if (payload.maximumArea)
        filterConditions.$match.$and.push({ builtUpArea: { $lte: payload.maximumArea } });
    if (payload.minCapacity)
        filterConditions.$match.$and.push({ "spaceDetails.capacity": { $gte: payload.minCapacity } });
    if (payload.maxCapacity)
        filterConditions.$match.$and.push({ "spaceDetails.capacity": { $lte: payload.maxCapacity } });
    if (payload.minPrice)
        filterConditions.$match.$and.push({ "spaceDetails.pricing.monthly": { $gte: payload.minPrice } });
    if (payload.maxPrice)
        filterConditions.$match.$and.push({ "spaceDetails.pricing.monthly": { $lte: payload.maxPrice } });
    if (payload.zipCode) {
        filterConditions.$match.$and.push({ "zipCode": payload.zipCode });
    }
    if (filterConditions.$match.$and.length)
        pipeline.push(filterConditions);
    if (payload.sortKey) {
        if (payload.sortKey == "name")
            pipeline.push({ $sort: { name: 1 } });
        if (payload.sortKey == "createdAt")
            pipeline.push({ $sort: { createdAt: -1 } });
        if (payload.sortKey == "price")
            pipeline.push({ $sort: { startingPrice: payload.sortOrder } });
        if (payload.sortKey == "avgRating")
            pipeline.push({ $sort: { "rating.avgRating": payload.sortOrder } });
    }
    if (payload.userId && payload.partnerArray) {
        pipeline.push({
            '$redact': {
                '$cond': {
                    if: {
                        '$and': [
                            {
                                '$gt': [
                                    {
                                        '$size': '$partnerDetails'
                                    },
                                    0
                                ]
                            },
                            {
                                '$eq': [
                                    {
                                        '$size': '$spaceDetails'
                                    }, {
                                        '$size': '$isEmployeeFalseSpaces'
                                    }
                                ]
                            }
                        ]
                    },
                    then: '$$PRUNE',
                    else: '$$KEEP'
                }
            }
        });
    }
    pipeline.push({
        '$project': {
            promotions: 1,
            _id: 1,
            name: 1,
            status: 1,
            userData: 1,
            tags: 1,
            builtUpArea: 1,
            address: 1,
            description: 1,
            rating: 1,
            countryName: '$country.name',
            stateName: '$state.name',
            cityName: '$city.cityName',
            amenities: _common_1.AmenityFilter,
            startingPrice: 1,
            startingPriceType: 1,
            zipCode: 1,
            floor: 1,
            claimedStatus: 1,
            images: 1,
            spaceDetails: 1,
            partnerDetails: 1,
            unavailable: {
                $cond: { if: { $in: ["$_id", payload.holidayProperties] }, then: true, else: false }
            },
            floorCorners: 1,
            isFavourite: {
                $cond: {
                    if: {
                        $size: '$favData'
                    },
                    then: 1,
                    else: 0
                }
            },
            location: '$location.coordinates',
            "categoryList": { "$setUnion": ["$exclude", []] }
        }
    }, { $sort: { "promotions.slotType": -1 } });
    return pipeline;
};
exports.SimilarPropertyList = (payload) => {
    let pipeline = [];
    pipeline.push({
        "$geoNear": {
            "near": { "type": "Point", "coordinates": [Number(payload.long), Number(payload.lat)] },
            "maxDistance": 100000,
            "spherical": true,
            "distanceField": "distance"
        }
    }, {
        $match: {
            "status": 'active',
            _id: {
                $nin: payload.pipe
            }
        }
    }, {
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
                { $project: { "categoryName": "$category.name", partnerId: 1, bookingType: 1, units: 1, "categoryId": "$category._id", pricing: 1, "capacity": "$capacity", "subCategoryName": "$subCategory.name" } }
            ],
            "as": "spaceDetails"
        }
    }, { $match: { 'spaceDetails': { $ne: [] }, "spaceDetails.categoryId": { $in: payload.categoryArray } } }, {
        "$lookup": {
            "from": "favourite",
            "let": {
                "propertyId": "$_id"
            },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            {
                                $expr: {
                                    $eq: [
                                        '$userId',
                                        mongoose_1.Types.ObjectId(payload.userId)
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $eq: [
                                        '$property._id',
                                        "$$propertyId"
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "as": "favData"
        }
    }, {
        "$addFields": {
            "exclude": {
                "$map": {
                    "input": "$spaceDetails",
                    "as": "el",
                    "in": "$$el.categoryName"
                }
            }
        }
    }, {
        '$lookup': {
            from: 'promotions',
            let: {
                propertyId: '$_id'
            },
            pipeline: [
                {
                    '$match': {
                        '$expr': {
                            '$and': [
                                {
                                    '$eq': [
                                        '$propertyId',
                                        '$$propertyId'
                                    ]
                                },
                                {
                                    '$eq': [
                                        '$promotionStatus',
                                        _common_1.ENUM.PROPERTY.PROMOTION_STATUS.ONGOING
                                    ]
                                },
                                {
                                    '$eq': [
                                        '$listingType',
                                        _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME
                                    ]
                                }
                            ]
                        }
                    }
                },
                { $project: { slotType: 1 } }
            ],
            as: 'promotions'
        }
    }, {
        $unwind: {
            path: "$promotions",
            preserveNullAndEmptyArrays: true
        }
    }, {
        '$match': {
            promotions: {
                '$exists': true
            }
        }
    });
    if ((payload === null || payload === void 0 ? void 0 : payload.userId) && (payload === null || payload === void 0 ? void 0 : payload.partnerAvailability)) {
        pipeline.push(exports.partnerListArray(payload));
    }
    pipeline.push({
        '$project': {
            promotions: 1,
            _id: 1,
            name: 1,
            status: 1,
            userData: 1,
            tags: 1,
            builtUpArea: 1,
            address: 1,
            description: 1,
            rating: 1,
            countryName: '$country.name',
            stateName: '$state.name',
            cityName: '$city.cityName',
            startingPrice: 1,
            startingPriceType: 1,
            bookingType: 1,
            zipCode: 1,
            floor: 1,
            images: 1,
            spaceDetails: 1,
            location: '$location.coordinates',
            isFavourite: {
                $cond: {
                    if: {
                        $size: '$favData'
                    },
                    then: 1,
                    else: 0
                }
            },
            "categoryList": { "$setUnion": ["$exclude", []] },
            sort: {
                $cond: {
                    if: {
                        $gte: ["$rating.avgRating", 0]
                    },
                    then: "$rating.avgRating",
                    else: "$createdAt"
                }
            }
        }
    }, {
        $sort: {
            sort: -1
        }
    }, { $limit: 20 });
    return pipeline;
};
exports.SimilarPropertyListByRating = (payload) => {
    let pipeline = [];
    pipeline.push({
        "$geoNear": {
            "near": { "type": "Point", "coordinates": [Number(payload.long), Number(payload.lat)] },
            "maxDistance": 100000,
            "spherical": true,
            "distanceField": "distance"
        }
    }, {
        $match: {
            "status": 'active', _id: {
                $nin: payload.pipe
            }
        }
    }, {
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
                { $project: { "categoryName": "$category.name", partnerId: 1, bookingType: 1, units: 1, "categoryId": "$category._id", pricing: 1, "capacity": "$capacity", "subCategoryName": "$subCategory.name" } }
            ],
            "as": "spaceDetails"
        }
    }, {
        $match: {
            'spaceDetails': { $ne: [] },
        }
    }, {
        "$lookup": {
            "from": "favourite",
            "let": {
                "propertyId": "$_id"
            },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            {
                                $expr: {
                                    $eq: [
                                        '$userId',
                                        mongoose_1.Types.ObjectId(payload.userId)
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $eq: [
                                        '$property._id',
                                        "$$propertyId"
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "as": "favData"
        }
    }, {
        "$addFields": {
            "exclude": {
                "$map": {
                    "input": "$spaceDetails",
                    "as": "el",
                    "in": "$$el.categoryName"
                }
            }
        }
    });
    if ((payload === null || payload === void 0 ? void 0 : payload.userId) && (payload === null || payload === void 0 ? void 0 : payload.partnerAvailability)) {
        pipeline.push(exports.partnerListArray(payload));
    }
    pipeline.push({
        '$project': {
            _id: 1,
            partnerDetails: 1,
            name: 1,
            status: 1,
            userData: 1,
            tags: 1,
            builtUpArea: 1,
            address: 1,
            description: 1,
            rating: 1,
            countryName: '$country.name',
            stateName: '$state.name',
            cityName: '$city.cityName',
            startingPrice: 1,
            startingPriceType: 1,
            zipCode: 1,
            floor: 1,
            images: 1,
            spaceDetails: 1,
            isFavourite: {
                $cond: {
                    if: {
                        $size: '$favData'
                    },
                    then: 1,
                    else: 0
                }
            },
            location: '$location.coordinates',
            "categoryList": { "$setUnion": ["$exclude", []] },
            sort: {
                $cond: {
                    if: {
                        $gte: ["$rating.avgRating", 0]
                    },
                    then: "$rating.avgRating",
                    else: "$createdAt"
                }
            }
        }
    }, {
        $sort: {
            sort: -1
        }
    }, { $limit: 20 });
    return pipeline;
};
exports.NearbyPropertyList = (payload) => {
    let pipeline = [];
    let filterConditions = { $match: { $and: [] } };
    if (payload.lat && payload.long) {
        pipeline.push({
            "$geoNear": {
                "near": { "type": "Point", "coordinates": [Number(payload.long), Number(payload.lat)] },
                "maxDistance": 100000,
                "spherical": true,
                "distanceField": "distance"
            }
        });
    }
    pipeline.push({
        $match: { "status": _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
    }, {
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
                { $project: { "categoryName": "$category.name", pricing: 1, "capacity": "$capacity", "subCategoryName": "$subCategory.name" } }
            ],
            "as": "spaceDetails"
        }
    });
    filterConditions.$match.$and.push({ 'spaceDetails': { $ne: [] } });
    pipeline.push({
        "$lookup": {
            "from": "favourite",
            "let": {
                "propertyId": "$_id"
            },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            {
                                $expr: {
                                    $eq: [
                                        '$userId',
                                        mongoose_1.Types.ObjectId(payload.userId)
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $eq: [
                                        '$property._id',
                                        "$$propertyId"
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "as": "favData"
        }
    });
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({
        '$project': {
            _id: 1,
            name: 1,
            status: 1,
            userData: 1,
            tags: 1,
            builtUpArea: 1,
            address: 1,
            description: 1,
            rating: 1,
            countryName: '$country.name',
            stateName: '$state.name',
            cityName: '$city.cityName',
            amenities: _common_1.AmenityFilter,
            startingPrice: 1,
            startingPriceType: 1,
            zipCode: 1,
            floor: 1,
            images: 1,
            spaceDetails: 1,
            isFavourite: {
                $cond: {
                    if: {
                        $size: '$favData'
                    },
                    then: 1,
                    else: 0
                }
            },
            location: '$location.coordinates'
        }
    });
    return pipeline;
};
exports.LocationList = (payload) => {
    let pipeline = [];
    let matchconditions = [];
    if (payload.keyword) {
        const pattern = {
            $regex: new RegExp(`.*${payload.keyword}.*`, `i`)
        };
        matchconditions.push({ cityName: pattern });
    }
    pipeline.push({ $sort: { createdAt: 1 } });
    if (matchconditions.length)
        pipeline.push({ $match: { $or: matchconditions } });
    pipeline.push({ $sort: { "updatedAt": -1 } });
    return pipeline;
};
exports.cityPropertyDetails = (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            $or: [
                {
                    status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE,
                },
                {
                    claimedStatus: _common_1.ENUM.PROPERTY.CLAIMED_STATUS.FALSE
                }
            ],
            "city.cityName": { $exists: true },
            _id: {
                $nin: payload.pipe
            }
        }
    }, {
        $group: {
            _id: '$city._id',
            propertyCount: { $sum: 1 },
            avgRating: { $avg: "$rating.avgRating" },
            cityDetail: { $first: "$city" }
        }
    }, { $match: { 'cityDetail.isFeatured': true } });
    return pipeline;
};
exports.featuredPropertyList = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { "status": _common_1.ENUM.PROPERTY.STATUS.ACTIVE } }, {
        '$lookup': {
            from: 'promotions',
            let: {
                propertyId: '$_id'
            },
            pipeline: [
                {
                    '$match': {
                        '$expr': {
                            '$and': [
                                {
                                    '$eq': [
                                        '$propertyId',
                                        '$$propertyId'
                                    ]
                                },
                                {
                                    '$eq': [
                                        '$promotionStatus',
                                        _common_1.ENUM.PROPERTY.PROMOTION_STATUS.ONGOING
                                    ]
                                },
                                {
                                    '$eq': [
                                        '$listingType',
                                        _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME
                                    ]
                                }
                            ]
                        }
                    }
                },
                { $project: { slotType: 1 } }
            ],
            as: 'promotions'
        }
    }, {
        $unwind: {
            path: "$promotions",
            preserveNullAndEmptyArrays: true
        }
    }, {
        '$match': {
            promotions: {
                '$exists': true
            }
        }
    }, {
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
                }
            ],
            "as": "spaceDetails"
        }
    }, { $match: { spaceDetails: { $ne: [] } } });
    if ((payload === null || payload === void 0 ? void 0 : payload.userId) && (payload === null || payload === void 0 ? void 0 : payload.partnerAvailability)) {
        pipeline.push(exports.partnerListArray(payload));
    }
    pipeline.push({ $sort: { "promotions.slotType": -1 } });
    return pipeline;
};
exports.featuredAdminPropertyList = (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            $or: [
                {
                    status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE,
                },
                {
                    claimedStatus: _common_1.ENUM.PROPERTY.CLAIMED_STATUS.FALSE
                }
            ],
            isFeaturedProperty: _common_1.ENUM.BOOLEAN.TRUE,
            _id: {
                $nin: payload.pipe
            }
        }
    }, {
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
                }
            ],
            "as": "spaceDetails"
        }
    }, { $match: { spaceDetails: { $ne: [] } } });
    if ((payload === null || payload === void 0 ? void 0 : payload.userId) && (payload === null || payload === void 0 ? void 0 : payload.partnerAvailability)) {
        pipeline.push(exports.partnerListArray(payload));
    }
    return pipeline;
};
exports.categoryList = () => {
    let pipeline = [];
    let matchconditions = {};
    matchconditions['status'] = _common_1.DATABASE.ACTIVE;
    matchconditions['parentId'] = { $exists: false };
    pipeline.push({ $match: matchconditions }, {
        $project: {
            _id: 1,
            categoryName: '$name'
        }
    }, {
        "$lookup": {
            "from": "categories",
            "let": { "category": "$_id" },
            "pipeline": [
                {
                    "$match": {
                        "$expr": {
                            "$eq": ["$parentId", "$$category"]
                        }
                    }
                },
                {
                    "$project": {
                        name: 1,
                        iconImage: {
                            $ifNull: ["$iconImage", " "]
                        }
                    }
                }
            ],
            "as": "subCategoryData"
        }
    }, { $match: { "subCategoryData": { $ne: [] } } });
    return pipeline;
};
exports.amenitiesList = (propertyId) => {
    let pipeline = [];
    let matchconditions = {};
    matchconditions['status'] = _common_1.DATABASE.ACTIVE;
    pipeline.push({ $match: matchconditions }, {
        $group: {
            _id: '$type',
            amentiesData: {
                $push: {
                    name: '$name',
                    _id: '$_id',
                    iconImage: '$iconImage',
                    isFeatured: '$isFeatured'
                }
            }
        }
    });
    return pipeline;
};
exports.PropertyDetails = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(id) } });
    pipeline.push({
        "$lookup": {
            "from": "propertySpace",
            "let": { "propertyId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$propertyId', '$$propertyId'] } },
                            { $expr: { $ne: ["$status", _common_1.ENUM.PROPERTY.STATUS.ISDELETE] } }
                        ]
                    }
                },
                {
                    "$lookup": {
                        "from": "offers",
                        "let": { "spaceId": "$_id" },
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": {
                                        "$eq": [["$$spaceId"], "$spaceId"]
                                    }
                                }
                            },
                            { $project: { status: 0, createdAt: 0, updatedAt: 0 } }
                        ],
                        "as": "offerPrice"
                    }
                },
                {
                    '$group': {
                        _id: {
                            "floorNumber": "$floorNumber",
                            "_id": "$category._id"
                        },
                        floorImage: {
                            $first: "$floorImage"
                        },
                        categoryDetail: {
                            '$push': {
                                category: '$category',
                                status: '$status',
                                floorDescription: '$floorDescription',
                                floorId: '$_id',
                                floorLabel: '$floorLabel',
                                price: '$capacity',
                                units: '$units',
                                endDate: '$endDate',
                                isOfferPrice: '$isOfferPrice',
                                subCategory: '$subCategory',
                                pricing: '$pricing',
                                include: '$include',
                                offerPrice: '$offerPrice',
                                capacity: '$capacity',
                                totalCapacity: '$totalCapacityBySeats',
                                position: '$position',
                                isEmployee: '$isEmployee',
                                bookingType: '$bookingType',
                                gridRow: '$gridRow',
                                gridColumn: '$gridColumn',
                                spaceLabel: "$spaceLabel",
                                floorNumber: '$floorNumber'
                            }
                        }
                    }
                },
                {
                    '$group': {
                        _id: {
                            "floorNumber": "$_id.floorNumber"
                        },
                        floorImage: {
                            $first: "$floorImage"
                        },
                        categoryDetails: {
                            '$push': {
                                categoryData: '$categoryDetail'
                            }
                        }
                    }
                }
            ],
            "as": "spaceDetails"
        }
    });
    pipeline.push({
        '$project': {
            _id: 1,
            name: 1,
            status: 1,
            shareUrl: 1,
            isLike: 1,
            fbUrl: 1,
            twitterUrl: 1,
            instaUrl: 1,
            linkedinUrl: 1,
            userData: 1,
            description: 1,
            rating: 1,
            city: 1,
            state: 1,
            country: 1,
            claimedStatus: 1,
            location: '$location.coordinates',
            floor: 1,
            images: 1,
            spaceDetails: 1,
            address: 1,
            amenities: 1,
            totalCapacity: 1,
            zipCode: 1,
            heading: 1,
            autoAcceptUpcomingBooking: 1,
            startingPrice: 1,
            startingPriceType: 1,
            tags: 1,
            termsAndCond: 1,
            cityId: '$city._id',
            propertyType: 1,
            addressPrimary: 1,
            addressSecondary: 1,
            stepNumber: 1,
            floorCorners: 1
        }
    });
    return pipeline;
};
exports.userPropertyDetails = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.propertyId), $or: [{ "status": 'active' }, { "claimedStatus": false }] } });
    pipeline.push({
        "$lookup": {
            "from": "favourite",
            "let": {
                "propertyId": "$_id"
            },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            {
                                $expr: {
                                    $eq: [
                                        '$userId',
                                        mongoose_1.Types.ObjectId(payload.userId)
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $eq: [
                                        '$property._id',
                                        "$$propertyId"
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "as": "favData"
        }
    });
    pipeline.push({
        '$project': {
            _id: 1,
            stepNumber: 1,
            claimedStatus: 1,
            name: 1,
            status: 1,
            termsAndCond: 1,
            shareUrl: 1,
            userData: 1,
            builtUpArea: 1,
            description: 1,
            rating: 1,
            countryId: '$country.id',
            countryName: '$country.name',
            stateId: '$state.id',
            stateName: '$state.name',
            location: '$location.coordinates',
            floor: 1,
            images: 1,
            spaceDetails: 1,
            address: 1,
            amenities: _common_1.AmenityFilter,
            totalCapacity: 1,
            houseNo: 1,
            street: 1,
            zipCode: 1,
            landmark: 1,
            heading: 1,
            autoAcceptUpcomingBooking: 1,
            startingPrice: 1,
            startingPriceType: 1,
            tags: 1,
            cityId: '$city._id',
            fbUrl: 1,
            instaUrl: 1,
            twitterUrl: 1,
            linkedinUrl: 1,
            slackUrl: 1,
            youtubeUrl: 1,
            propertyType: 1,
            totalFloorCount: 1,
            floorCorners: 1,
            isFavourite: {
                $cond: {
                    if: {
                        $size: '$favData'
                    },
                    then: 1,
                    else: 0
                }
            }
        }
    });
    return pipeline;
};
exports.propertyDetails = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.id), status: _common_1.ENUM.USER.STATUS.ACTIVE } });
    pipeline.push({
        "$lookup": {
            "from": "favourite",
            "let": {
                "propertyId": "$_id"
            },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            {
                                $expr: {
                                    $eq: [
                                        '$userId',
                                        mongoose_1.Types.ObjectId(payload.userId)
                                    ]
                                }
                            },
                            {
                                $expr: {
                                    $eq: [
                                        '$property._id',
                                        "$$propertyId"
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "as": "favData"
        }
    });
    pipeline.push({
        '$project': {
            _id: 1,
            stepNumber: 1,
            name: 1,
            status: 1,
            termsAndCond: 1,
            shareUrl: 1,
            userData: 1,
            builtUpArea: 1,
            claimedStatus: true,
            description: 1,
            rating: 1,
            countryId: '$country.id',
            countryName: '$country.name',
            stateId: '$state.id',
            stateName: '$state.name',
            location: '$location.coordinates',
            floor: 1,
            images: 1,
            spaceDetails: 1,
            address: 1,
            amenities: _common_1.AmenityFilter,
            totalCapacity: 1,
            houseNo: 1,
            street: 1,
            zipCode: 1,
            landmark: 1,
            heading: 1,
            autoAcceptUpcomingBooking: 1,
            startingPrice: 1,
            startingPriceType: 1,
            tags: 1,
            cityId: '$city._id',
            fbUrl: 1,
            instaUrl: 1,
            twitterUrl: 1,
            linkedinUrl: 1,
            slackUrl: 1,
            youtubeUrl: 1,
            isFavourite: {
                $cond: {
                    if: {
                        $size: '$favData'
                    },
                    then: 1,
                    else: 0
                }
            },
            floorCorners: 1
        }
    });
    return pipeline;
};
exports.parentCategories = () => {
    let pipeline = [];
    pipeline.push({ $match: { "status": 'active' } });
    pipeline.push({
        "$lookup": {
            "from": "categories",
            "let": { "category": "$_id" },
            "pipeline": [
                {
                    "$match": {
                        $and: [
                            {
                                "$expr": {
                                    "$eq": ["$parentId", "$$category"]
                                }
                            },
                            { $expr: { $eq: ["$status", 'active'] } }
                        ]
                    }
                },
                {
                    "$project": {
                        name: 1
                    }
                }
            ],
            "as": "subCategoryData"
        }
    }, { $match: { "subCategoryData": { $ne: [] } } });
    return pipeline;
};
exports.userFavFilter = (payload, userId) => {
    let pipeline = [];
    let matchCriteria = { "$match": { "$and": [] } };
    if (!payload.partnerArray)
        payload.partnerArray = [];
    switch (payload.bookingStatus) {
        case _common_1.CONSTANT.FAV_BOOKING_ACTION.PREVIOUS:
            matchCriteria['$match']['$and'].push({ "property.isBooked": true });
            break;
        case _common_1.CONSTANT.FAV_BOOKING_ACTION.NEVER:
            matchCriteria['$match']['$and'].push({ "property.isBooked": false });
            break;
    }
    matchCriteria['$match']['$and'].push({ "userId": mongoose_1.Types.ObjectId(userId) });
    matchCriteria['$match']['$and'].push({
        'property.status': {
            '$in': [
                'active',
                'draft'
            ]
        }
    });
    pipeline.push({
        '$lookup': {
            from: 'properties',
            let: {
                propertyId: '$property._id'
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
                            },
                            {
                                '$or': [
                                    {
                                        '$expr': {
                                            '$eq': [
                                                '$status',
                                                'active'
                                            ]
                                        }
                                    },
                                    {
                                        '$expr': {
                                            '$eq': [
                                                '$claimedStatus',
                                                false
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "$lookup": {
                        "from": "propertySpace",
                        "let": { "propertyId": "$_id" },
                        "pipeline": [
                            { "$match": {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$propertyId', '$$propertyId'] },
                                            { $eq: ["$status", 'active'] },
                                            {
                                                $or: [
                                                    {
                                                        '$eq': [
                                                            '$isEmployee',
                                                            false
                                                        ]
                                                    },
                                                    {
                                                        $in: [
                                                            '$partnerId',
                                                            payload === null || payload === void 0 ? void 0 : payload.partnerArray
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                } }
                        ],
                        "as": "propertySpaceData"
                    }
                },
                { $match: { propertySpaceData: { $ne: [] } } },
                {
                    "$project": {
                        location: 1,
                        propertySpaceData: 1,
                        claimedStatus: 1,
                        bookingType: 1,
                        startingPriceType: 1
                    }
                }
            ],
            as: 'spaceD'
        }
    });
    pipeline.push({ $unwind: '$spaceD' });
    if (payload.cityId)
        matchCriteria['$match']['$and'].push({ 'property.city._id': mongoose_1.Types.ObjectId(payload.cityId) });
    if (payload.stateId)
        matchCriteria['$match']['$and'].push({ 'property.state.id': parseInt(payload.stateId) });
    if (payload.countryId)
        matchCriteria['$match']['$and'].push({ 'property.country.id': parseInt(payload.countryId) });
    pipeline.push(matchCriteria);
    pipeline.push({
        "$lookup": {
            "from": "categories",
            "let": { "category": "$_id" },
            "pipeline": [
                {
                    "$match": {
                        "$expr": {
                            "$eq": ["$parentId", "$$category"]
                        }
                    }
                },
                {
                    "$project": {
                        name: 1,
                        iconImage: { $ifNull: ["$iconImage", " "] }
                    }
                }
            ],
            "as": "subCategoryData"
        }
    });
    if (userId && payload.partnerArray) {
        pipeline.push({
            '$lookup': {
                from: 'partners',
                let: {
                    propertyId: '$property._id',
                    partnerId: payload.partnerArray
                },
                pipeline: [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$property._id',
                                            '$$propertyId'
                                        ]
                                    },
                                    {
                                        '$in': [
                                            '$_id',
                                            '$$partnerId'
                                        ]
                                    },
                                    {
                                        '$eq': [
                                            '$status',
                                            'active'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            name: 1,
                            email: 1,
                            image: 1
                        }
                    }
                ],
                as: 'partnerDetails'
            }
        });
    }
    pipeline.push({ $sort: { createdAt: -1 } });
    return pipeline;
};
exports.BookingFilter = (payload) => {
    let pipeline = [];
    let propertyArray = [];
    let subCategoryArray = [];
    let categoryArray = [];
    let bookingArray = [];
    let cityArray = [];
    let sortOrder = -1;
    let filterConditions = { $match: { $and: [] } };
    let searchConditions = { $match: { $or: [] } };
    switch (payload.type) {
        case _common_1.CONSTANT.BOOKING.REQUEST:
            filterConditions.$match.$and.push({
                'propertyData.autoAcceptUpcomingBooking': false,
                bookingStatus: _common_1.ENUM.BOOKING.STATUS.PENDING,
            });
            break;
        case _common_1.CONSTANT.BOOKING.REJECTED:
            filterConditions.$match.$and.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.REJECTED });
            break;
        case _common_1.CONSTANT.BOOKING.OFFLINE:
            filterConditions.$match.$and.push({ bookingMode: _common_1.ENUM.BOOKING_MODE.STATUS.OFFLINE });
            break;
        case _common_1.CONSTANT.BOOKING.ONGOING:
            filterConditions.$match.$and.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.ONGOING });
            break;
        case _common_1.CONSTANT.BOOKING.HISTORY:
            filterConditions.$match.$and.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.COMPLETED });
            break;
        case _common_1.CONSTANT.BOOKING.ACCEPTED:
            filterConditions.$match.$and.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.UPCOMING });
            break;
        case _common_1.CONSTANT.BOOKING.UPCOMING:
            filterConditions.$match.$and.push({ bookingStatus: _common_1.ENUM.BOOKING.STATUS.UPCOMING });
            break;
        case _common_1.CONSTANT.BOOKING.ALL:
            filterConditions.$match.$and.push({ bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED } });
            break;
    }
    if (payload.userData.isCohost)
        filterConditions.$match.$and.push({ hostId: payload.userData.hostId, status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } });
    else
        filterConditions.$match.$and.push({ hostId: payload.userId, status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } });
    if (payload.search) {
        searchConditions.$match.$or.push({ bookingId: { $regex: payload.search, $options: "si" } }, { "propertyData.name": { $regex: payload.search, $options: "si" } }, { "userData.name": { $regex: payload.search, $options: "si" } });
        pipeline.push(searchConditions);
    }
    if (payload.propertyIds) {
        propertyArray = payload.propertyIds.split(",");
        for (let i = 0; i < propertyArray.length; i++) {
            propertyArray[i] = mongoose_1.Types.ObjectId(propertyArray[i]);
        }
        filterConditions.$match.$and.push({ 'propertyData.propertyId': { $in: propertyArray } });
    }
    pipeline.push(filterConditions);
    if (payload.userData.isCohost && payload.userData.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
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
    }
    else if (payload.userData.isCohost) {
        pipeline.push({
            "$lookup": {
                "from": "properties",
                "let": { "propertyId": "$propertyData.propertyId" },
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
                "let": { "propertyId": "$propertyData.propertyId" },
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
    }
    let matchCriteria = [];
    if (payload.status) {
        bookingArray = payload.status.split(",");
        for (let i = 0; i < bookingArray.length; i++) {
            bookingArray[i] = parseInt(bookingArray[i]);
        }
        matchCriteria.push({ 'bookingStatus': { $in: bookingArray } });
    }
    if (payload.mode)
        matchCriteria.push({ 'bookingMode': parseInt(payload.mode) });
    if (payload.categoryId) {
        let catArrayObjectId = [];
        categoryArray = payload.categoryId.split(",");
        for (let i = 0; i < categoryArray.length; i++) {
            categoryArray[i] = categoryArray[i], catArrayObjectId.push(mongoose_1.Types.ObjectId(categoryArray[i]));
        }
        ;
        matchCriteria.push({ $or: [{ 'category._id': { $in: categoryArray } }, { 'category._id': { $in: catArrayObjectId } }] });
    }
    if (payload.subCategoryIds) {
        let catArrayObjectId = [];
        subCategoryArray = payload.subCategoryIds.split(",");
        for (let i = 0; i < subCategoryArray.length; i++) {
            subCategoryArray[i] = subCategoryArray[i], catArrayObjectId.push(mongoose_1.Types.ObjectId(subCategoryArray[i]));
        }
        ;
        matchCriteria.push({ $or: [{ 'subCategory._id': { $in: subCategoryArray } }, { 'subCategory._id': { $in: catArrayObjectId } }] });
    }
    if (payload.status) {
        matchCriteria.push({ 'bookingStatus': parseInt(payload.status) });
    }
    if (payload.fromDate) {
        matchCriteria.push({ fromDate: { '$gte': moment_1.default(payload.fromDate).startOf('day').toDate() } });
    }
    if (payload.toDate)
        matchCriteria.push({ toDate: { $lte: moment_1.default(payload.toDate).endOf('day').toDate() } });
    payload && payload.limit ? payload.limit = payload.limit : payload.limit = 10;
    if (payload.cityId) {
        let catArrayObjectId = [];
        cityArray = payload.cityId.split(",");
        for (let i = 0; i < cityArray.length; i++) {
            cityArray[i] = cityArray[i], catArrayObjectId.push(mongoose_1.Types.ObjectId(subCategoryArray[i]));
        }
        matchCriteria.push({ $or: [{ "property.city._id": { $in: cityArray } }, { 'property.city._id': { $in: catArrayObjectId } }] });
    }
    if (payload.stateId)
        matchCriteria.push({ 'property.state.id': parseInt(payload.stateId) });
    if (payload.countryId)
        matchCriteria.push({ 'property.country.id': parseInt(payload.countryId) });
    switch (payload.autoAcceptUpcomingBooking) {
        case _common_1.CONSTANT.BOOKING_HOST_SORT.AUTO:
            matchCriteria.push({ "propertyData.autoAcceptUpcomingBooking": true });
            break;
        case _common_1.CONSTANT.BOOKING_HOST_SORT.MANUAL:
            matchCriteria.push({ "propertyData.autoAcceptUpcomingBooking": false });
            break;
        default:
            break;
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        '$group': {
            _id: '$_id',
            propertyData: { $first: '$propertyData' },
            bookingStatus: { $first: '$bookingStatus' },
            bookingMode: { $first: '$bookingMode' },
            timing: { $first: '$timing' },
            categoryData: { $first: { category: '$category', pricing: '$pricing', subCategory: '$subCategory' } },
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
            cartInfo: { $first: '$cartInfo' }
        }
    });
    pipeline.push({ $sort: { createdAt: sortOrder } });
    return pipeline;
};
exports.calendarPipeline = (payload) => {
    let pipeline = [];
    let categoryArray = [];
    let subCategoryArray = [];
    payload.bookingMode <= 1 ? pipeline.push({ $match: { "bookingDetails.bookingMode": payload.bookingMode } }) : delete payload.bookingMode;
    pipeline.push({
        '$match': {
            hostId: mongoose_1.Types.ObjectId(payload.userId),
            "propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
            bookingDetails: {
                $elemMatch: {
                    bookingStatus: {
                        '$nin': [
                            _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED,
                            _common_1.ENUM.BOOKING.STATUS.PENDING
                        ]
                    }
                }
            },
        }
    }, {
        $project: {
            date: 1,
            bookingDetails: 1,
            completedBookings: {
                $size: {
                    $filter: {
                        input: "$bookingDetails",
                        as: "booking",
                        cond: {
                            $eq: [
                                "$$booking.bookingStatus",
                                1
                            ]
                        }
                    }
                }
            }
        }
    });
    let matchCriteria = [];
    if (payload.categoryIds) {
        categoryArray = payload.categoryIds.split(",");
        for (let i = 0; i < categoryArray.length; i++) {
            categoryArray[i] = mongoose_1.Types.ObjectId(categoryArray[i]);
        }
        matchCriteria.push({ 'bookingDetails.category._id': { $in: categoryArray } });
    }
    if (payload.subCategoryIds) {
        subCategoryArray = payload.subCategoryIds.split(",");
        for (let i = 0; i < subCategoryArray.length; i++) {
            subCategoryArray[i] = mongoose_1.Types.ObjectId(subCategoryArray[i]);
        }
        matchCriteria.push({ 'bookingDetails.subCategory._id': { $in: subCategoryArray } });
    }
    pipeline.push({ $unwind: "$bookingDetails" }, {
        $group: {
            _id: {
                date: "$date",
                categoryName: "$bookingDetails.category.name",
                _id: "$bookingDetails.category._id"
            },
            bookingDetails: { "$push": "$bookingDetails" },
            date: { "$first": "$date" },
            bookingCount: { $sum: 1 },
            completedBookings: {
                $first: '$completedBookings'
            }
        }
    });
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    pipeline.push({
        $project: {
            date: "$_id.date",
            categoryName: "$_id.categoryName",
            bookingCount: "$bookingCount",
            "_id": 0,
            categoryId: "$_id._id",
            colorCode: { $arrayElemAt: ['$bookingDetails.category.colorCode', 0] },
            completedBookings: 1
        }
    }, { $sort: { "date": 1 } });
    return pipeline;
};
exports.BookingSummaryFilter = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.bookingId) } });
    pipeline.push({
        $project: {
            categoryData: {
                category: "$category",
                subCategory: '$subCategory',
            },
            propertyData: 1,
            cartInfo: 1,
            timing: 1,
            fromDate: 1,
            toDate: 1,
            occupancy: 1,
            createdAt: 1,
            userData: 1,
            quantity: 1,
            price: "$basePrice",
            totalPrice: "$totalPayable",
            discount: "$offerPrice",
            bookingId: 1,
            paymentPlan: 1,
            bookingStatus: 1,
            bookingMode: 1,
            cartId: 1,
            transactionDate: 1,
            transactionId: 1,
            last4: 1,
            taxes: 1,
            paymentStatus: 1,
            taxPercentage: 1,
            bookingDuration: 1,
            paymentMode: {
                $cond: { if: { $eq: ["$paymentMode", 'card'] }, then: 'Card', else: "$paymentMode" }
            },
            shareUrl: 1,
            giftCardAmount: 1,
            invoiceUrl: 1,
            offerLabelType: 1,
            isEmployee: 1,
            floorNumber: 1,
            floorDescription: 1,
            floorLabel: 1,
            bookingType: 1,
            cancellationDuration: {
                '$cond': {
                    if: {
                        '$gte': [
                            { $trunc: { $divide: [{ $subtract: ['$fromDate', new Date()] }, 1000 * 60 * 60 * 24] } }, 13
                        ]
                    },
                    then: {
                        count: {
                            $trunc: { $divide: [{ $subtract: ['$fromDate', new Date()] }, 1000 * 60 * 60 * 24] }
                        },
                        type: _common_1.ENUM.BOOKING.POLICY.TYPE.DAYS
                    },
                    else: {
                        count: { $divide: [{ $subtract: ['$fromDate', new Date()] }, 1000 * 60 * 60] },
                        type: _common_1.ENUM.BOOKING.POLICY.TYPE.HOURS
                    },
                }
            }
        }
    });
    return pipeline;
};
exports.BookingSummary = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.bookingId) } });
    pipeline.push({
        "$lookup": {
            "from": "reviews",
            "let": { "bookingId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$bookingId', '$$bookingId'] } }
                        ]
                    }
                },
                { $project: { rating: 1, review: 1, _id: 0 } }
            ],
            "as": "reviewData"
        }
    }, {
        $unwind: {
            path: "$reviewData",
            preserveNullAndEmptyArrays: true
        }
    });
    pipeline.push({
        "$lookup": {
            "from": "coworkers",
            "let": { "userId": mongoose_1.Types.ObjectId(payload.userId), "bookingId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$coworkerId', '$$userId'] } },
                            { $expr: { $eq: ['$bookingId', '$$bookingId'] } }
                        ]
                    }
                },
            ],
            "as": "coworker"
        }
    });
    pipeline.push({
        $project: {
            cartInfo: 1,
            propertyData: 1,
            timing: 1,
            category: 1,
            subCategory: 1,
            categoryData: {
                category: "$category",
                subCategory: "$subCategory",
                pricing: "$pricing"
            },
            fromDate: 1,
            toDate: 1,
            occupancy: 1,
            userBookingStatus: 1,
            bookingStatus: 1,
            createdAt: 1,
            quantity: 1,
            discount: "$offerPrice",
            bookingId: 1,
            taxes: 1,
            invoiceUrl: 1,
            floorDescription: 1,
            floorNumber: 1,
            coworkerCount: 1,
            coworker: 1,
            hostId: { $cond: { if: { $eq: ["$propertyData.hostName", "User Deleted"] }, then: '', else: "$hostId" } },
            isCoworker: {
                $cond: [{ $size: '$coworker' }, true, false]
            },
            price: "$totalPayable",
            basePrice: "$basePrice",
            paymentPlan: 1,
            transactionId: 1,
            transactionType: 1,
            paymentMode: {
                $cond: { if: { $eq: ["$paymentMode", 'card'] }, then: 'Card', else: "$paymentMode" }
            },
            paymentStatus: 1,
            transactionDate: 1,
            giftCardNo: 1,
            giftCardAmount: 1,
            isEmployee: 1,
            floorLabel: 1,
            giftCardStatus: 1,
            bookingType: 1,
            giftCardId: 1,
            taxPercentage: 1,
            bookingDuration: 1,
            reviewData: {
                $cond: { if: { $gte: ["$reviewData", {}] }, then: "$reviewData", else: {} }
            },
            offerLabelType: 1,
            cancellationDuration: {
                '$cond': {
                    if: {
                        '$gte': [
                            {
                                $trunc: {
                                    $divide: [{
                                            $subtract: [
                                                _common_1.DATABASE.DATE_CONSTANTS.fromDate('$fromDate', payload.offset),
                                                _common_1.DATABASE.DATE_CONSTANTS.currentTime(payload.offset)
                                            ]
                                        }, 1000 * 60 * 60 * 24]
                                }
                            }, 13
                        ]
                    },
                    then: {
                        count: {
                            $trunc: {
                                $divide: [{
                                        $subtract: [
                                            _common_1.DATABASE.DATE_CONSTANTS.fromDate('$fromDate', payload.offset),
                                            _common_1.DATABASE.DATE_CONSTANTS.currentTime(payload.offset)
                                        ]
                                    }, 1000 * 60 * 60 * 24]
                            }
                        },
                        type: _common_1.ENUM.BOOKING.POLICY.TYPE.DAYS
                    },
                    else: {
                        count: {
                            $divide: [{
                                    $subtract: [
                                        _common_1.DATABASE.DATE_CONSTANTS.fromDate('$fromDate', payload.offset),
                                        _common_1.DATABASE.DATE_CONSTANTS.currentTime(payload.offset)
                                    ]
                                }, 1000 * 60 * 60]
                        },
                        type: _common_1.ENUM.BOOKING.POLICY.TYPE.HOURS
                    },
                }
            },
            spaceId: 1,
            partnerId: 1,
            prolongedStatus: 1
        }
    });
    return pipeline;
};
exports.BookingListing = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { "bookingStatus": { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED } } });
    pipeline.push({
        $match: {
            $or: [
                { "userData.userId": mongoose_1.Types.ObjectId(payload.userId) },
                { coworker: { $elemMatch: { $eq: payload.userId.toString() } } }
            ]
        }
    });
    pipeline.push({
        "$lookup": {
            "from": "coworkers",
            "let": { "userId": mongoose_1.Types.ObjectId(payload.userId), "bookingId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$coworkerId', '$$userId'] } },
                            { $expr: { $eq: ['$bookingId', '$$bookingId'] } }
                        ]
                    }
                },
            ],
            "as": "coworker"
        }
    });
    pipeline.push({
        "$lookup": {
            "from": "properties",
            "let": { "propertyId": "$propertyData.propertyId" },
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
    pipeline.push({ $unwind: "$property" });
    let matchCriteria = [];
    if (payload.fromDate && payload.toDate) {
        matchCriteria.push({
            fromDate: { '$gte': moment_1.default(payload.fromDate).startOf('day').toDate() },
            toDate: { '$lte': moment_1.default(payload.toDate).endOf('day').toDate() }
        });
    }
    if (payload.bookingStatus == 0 || payload.bookingStatus)
        matchCriteria.push({ 'bookingStatus': (payload.bookingStatus) });
    if (payload.categoryId)
        matchCriteria.push({ $or: [{ 'category._id': mongoose_1.Types.ObjectId(payload.categoryId) }, { 'category._id': (payload.categoryId) }] });
    if (payload.subCategoryId) {
        matchCriteria.push({ $or: [{ 'subCategory._id': payload.subCategoryId }, { 'subCategory._id': mongoose_1.Types.ObjectId(payload.subCategoryId) }] });
    }
    if (payload.cityId)
        matchCriteria.push({ $or: [{ 'property.city._id': mongoose_1.Types.ObjectId(payload.cityId) }, { 'property.city._id': (payload.cityId) }] });
    if (payload.countryId)
        matchCriteria.push({ 'property.country.id': parseInt(payload.countryId) });
    if (payload.stateId)
        matchCriteria.push({ 'property.state.id': parseInt(payload.stateId) });
    if (payload.search) {
        const pattern = {
            $regex: new RegExp(`.*${payload.search}.*`, `i`)
        };
        pipeline.push({
            $match: {
                '$or': [
                    { 'propertyData.name': pattern },
                    { 'bookingId': pattern }
                ]
            }
        });
    }
    if (matchCriteria.length)
        pipeline.push({ $match: { $and: matchCriteria } });
    if (payload.sort) {
        const sort = payload.sort;
        let objLength = Object.keys(sort).length;
        objLength ? pipeline.push({ $sort: sort }) : "";
    }
    pipeline.push({
        '$group': {
            _id: '$_id',
            propertyData: { $first: "$propertyData" },
            timing: { $first: "$timing" },
            categoryData: { $first: { category: '$category', cartInfo: '$cartInfo', subCategory: '$subCategory' } },
            fromDate: { $first: "$fromDate" },
            toDate: { $first: "$toDate" },
            occupancy: { $first: "$occupancy" },
            userBookingStatus: { $first: "$userBookingStatus" },
            createdAt: { $first: "$createdAt" },
            bookingStatus: { $first: "$bookingStatus" },
            floorNumber: { $first: "$floorNumber" },
            floorDescription: { $first: "$floorDescription" },
            quantity: { $first: "$quantity" },
            price: { $first: "$totalPayable" },
            giftCardAmount: { $first: "$giftCardAmount" },
            giftCardNo: { $first: "$giftCardNo" },
            discount: { $first: { $literal: 0 } },
            bookingId: { $first: "$bookingId" },
            invoiceUrl: { $first: "invoiceUrl" },
            isEmployee: { $first: "$isEmployee" },
            isCoworker: {
                $first: {
                    $cond: [{ $size: '$coworker' }, true, false]
                }
            },
            bookingType: { $first: "$bookingType" },
            bookingDuration: { $first: "$bookingDuration" }
        }
    });
    pipeline.push({ $sort: { createdAt: -1 } });
    return pipeline;
};
exports.HolidaysProperty = async (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            _id: mongoose_1.Types.ObjectId(payload.propertyId),
            holidays: {
                $elemMatch: {
                    $or: [
                        {
                            $and: [
                                {
                                    fromDate: {
                                        '$lte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, payload.offset)
                                    },
                                }, {
                                    toDate: {
                                        '$gte': _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.fromDate, payload.offset)
                                    }
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    fromDate: {
                                        '$lte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.toDate, payload.offset)
                                    },
                                },
                                {
                                    toDate: {
                                        '$gte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.toDate, payload.offset)
                                    },
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    fromDate: {
                                        '$gte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, payload.offset)
                                    },
                                },
                                {
                                    toDate: {
                                        '$lte': _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.toDate, payload.offset)
                                    },
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }, { $project: { _id: 1 } });
    let propertyData = await _entity_1.PropertyV1.basicAggregate(pipeline);
    let response = [];
    for (let i = 0; i < propertyData.length; i++)
        response.push(mongoose_1.Types.ObjectId(propertyData[i]._id));
    return response;
};
exports.favCity = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { userId: payload } }, {
        $group: {
            _id: '$city._id',
            propertyCount: { $sum: 1 },
            avgRating: { $first: "$rating.avgRating" },
            cityDetail: { $first: "$city" }
        }
    });
    pipeline.push({
        $project: {
            _id: 0
        }
    });
    return pipeline;
};
exports.propertyAvergeRating = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { "propertyId": mongoose_1.Types.ObjectId(payload.propertyId) } }, {
        $group: {
            _id: '$propertyId',
            count: { $sum: 1 },
            avgRating: { $avg: "$rating" },
        }
    });
    return pipeline;
};
exports.clientListing = (payload) => {
    let pipeline = [];
    let sortOrder = -1;
    if (payload.sortOrder && payload.sortOrder != '')
        sortOrder = payload.sortOrder;
    let filterConditions = [];
    let matchCriteria = { $match: { $and: [] } };
    if (payload.userData.isCohost && payload.userData.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.ALL)
        matchCriteria.$match.$and.push({ hostId: mongoose_1.Types.ObjectId(payload.userData.hostId) });
    else if (payload.userData.isCohost)
        matchCriteria.$match.$and.push({ hostId: mongoose_1.Types.ObjectId(payload.userData.hostId) });
    else
        matchCriteria.$match.$and.push({ hostId: mongoose_1.Types.ObjectId(payload.userId) });
    if (payload.deletedClient)
        matchCriteria.$match.$and.push({ "userData.userId": { $nin: payload.deletedClient } });
    pipeline.push(matchCriteria);
    if (payload.userData.isCohost && payload.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL)
        pipeline.push({ $match: { "propertyData.propertyId": { $in: payload.propertyId } } });
    pipeline.push({
        $lookup: {
            from: "hosts",
            let: { hostId: '$hostId' },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$_id", "$$hostId"] },
                            ]
                        }
                    }
                },
                { $project: { dob: 1, bio: 1 } }
            ],
            as: "hostDob"
        }
    }, {
        $unwind: {
            path: "$hostDob"
        }
    }, {
        $project: {
            hostDob: 1,
            property: 1,
            propertyId: 1,
            userData: 1,
            bookingStatus: 1,
            propertyData: 1,
            _id: 1,
            totalPayable: 1,
            createdAt: 1,
            conditionalTotalPayable: {
                $cond: [
                    { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.ABANDONED] }, '$totalPayable', 0
                ]
            }
        }
    }, {
        $group: {
            _id: {
                userId: "$userData.userId"
            },
            totalPayment: {
                '$sum': '$conditionalTotalPayable'
            },
            bookingDetailsUserWise: {
                $addToSet: {
                    userData: "$userData",
                    bookingStatus: "$bookingStatus",
                    propertyData: "$propertyData",
                    bookingId: "$_id",
                    totalPayment: "$totalPayable"
                }
            },
            userDetails: {
                $last: "$userData"
            },
            dob: {
                '$first': "$hostDob.dob"
            },
            bio: {
                '$first': "$hostDob.bio"
            },
            lastBooking: {
                $last: "$createdAt"
            }
        }
    }, {
        $project: {
            _id: 0,
            dob: 1,
            bio: 1,
            totalPayment: 1,
            userDetails: 1,
            lastBooking: 1,
            subCategory: 1,
            category: 1,
            propertyData: 1,
            totalBookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsUserWise",
                        as: "bookingDetails",
                        cond: { $ne: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ABANDONED] }
                    }
                }
            },
            abandonedBookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsUserWise",
                        as: "bookingDetails",
                        cond: { $eq: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ABANDONED] }
                    }
                }
            },
            cancellationBookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingDetailsUserWise",
                        as: "bookingDetails",
                        cond: { $eq: ["$$bookingDetails.bookingStatus", _common_1.ENUM.BOOKING.STATUS.CANCELLED] }
                    }
                }
            }
        }
    });
    if (payload.sortBy) {
        if (payload.sortBy == "name")
            pipeline.push({ $sort: { "userDetails.name": 1 } });
        if (payload.sortBy == "booking")
            pipeline.push({ $sort: { "totalBookingCount": sortOrder } });
        if (payload.sortBy == "cancellation")
            pipeline.push({ $sort: { "cancellationBookingCount": sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    if (payload.search)
        filterConditions.push({
            "userDetails.name": { $regex: payload.search, $options: "si" },
        });
    if (payload.minAmount && payload.type == 'booking')
        filterConditions.push({ "totalBookingCount": { $gte: payload.minAmount } });
    if (payload.maxAmount && payload.type == 'booking')
        filterConditions.push({ "totalBookingCount": { $lte: payload.maxAmount } });
    if (payload.minAmount && payload.type == 'cancellation')
        filterConditions.push({ "cancellationBookingCount": { $gte: payload.minAmount } });
    if (payload.maxAmount && payload.type == 'cancellation')
        filterConditions.push({ "cancellationBookingCount": { $lte: payload.maxAmount } });
    if (payload.abondendBooking == 0)
        filterConditions.push({ "abandonedBookingCount": { $gt: 0 } });
    else if (payload.abondendBooking == 1)
        filterConditions.push({ "abandonedBookingCount": { $eq: 0 } });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    return pipeline;
};
exports.coworkerContactListing = (payload) => {
    let pipeline = [];
    let sortOrder = -1;
    if (payload.sortOrder && payload.sortOrder != '')
        sortOrder = payload.sortOrder;
    let filterConditions = [];
    let searchConditions = [];
    let matchCriteria = {
        $match: {
            $and: [
                { userId: mongoose_1.Types.ObjectId(payload.userId) },
                { name: { $exists: true } },
                { name: { '$ne': "" } },
                { isOwner: { $ne: 1 } }
            ]
        }
    };
    pipeline.push(matchCriteria);
    pipeline.push({
        $group: {
            _id: {
                email: "$email"
            },
            name: {
                $first: "$name"
            },
            createdAt: {
                $last: "$createdAt"
            },
            email: {
                $first: "$email"
            },
            coworkerId: {
                $first: "$coworkerId"
            },
            image: {
                $first: "$image"
            },
            bookingId: {
                $first: "$bookingId"
            }
        }
    }, {
        $project: { _id: 0 }
    });
    switch (payload.sortBy) {
        case "name":
            pipeline.push({ $sort: { "name": payload.sortOrder } });
            break;
        case "createdAt":
            pipeline.push({ $sort: { "createdAt": payload.sortOrder } });
            break;
        default:
            pipeline.push({ $sort: { createdAt: sortOrder } });
            break;
    }
    if (payload.search)
        searchConditions.push({ "name": { $regex: payload.search, $options: "si" } }, { "email": { $regex: payload.search, $options: "si" } });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (searchConditions.length)
        pipeline.push({ $match: { $or: searchConditions } });
    return pipeline;
};
exports.floorDetails = (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            "propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
            floorNumber: payload.floorNumber,
            status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE
        }
    }, {
        "$lookup": {
            "from": "offers",
            "let": { "spaceId": "$_id" },
            "pipeline": [
                {
                    "$match": {
                        "$expr": {
                            "$in": ["$$spaceId", "$spaceId"]
                        }
                    }
                },
                { $project: { status: 0, createdAt: 0, updatedAt: 0 } }
            ],
            "as": "offerPrice"
        }
    }, {
        '$group': {
            _id: {
                "_id": "$category._id"
            },
            floorImage: {
                $first: "$floorImage"
            },
            categoryDetail: {
                '$push': {
                    spaceId: '$_id',
                    offerPrice: '$offerPrice',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    "floorNumber": '$floorNumber',
                    "units": "$units",
                    "capacity": "$capacity",
                    "pricing": "$pricing",
                    "floorLabel": '$floorLabel',
                    position: '$position',
                    isEmployee: '$isEmployee',
                    bookingType: '$bookingType',
                    gridColumn: '$gridColumn',
                    gridRow: '$gridRow',
                    spaceLabel: '$spaceLabel'
                }
            }
        }
    });
    return pipeline;
};
exports.holidayListing = (payload) => {
    let pipeline = [];
    payload && payload.limit ? payload.limit = payload.limit : payload.limit = 10;
    pipeline.push({
        $match: {
            "_id": mongoose_1.Types.ObjectId(payload.propertyId)
        }
    }, {
        $unwind: {
            path: "$holidays",
            includeArrayIndex: "arrayIndex"
        }
    }, {
        $project: {
            propertyId: '$_id',
            _id: '$holidays._id',
            name: '$holidays.name',
            createdAt: '$holidays.createdAt',
            fromDate: '$holidays.fromDate',
            toDate: '$holidays.toDate',
        }
    });
    return pipeline;
};
exports.fetchHostpropertyDetails = async (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.propertyId) } }, {
        '$project': {
            _id: 1,
            name: 1,
            status: 1,
            shareUrl: 1,
            isLike: 1,
            fbUrl: 1,
            twitterUrl: 1,
            instaUrl: 1,
            linkedinUrl: 1,
            userData: 1,
            builtUpArea: 1,
            description: 1,
            rating: 1,
            countryId: '$country.id',
            countryName: '$country.name',
            stateId: '$state.id',
            stateName: '$state.name',
            cityName: '$city.cityName',
            location: '$location.coordinates',
            floor: 1,
            images: 1,
            spaceDetails: 1,
            address: 1,
            amenities: 1,
            totalCapacity: 1,
            houseNo: 1,
            street: 1,
            zipCode: 1,
            landmark: 1,
            heading: 1,
            autoAcceptUpcomingBooking: 1,
            startingPrice: 1,
            startingPriceType: 1,
            tags: 1,
            termsAndCond: 1,
            cityId: '$city._id',
            claimedStatus: 1,
            propertyDetail: 1,
            floorCorners: 1
        }
    });
    return await _entity_1.PropertyV1.basicAggregate(pipeline);
};
exports.fetchPartnerProperties = (payload, userId, propertyIds, partnerIds) => {
    let pipeline = [];
    let filterConditions = { $match: { $and: [] } };
    if (payload.cityId) {
        filterConditions['$match']['$and'].push({ 'city._id': payload.cityId });
    }
    if (payload.stateId) {
        filterConditions['$match']['$and'].push({ 'state.id': payload.stateId });
    }
    if (payload.countryId) {
        filterConditions['$match']['$and'].push({ 'country.id': payload.countryId });
    }
    pipeline.push({
        $match: {
            $and: [
                { "_id": { $in: propertyIds } },
                { "status": _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
            ]
        }
    }, {
        "$lookup": {
            "from": "propertySpace",
            "let": { "propertyId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$propertyId',
                                                '$$propertyId'
                                            ]
                                        },
                                        {
                                            '$eq': [
                                                '$status',
                                                'active'
                                            ]
                                        },
                                        {
                                            '$eq': [
                                                '$isEmployee',
                                                true
                                            ]
                                        },
                                    ]
                                }
                            },
                            { "partnerId": { $exists: true } }
                        ]
                    }
                },
                {
                    $project: {
                        "categoryName": "$category.name",
                        "pricing": 1,
                        "categoryId": "$category._id",
                        "capacity": "$capacity",
                        "subCategoryName": "$subCategory.name",
                        units: 1,
                        bookingType: 1,
                        partnerId: 1
                    }
                }
            ],
            "as": "spaceDetails"
        }
    });
    pipeline.push({
        "$addFields": {
            "exclude": {
                "$map": {
                    "input": "$spaceDetails",
                    "as": "el",
                    "in": "$$el.categoryName"
                }
            }
        }
    });
    pipeline.push({
        '$lookup': {
            from: 'partners',
            let: {
                propertyId: '$_id',
                partnerId: partnerIds
            },
            pipeline: [
                {
                    '$match': {
                        '$expr': {
                            '$and': [
                                {
                                    '$eq': [
                                        '$property._id',
                                        '$$propertyId'
                                    ]
                                },
                                {
                                    '$in': [
                                        '$_id',
                                        '$$partnerId'
                                    ]
                                },
                                {
                                    '$eq': [
                                        '$status',
                                        'active'
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    '$project': {
                        name: 1,
                        email: 1,
                        image: 1
                    }
                }
            ],
            as: 'partnerDetails'
        }
    });
    filterConditions.$match.$and.push({ 'spaceDetails': { $ne: [] } });
    filterConditions.$match.$and.push({ 'partnerDetails': { $ne: [] } });
    if (filterConditions.$match.$and.length)
        pipeline.push(filterConditions);
    if (payload.sortKey) {
        if (payload.sortKey == "name")
            pipeline.push({ $sort: { name: 1 } });
        if (payload.sortKey == "createdAt")
            pipeline.push({ $sort: { createdAt: -1 } });
        if (payload.sortKey == "price")
            pipeline.push({ $sort: { startingPrice: payload.sortOrder } });
        if (payload.sortKey == "avgRating")
            pipeline.push({ $sort: { "rating.avgRating": payload.sortOrder } });
    }
    pipeline.push({
        '$project': {
            _id: 1,
            name: 1,
            status: 1,
            userData: 1,
            tags: 1,
            builtUpArea: 1,
            address: 1,
            description: 1,
            partnerDetails: 1,
            rating: 1,
            countryName: '$country.name',
            stateName: '$state.name',
            cityName: '$city.cityName',
            amenities: _common_1.AmenityFilter,
            startingPrice: 1,
            startingPriceType: 1,
            zipCode: 1,
            floor: 1,
            images: 1,
            spaceDetails: 1,
            location: '$location.coordinates',
            categoryList: { "$setUnion": ["$exclude", []] }
        }
    });
    return pipeline;
};
exports.updateBookingData = async () => {
    var _a, _b, _c;
    let bookingData = await _entity_1.BookingV1.findMany({});
    let dataToUpdate = [];
    for (let i = 0; i < bookingData.length; i++) {
        dataToUpdate = {
            spaceId: mongoose_1.Types.ObjectId(bookingData[i].spaceId),
            pricing: (_a = bookingData[i]) === null || _a === void 0 ? void 0 : _a.pricing,
            basePrice: (_b = bookingData[i]) === null || _b === void 0 ? void 0 : _b.basePrice,
            spaceLabel: (_c = bookingData[i]) === null || _c === void 0 ? void 0 : _c.floorLabel
        };
        await _entity_1.BookingV1.updateOne({ _id: mongoose_1.Types.ObjectId(bookingData[i]._id) }, { $addToSet: { cartInfo: dataToUpdate } });
    }
    return;
};
//# sourceMappingURL=user.property.builder.js.map