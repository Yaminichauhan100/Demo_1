"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyListing = exports.cityList = exports.stateList = exports.countryList = exports.getCohostDetails = exports.getCohostDetailsByProperty = exports.getCohostDetailsByCountry = exports.getCohostDetailsByState = exports.getCohostDetailsByCity = exports.getMultipleStateListing = exports.companyDetails = exports.allCityListing = exports.countryListingForFilters = exports.countryListing = exports.cityListing = exports.propertySpaceDetailsBycategory = exports.propertySpaceDetails = exports.propertyDetails = exports.spaceList = exports.archievePropertyList = exports.propertyList = exports.propertyLists = exports.hostDashBoardPropertyList = exports.hostDashBoardCohostPropertyList = exports.promoListing = exports.cohostLiting = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const _builders_1 = __importDefault(require("@builders"));
const moment_1 = __importDefault(require("moment"));
exports.cohostLiting = (payload) => {
    let pipeline = [];
    let matchCriteria = { $match: { $and: [] } };
    matchCriteria.$match.$and.push({ hostId: mongoose_1.Types.ObjectId(payload.userId), status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE } });
    if (payload.search) {
        matchCriteria.$match.$and.push({ name: { $regex: payload.search, $options: "si" } });
    }
    pipeline.push(matchCriteria);
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $project: { name: 1, _id: 1, email: 1, image: 1, countryCode: 1, phoneNo: 1, permissions: 1, status: 1 } });
    return pipeline;
};
exports.promoListing = (payload) => {
    var _a, _b;
    let pipeline = [];
    let matchCriteria = { $match: { $and: [] } };
    let searchCriteria = { $match: { $or: [] } };
    let subCategoryArray = [];
    matchCriteria.$match.$and.push({
        hostId: mongoose_1.Types.ObjectId(payload.hostId),
        promotionStatus: { $ne: _common_1.ENUM.PROPERTY.PROMOTION_STATUS.PENDING },
        "transactionDetail.transactionStatus": { $eq: 1 }
    });
    if (payload.promoStatus) {
        matchCriteria.$match.$and.push({ promotionStatus: payload.promoStatus });
    }
    if (payload.propertyId) {
        matchCriteria.$match.$and.push({ propertyId: mongoose_1.Types.ObjectId(payload.propertyId) });
    }
    if (payload.subCategoryIds) {
        subCategoryArray = payload.subCategoryIds.split(",");
        let subCategoryArrayLength = subCategoryArray.length;
        for (let i = 0; i < subCategoryArrayLength; i++) {
            subCategoryArray[i] = mongoose_1.Types.ObjectId(subCategoryArray[i]);
        }
        matchCriteria.$match.$and.push({ 'subCategory._id': { $in: subCategoryArray } });
    }
    if (payload.categoryId) {
        matchCriteria.$match.$and.push({ "category._id": mongoose_1.Types.ObjectId(payload.categoryId) });
    }
    if (payload.paymentStatus) {
        matchCriteria.$match.$and.push({ "transactionDetail.transactionStatus": payload.paymentStatus });
    }
    if (payload.search) {
        searchCriteria.$match.$or.push({ propertyName: { $regex: payload.search, $options: "si" } }, { "transactionDetail.transactionId": { $regex: payload.search, $options: "si" } });
    }
    pipeline.push(matchCriteria);
    ((_b = (_a = searchCriteria === null || searchCriteria === void 0 ? void 0 : searchCriteria.$match) === null || _a === void 0 ? void 0 : _a.$or) === null || _b === void 0 ? void 0 : _b.length) ? pipeline.push(searchCriteria) : "";
    pipeline.push({ $sort: { createdAt: -1 } });
    return pipeline;
};
exports.hostDashBoardCohostPropertyList = (propertyIds, hostId) => {
    let pipeline = [];
    pipeline.push({ $match: { "status": _common_1.ENUM.PROPERTY.STATUS.ACTIVE, _id: { $in: propertyIds }, "userId": mongoose_1.Types.ObjectId(hostId) } }, {
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
                }
            ],
            "as": "spaceDetails"
        }
    }, { $match: { spaceDetails: { $ne: [] } } }, { $project: { spaceDetails: 0 } });
    return pipeline;
};
exports.hostDashBoardPropertyList = (cityId, hostId) => {
    let pipeline = [];
    pipeline.push({ $match: { "status": _common_1.ENUM.PROPERTY.STATUS.ACTIVE, "city._id": cityId, "userId": mongoose_1.Types.ObjectId(hostId) } }, {
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
                }
            ],
            "as": "spaceDetails"
        }
    }, { $match: { spaceDetails: { $ne: [] } } }, { $project: { spaceDetails: 0 } });
    return pipeline;
};
exports.propertyLists = (payload) => {
    let pipeline = [];
    if (payload.userData.isCohost && payload.userData.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
        pipeline.push({ $match: { $and: [{ userId: mongoose_1.Types.ObjectId(payload.userId) }, { status: { $nin: [_common_1.ENUM.PROPERTY.STATUS.ISDELETE, _common_1.ENUM.PROPERTY.STATUS.INACTIVE, _common_1.ENUM.PROPERTY.STATUS.DRAFT, _common_1.ENUM.PROPERTY.STATUS.ARCHIVE] } }] }, });
    }
    else if (payload.userData.isCohost)
        pipeline.push({
            $match: { $and: [{ userId: mongoose_1.Types.ObjectId(payload.userData.hostId) }, { coHostId: mongoose_1.Types.ObjectId(payload.userId) }, { status: { $nin: [_common_1.ENUM.PROPERTY.STATUS.ISDELETE, _common_1.ENUM.PROPERTY.STATUS.INACTIVE, _common_1.ENUM.PROPERTY.STATUS.DRAFT, _common_1.ENUM.PROPERTY.STATUS.ARCHIVE] } }] }
        });
    else
        pipeline.push({ $match: { $and: [{ userId: mongoose_1.Types.ObjectId(payload.userId) }, { status: { $nin: [_common_1.ENUM.PROPERTY.STATUS.ISDELETE, _common_1.ENUM.PROPERTY.STATUS.INACTIVE, _common_1.ENUM.PROPERTY.STATUS.DRAFT, _common_1.ENUM.PROPERTY.STATUS.ARCHIVE] } }] }, });
    pipeline.push({
        $project: {
            _id: 1, address: 1, name: 1
        }
    });
    return pipeline;
};
exports.propertyList = (payload) => {
    let pipeline = [];
    let filterConditions = [];
    let cityArray = [];
    if (payload.userData.isCohost && payload.userData.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
        if (payload.userId && !payload.search)
            pipeline.push({
                $match: { $and: [{ userId: mongoose_1.Types.ObjectId(payload.userData.hostId) }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE } }] }
            });
        else if (payload.userId && payload.search)
            pipeline.push({
                $match: { $and: [{ userId: mongoose_1.Types.ObjectId(payload.userData.hostId) }, { name: { $regex: payload.search, $options: "si" } }, { coHostId: mongoose_1.Types.ObjectId(payload.userId) }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE } }] }
            });
    }
    else if (payload.userData.isCohost) {
        if (payload.userId && !payload.search)
            pipeline.push({
                $match: { $and: [{ userId: mongoose_1.Types.ObjectId(payload.userData.hostId) }, { coHostId: mongoose_1.Types.ObjectId(payload.userId) }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE } }] }
            });
        else if (payload.userId && payload.search)
            pipeline.push({
                $match: { $and: [{ userId: mongoose_1.Types.ObjectId(payload.userData.hostId) }, { name: { $regex: payload.search, $options: "si" } }, { coHostId: mongoose_1.Types.ObjectId(payload.userId) }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE } }] },
            });
    }
    else {
        if (payload.userId && !payload.search)
            pipeline.push({
                $match: {
                    $and: [{
                            $or: [{
                                    userId: mongoose_1.Types.ObjectId(payload.userId)
                                }, {
                                    claimingHosts: mongoose_1.Types.ObjectId(payload.userId)
                                }
                            ]
                        }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE } }]
                },
            });
        else if (payload.userId && payload.search)
            pipeline.push({
                $match: {
                    $and: [{
                            $or: [{
                                    userId: mongoose_1.Types.ObjectId(payload.userId)
                                }, {
                                    claimingHosts: mongoose_1.Types.ObjectId(payload.userId)
                                }
                            ]
                        }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } }, { status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE } }, { name: { $regex: payload.search, $options: "si" } }]
                },
            });
    }
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
    });
    if (payload.categoryArray) {
        filterConditions.push({ _id: { $in: payload.categoryArray } });
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.autoAcceptUpcomingBooking) == false || (payload === null || payload === void 0 ? void 0 : payload.autoAcceptUpcomingBooking) == true) {
        filterConditions.push({ autoAcceptUpcomingBooking: payload.autoAcceptUpcomingBooking });
    }
    if (payload.subCategoryArray) {
        filterConditions.push({ _id: { $in: payload.subCategoryArray } });
    }
    if (payload.status) {
        filterConditions.push({ status: payload.status });
    }
    if (payload.fromDate) {
        filterConditions.push({ createdAt: { $gte: new Date(payload.fromDate) } });
    }
    if (payload.toDate)
        filterConditions.push({ createdAt: { $lte: new Date(payload.toDate) } });
    if (payload.stateId)
        filterConditions.push({ "state.id": parseInt(payload.stateId) });
    if (payload.cityId) {
        cityArray = payload.cityId.split(",");
        for (let i = 0; i < cityArray.length; i++) {
            cityArray[i] = cityArray[i];
        }
        filterConditions.push({ "city._id": { $in: cityArray } });
    }
    if (payload.countryId)
        filterConditions.push({ "country.id": parseInt(payload.countryId) });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    pipeline.push({
        $lookup: {
            from: "booking",
            let: { propertyId: '$_id' },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$propertyData.propertyId", "$$propertyId"] },
                            ]
                        }
                    }
                },
                { $project: { bookingStatus: 1, _id: 1 } }
            ],
            as: "bookingArray"
        }
    }, { $sort: { createdAt: -1 } }, {
        '$project': {
            totalBookingsCount: {
                $size: {
                    $filter: {
                        input: "$bookingArray",
                        as: "booking",
                        cond: { $ne: ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ABANDONED] }
                    }
                }
            },
            ongoingBookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingArray",
                        as: "booking",
                        cond: { $eq: ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ONGOING] }
                    }
                }
            },
            upComingBookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingArray",
                        as: "booking",
                        cond: { $eq: ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.UPCOMING] }
                    }
                }
            },
            _id: 1,
            name: 1,
            status: 1,
            description: 1,
            rating: 1,
            countryName: '$country.name',
            stateName: '$state.name',
            cityName: '$city.cityName',
            amenities: 1,
            startingPrice: 1,
            startingPriceType: 1,
            zipCode: 1,
            floor: 1,
            images: 1,
            spaceDetails: 1,
            address: 1,
            iconImage: 1,
            autoAcceptUpcomingBooking: 1,
            averageDuration: 1,
            propertyType: 1,
            claimedStatus: 1,
            addressPrimary: 1,
            addressSecondary: 1,
            currentMonthBookingCount: {
                $size: {
                    $filter: {
                        input: "$bookingArray",
                        as: "booking",
                        cond: {
                            "$and": [
                                { "$ne": ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ABANDONED] },
                                { "$ne": ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.CANCELLED] },
                                { "$ne": ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.REJECTED] },
                                { "$gte": ["$$booking.fromDate", moment_1.default().startOf('month').toDate()] },
                                { "$lte": ["$$booking.toDate", moment_1.default().endOf('month').toDate()] }
                            ]
                        }
                    }
                }
            },
            totalMonthlyUnits: { $multiply: ['$totalUnits', moment_1.default().daysInMonth()] },
        }
    }, {
        $project: {
            bookingPercentage: {
                $cond: { if: { $gt: ["$totalMonthlyUnits", 0] }, then: { "$multiply": [{ "$divide": ["$ongoingBookingCount", "$totalMonthlyUnits"] }, 100] }, else: 0 }
            },
            totalBookingsCount: 1,
            ongoingBookingCount: 1,
            upComingBookingCount: 1,
            _id: 1,
            name: 1,
            status: 1,
            description: 1,
            rating: 1,
            countryName: '$country.name',
            stateName: '$state.name',
            cityName: '$city.cityName',
            amenities: 1,
            startingPrice: 1,
            startingPriceType: 1,
            zipCode: 1,
            floor: 1,
            images: 1,
            spaceDetails: 1,
            address: 1,
            iconImage: 1,
            autoAcceptUpcomingBooking: 1,
            averageDuration: 1,
            propertyType: 1,
            claimedStatus: 1,
            addressPrimary: 1,
            addressSecondary: 1
        }
    });
    return pipeline;
};
exports.archievePropertyList = (payload) => {
    let pipeline = [];
    if (payload.userData.isCohost && payload.userData.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
        pipeline.push({ $match: { "status": _common_1.ENUM.PROPERTY.STATUS.ARCHIVE, userId: mongoose_1.Types.ObjectId(payload.userId) } });
    }
    else if (payload.userData.isCohost) {
        pipeline.push({
            $match: { $and: [{ userId: mongoose_1.Types.ObjectId(payload.userData.hostId) }, { hostId: mongoose_1.Types.ObjectId(payload.userId) }, { "status": _common_1.ENUM.PROPERTY.STATUS.ARCHIVE }] }
        });
    }
    else
        pipeline.push({ $match: { "status": _common_1.ENUM.PROPERTY.STATUS.ARCHIVE, userId: mongoose_1.Types.ObjectId(payload.userId) } });
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
                                pricing: '$pricing',
                            }
                        }
                    }
                }
            ],
            "as": "spaceDetails"
        }
    });
    if (payload.limit)
        pipeline.push({ $limit: payload.limit });
    else
        pipeline.push({ $limit: 10 });
    pipeline.push({
        '$project': {
            _id: 1, name: 1, status: 1, description: 1, rating: 1, builtUpArea: 1, countryName: '$country.name', stateName: '$state.name', cityName: '$city.cityName', amenities: 1, startingPrice: 1, startingPriceType: 1, zipCode: 1, floor: 1, images: 1, spaceDetails: 1,
            address: 1, iconImage: 1, autoAcceptUpcomingBooking: 1
        }
    });
    return pipeline;
};
exports.spaceList = (payload) => {
    let pipeline = [];
    if (payload.userId) {
        pipeline.push({ $match: { userId: mongoose_1.Types.ObjectId(payload.userId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, propertyId: mongoose_1.Types.ObjectId(payload.propertyId) } });
        pipeline.push({
            $lookup: {
                from: "categories",
                let: { categoryId: "$categoryId" },
                "pipeline": [
                    { "$match": { "$expr": { "$eq": ["$_id", "$$categoryId",] } } },
                    { "$project": { "name": 1 } }
                ],
                as: "category"
            }
        });
    }
    return pipeline;
};
exports.propertyDetails = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(id) } });
    return pipeline;
};
exports.propertySpaceDetails = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { propertyId: mongoose_1.Types.ObjectId(id), status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } } }, {
        "$lookup": {
            "from": "offers",
            "let": { "spaceId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ["$spaceId", "$$spaceId"] } }
                        ]
                    }
                }
            ],
            "as": "offerPricing"
        }
    });
    return pipeline;
};
exports.propertySpaceDetailsBycategory = (payload) => {
    let pipeline = [];
    if (payload.categoryId)
        pipeline.push({ $match: { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), "category._id": mongoose_1.Types.ObjectId(payload.categoryId), status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } } });
    else
        pipeline.push({ $match: { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), status: { $ne: _common_1.ENUM.PROPERTY.STATUS.ISDELETE } } });
    return pipeline;
};
exports.cityListing = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { stateId: Number(payload.stateId), isDelete: false, status: "active" } });
    pipeline.push({ $sort: { cityName: 1 } });
    pipeline.push({ $project: { cityName: 1, iconImage: 1, isFeatured: 1, zipCodes: 1 } });
    return pipeline;
};
exports.countryListing = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { id: { $in: payload }, isDelete: false } });
    pipeline.push({ $sort: { name: 1 } });
    pipeline.push({ $project: { sortname: 1, name: 1, id: 1, tax: 1, cityName: 1, iconImage: 1, isFeatured: 1 } });
    return pipeline;
};
exports.countryListingForFilters = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { id: { $in: payload }, isDelete: false } });
    pipeline.push({ $project: { _id: 1, id: 1, name: 1, sortname: 1 } });
    return pipeline;
};
exports.allCityListing = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { id: { $in: payload }, isDelete: false } });
    pipeline.push({ $sort: { name: 1 } });
    return pipeline;
};
exports.companyDetails = (userId) => {
    let pipeline = [];
    pipeline.push({ $match: { userId: userId, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE } });
    pipeline.push({ $project: _builders_1.default.User.Projections.UserList.hostCompanyDetails });
    return pipeline;
};
exports.getMultipleStateListing = (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { id: { $in: payload }, isDelete: false } });
    pipeline.push({ $sort: { name: 1 } });
    return pipeline;
};
exports.getCohostDetailsByCity = async (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.cohostId) } });
    pipeline.push({
        '$unwind': '$territory.cityId'
    }, {
        '$lookup': {
            from: 'properties',
            let: {
                propertyId: '$territory.cityId'
            },
            pipeline: [
                {
                    '$match': {
                        '$and': [
                            {
                                '$expr': {
                                    '$eq': [
                                        '$city._id',
                                        '$$propertyId'
                                    ],
                                }
                            },
                            { $expr: { $eq: ["$userId", mongoose_1.Types.ObjectId(payload.userId)] } }
                        ]
                    }
                },
                {
                    '$project': {
                        city: 1,
                        state: 1,
                        country: 1,
                        name: 1
                    }
                }
            ],
            as: 'property'
        }
    }, {
        '$unwind': '$property'
    }, {
        $group: {
            _id: "$_id", property: { $push: "$property" }, name: { $first: "$name" },
            email: { $first: "$email" },
            countryCode: { $first: "$countryCode" }, phoneNo: { $first: "$phoneNo" }, image: { $first: "$image" }
        }
    }, {
        $project: {
            name: 1, _id: 1, email: 1, countryCode: 1, phoneNo: 1, image: 1, property: 1, permissions: 1, territory: 1
        }
    });
    return pipeline;
};
exports.getCohostDetailsByState = async (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.cohostId) } });
    pipeline.push({
        '$unwind': '$territory.stateId'
    }, {
        '$lookup': {
            from: 'properties',
            let: {
                propertyId: '$territory.stateId'
            },
            pipeline: [
                {
                    '$match': {
                        '$and': [
                            {
                                '$expr': {
                                    '$eq': [
                                        '$state.id',
                                        '$$propertyId'
                                    ],
                                }
                            },
                            { $expr: { $eq: ["$userId", mongoose_1.Types.ObjectId(payload.userId)] } }
                        ]
                    }
                },
                {
                    '$project': {
                        city: 1,
                        state: 1,
                        country: 1,
                        name: 1
                    }
                }
            ],
            as: 'property'
        }
    }, {
        '$unwind': '$property'
    }, {
        $group: {
            _id: "$_id", property: { $push: "$property" }, name: { $first: "$name" },
            email: { $first: "$email" },
            countryCode: { $first: "$countryCode" }, phoneNo: { $first: "$phoneNo" }, image: { $first: "$image" }
        }
    }, {
        $project: {
            name: 1, _id: 1, email: 1, countryCode: 1, phoneNo: 1, image: 1, property: 1, permissions: 1, territory: 1
        }
    });
    return pipeline;
};
exports.getCohostDetailsByCountry = async (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.cohostId) } });
    pipeline.push({
        '$unwind': '$territory.countryId'
    }, {
        '$lookup': {
            from: 'properties',
            let: {
                propertyId: '$territory.countryId'
            },
            pipeline: [
                {
                    '$match': {
                        '$and': [
                            {
                                '$expr': {
                                    '$eq': [
                                        '$country.id',
                                        '$$propertyId'
                                    ],
                                }
                            },
                            { $expr: { $eq: ["$userId", mongoose_1.Types.ObjectId(payload.userId)] } }
                        ]
                    }
                },
                {
                    '$project': {
                        city: 1,
                        state: 1,
                        country: 1,
                        name: 1
                    }
                }
            ],
            as: 'property'
        }
    }, {
        '$unwind': '$property'
    }, {
        $group: {
            _id: "$_id", property: { $push: "$property" }, name: { $first: "$name" },
            email: { $first: "$email" },
            countryCode: { $first: "$countryCode" }, phoneNo: { $first: "$phoneNo" }, image: { $first: "$image" }
        }
    }, {
        $project: {
            name: 1, _id: 1, email: 1, countryCode: 1, phoneNo: 1, image: 1, property: 1, permissions: 1, territory: 1
        }
    });
    return pipeline;
};
exports.getCohostDetailsByProperty = async (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.cohostId) } });
    pipeline.push({
        '$unwind': '$territory.propertyId'
    }, {
        '$lookup': {
            from: 'properties',
            let: {
                propertyId: '$territory.propertyId'
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
                                    ],
                                }
                            },
                            { $expr: { $eq: ["$userId", mongoose_1.Types.ObjectId(payload.userId)] } }
                        ]
                    }
                },
                {
                    '$project': {
                        city: 1,
                        state: 1,
                        country: 1,
                        name: 1
                    }
                }
            ],
            as: 'property'
        }
    }, {
        '$unwind': '$property'
    }, {
        $group: {
            _id: "$_id", property: { $push: "$property" }, name: { $first: "$name" },
            email: { $first: "$email" },
            countryCode: { $first: "$countryCode" }, phoneNo: { $first: "$phoneNo" }, image: { $first: "$image" }
        }
    }, {
        $project: {
            name: 1, _id: 1, email: 1, countryCode: 1, phoneNo: 1, image: 1, property: 1, permissions: 1, territory: 1
        }
    });
    return pipeline;
};
exports.getCohostDetails = async (payload) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(payload.cohostId) } });
    pipeline.push({
        '$lookup': {
            from: 'properties',
            pipeline: [
                {
                    '$match': {
                        coHostId: {
                            $in: [mongoose_1.Types.ObjectId(payload.cohostId)]
                        }
                    }
                },
                {
                    '$project': {
                        city: 1,
                        state: 1,
                        country: 1,
                        name: 1
                    }
                }
            ],
            as: 'property'
        }
    }, {
        '$unwind': '$property'
    }, {
        $group: {
            _id: "$_id", property: { $push: "$property" }, name: { $first: "$name" },
            email: { $first: "$email" },
            countryCode: { $first: "$countryCode" }, phoneNo: { $first: "$phoneNo" }, image: { $first: "$image" }
        }
    }, {
        $project: {
            name: 1, _id: 1, email: 1, countryCode: 1, phoneNo: 1, image: 1, property: 1, permissions: 1, accessLevel: 1, stateId: 1, cityId: 1, countryId: 1, propertyId: 1
        }
    });
    return pipeline;
};
exports.countryList = (paylaod) => {
    let pipeline = [];
    pipeline.push({ $match: { userId: mongoose_1.Types.ObjectId(paylaod) } }, {
        $group: {
            "_id": "$country._id",
            "id": { $first: "$country.id" },
            name: { $first: "$country.name" },
            sortname: { $first: "$country.sortname" }
        }
    });
    return pipeline;
};
exports.stateList = (paylaod) => {
    let pipeline = [];
    let stateArray = [];
    stateArray = paylaod.countryId.split(",");
    for (let i = 0; i < stateArray.length; i++) {
        stateArray[i] = parseInt(stateArray[i]);
    }
    pipeline.push({ $match: { userId: mongoose_1.Types.ObjectId(paylaod.userId), "country.id": { $in: stateArray } } }, {
        $group: {
            "_id": "$state._id",
            "id": { $first: "$state.id" },
            name: { $first: "$state.name" }
        }
    });
    return pipeline;
};
exports.cityList = (paylaod) => {
    let pipeline = [];
    let stateArray = [];
    stateArray = paylaod.stateId.split(",");
    for (let i = 0; i < stateArray.length; i++) {
        stateArray[i] = parseInt(stateArray[i]);
    }
    pipeline.push({ $match: { userId: mongoose_1.Types.ObjectId(paylaod.userId), "state.id": { $in: stateArray } } }, {
        $group: {
            "_id": "$city._id",
            cityName: { $first: "$city.cityName" },
            iconImage: { $first: "$city.iconImage" }
        }
    });
    return pipeline;
};
exports.propertyListing = (paylaod) => {
    let pipeline = [];
    let stateArray = [];
    stateArray = paylaod.cityId.split(",");
    for (let i = 0; i < stateArray.length; i++) {
        stateArray[i] = mongoose_1.Types.ObjectId(stateArray[i]);
    }
    pipeline.push({ $match: { userId: mongoose_1.Types.ObjectId(paylaod.userId), "city._id": { $in: stateArray } } }, {
        $group: {
            "_id": "$city._id",
            cityName: { $first: "$city.cityName" },
            iconImage: { $first: "$city.iconImage" }
        }
    });
    return pipeline;
};
//# sourceMappingURL=host.builder.js.map