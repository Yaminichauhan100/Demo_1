"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyListing = exports.partnerEntireFloor = exports.spaceUnits = exports.floorDetails = exports.employeeListing = exports.availabelFloorForPartner = exports.completePartnerFloorData = exports.partnerFloor = exports.entireFloorDetails = exports.partnerListing = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
exports.partnerListing = (payload) => {
    try {
        let pipeline = [];
        let sortOrder = -1;
        let matchCriteria = { $match: { $and: [] } };
        let filterConditions = { $match: { $and: [] } };
        let propertyArray = [];
        matchCriteria.$match.$and.push({ hostId: mongoose_1.Types.ObjectId(payload.userId) });
        if (payload.search)
            matchCriteria.$match.$and.push({ name: { $regex: payload.search, $options: "si" } });
        pipeline.push(matchCriteria);
        if (payload.fromDate) {
            filterConditions.$match.$and.push({ createdAt: { $gte: new Date(payload.fromDate) } });
        }
        if (payload.toDate) {
            filterConditions.$match.$and.push({ createdAt: { $lte: new Date(payload.toDate) } });
        }
        if (payload.propertyIds) {
            propertyArray = payload.propertyIds.split(",");
            for (let i = 0; i < propertyArray.length; i++) {
                propertyArray[i] = mongoose_1.Types.ObjectId(propertyArray[i]);
            }
            filterConditions.$match.$and.push({ 'property._id': { $in: propertyArray } });
        }
        if (filterConditions.$match.$and.length > 0) {
            pipeline.push(filterConditions);
        }
        if (payload.sortBy) {
            if (payload.sortBy == "name")
                pipeline.push({ $sort: { name: 1 } });
            if (payload.sortBy == "createdAt")
                pipeline.push({ $sort: { createdAt: sortOrder } });
        }
        else
            pipeline.push({ $sort: { createdAt: sortOrder } });
        pipeline.push({ $project: { name: 1, _id: 1, image: 1, countryCode: 1, phoneNo: 1, createdAt: 1, status: 1, totalEmployees: 1, activeEmployees: 1, property: 1 } });
        return pipeline;
    }
    catch (error) {
        console.error("we have an error in partner listing =>>>>>>>", error);
    }
};
exports.entireFloorDetails = (payload) => {
    try {
        let pipeline = [];
        pipeline.push({
            $match: {
                "propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
                floorNumber: payload.floorNumber,
                status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE
            }
        }, {
            '$group': {
                _id: {
                    "_id": "$category._id"
                },
                categoryDetail: {
                    '$push': {
                        spaceId: '$_id',
                        categoryData: '$category',
                        subCategory: '$subCategory',
                        propertyId: '$propertyId',
                        "floorNumber": '$floorNumber',
                        "employeeUnits": "$units.employee",
                        seats: '$units.employee',
                        "capacity": "$capacity"
                    }
                }
            }
        });
        return pipeline;
    }
    catch (error) {
        console.error(" we have an error in entireFloorDetails =>>>>>", error);
    }
};
exports.partnerFloor = (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            "propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
            "floorNumber": payload.floorNumber,
            "partnerId": mongoose_1.Types.ObjectId(payload.partnerId),
            status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE
        }
    }, {
        '$group': {
            _id: {
                "_id": "$category._id"
            },
            categoryDetail: {
                '$push': {
                    spaceId: '$spaceId',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    "floorNumber": '$floorNumber',
                    "employeeUnits": "$employeeUnits",
                    propertyId: '$propertyId',
                    seats: '$employeeUnits',
                    "floorLabel": '$floorLabel'
                }
            }
        }
    });
    return pipeline;
};
exports.completePartnerFloorData = (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: { "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), isEmployee: true, "floorNumber": payload.floorNumber, status: _common_1.ENUM.USER.STATUS.ACTIVE }
    });
    if (payload.partnerId) {
        pipeline.push({ $match: { $or: [{ partnerId: { $exists: false } }, { partnerId: mongoose_1.Types.ObjectId(payload.partnerId) }] } });
    }
    else {
        pipeline.push({ $match: { partnerId: { $exists: false } } });
    }
    pipeline.push({
        '$group': {
            _id: {
                "floorNumber": "$floorNumber"
            },
            floorImage: {
                $first: "$floorImage"
            },
            categoryDetail: {
                '$push': {
                    spaceId: '$_id',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    "floorNumber": '$floorNumber',
                    "employeeUnits": "$employeeUnits",
                    propertyId: '$propertyId',
                    seats: '$employeeUnits',
                    "floorLabel": '$floorLabel',
                    position: '$position',
                    isEmployee: '$isEmployee',
                    bookingType: '$bookingType',
                    gridRow: '$gridRow',
                    gridColumn: '$gridColumn',
                    spaceLabel: "$spaceLabel",
                    partnerId: '$partnerId'
                }
            }
        }
    });
    return pipeline;
};
exports.availabelFloorForPartner = (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            "propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
            status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE,
            isEmployee: true
        }
    }, {
        $match: { $or: [{ partnerId: { $exists: false } }, { partnerId: mongoose_1.Types.ObjectId(payload.partnerId) }] }
    }, {
        '$group': {
            _id: {
                "floorNumber": "$floorNumber",
                "_id": "$category._id"
            },
            categoryDetail: {
                '$push': {
                    spaceId: '$spaceId',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    "floorNumber": '$floorNumber',
                    "employeeUnits": "$employeeUnits",
                    propertyId: '$propertyId',
                    seats: '$employeeUnits',
                    "floorLabel": '$floorLabel',
                    'isEmployee': '$isEmployee',
                    'bookingType': '$bookingType',
                    'partnerId': '$partnerId',
                    'position': '$position'
                }
            }
        }
    }, {
        '$group': {
            _id: {
                "floorNumber": "$_id.floorNumber"
            },
            categoryDetail: {
                '$push': {
                    categoryData: '$categoryDetail'
                }
            }
        }
    });
    return pipeline;
};
exports.employeeListing = (payload) => {
    let pipeline = [];
    let sortOrder = -1;
    let filterConditions = { $match: { $and: [] } };
    let matchCriteria = { $match: { $and: [] } };
    matchCriteria.$match.$and.push({ partnerId: mongoose_1.Types.ObjectId(payload.partnerId), status: { $ne: _common_1.ENUM.USER.STATUS.INACTIVE }, partnerStatus: { $ne: _common_1.ENUM.USER.STATUS.INACTIVE } });
    if (payload.search)
        matchCriteria.$match.$and.push({ name: { $regex: payload.search, $options: "si" } });
    pipeline.push(matchCriteria);
    if (payload.fromDate) {
        filterConditions.$match.$and.push({ createdAt: { $gte: new Date(payload.fromDate) } });
    }
    if (payload.toDate) {
        filterConditions.$match.$and.push({ createdAt: { $lte: new Date(payload.toDate) } });
    }
    if (payload.sortBy) {
        if (payload.sortBy == "name")
            pipeline.push({ $sort: { name: 1 } });
        if (payload.sortBy == "createdAt")
            pipeline.push({ $sort: { createdAt: sortOrder } });
        if (payload.sortBy == "email")
            pipeline.push({ $sort: { email: sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    if (filterConditions.$match.$and.length > 0) {
        pipeline.push(filterConditions);
    }
    pipeline.push({ $project: { name: 1, _id: 1, image: 1, countryCode: 1, phoneNo: 1, createdAt: 1, status: 1, email: 1, userId: 1 } });
    return pipeline;
};
exports.floorDetails = (payload) => {
    let pipeline = [];
    pipeline.push({
        $match: { "propertyId": mongoose_1.Types.ObjectId(payload.propertyId), isEmployee: true, "floorNumber": payload.floorNumber, status: _common_1.ENUM.USER.STATUS.ACTIVE, partnerId: mongoose_1.Types.ObjectId(payload.partnerId) }
    });
    pipeline.push({
        '$group': {
            _id: {
                "floorNumber": "$floorNumber"
            },
            floorImage: {
                $first: "$floorImage"
            },
            categoryDetail: {
                '$push': {
                    spaceId: '$_id',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    "floorNumber": '$floorNumber',
                    "employeeUnits": "$employeeUnits",
                    propertyId: '$propertyId',
                    seats: '$employeeUnits',
                    "floorLabel": '$floorLabel',
                    position: '$position',
                    isEmployee: '$isEmployee',
                    bookingType: '$bookingType',
                    gridRow: '$gridRow',
                    gridColumn: '$gridColumn',
                    spaceLabel: "$spaceLabel",
                    partnerId: '$partnerId'
                }
            }
        }
    });
    return pipeline;
};
exports.spaceUnits = async (payload, partnerId) => {
    let pipeline = [];
    if (partnerId) {
        pipeline.push({
            $match: { "spaceId": mongoose_1.Types.ObjectId(payload), partnerId: { $ne: mongoose_1.Types.ObjectId(partnerId) } }
        });
    }
    else {
        pipeline.push({
            $match: { "spaceId": mongoose_1.Types.ObjectId(payload) }
        });
    }
    pipeline.push({
        '$group': {
            _id: {
                "spaceId": "$spaceId",
            }, count: { $sum: "$employeeUnits" }
        }
    });
    return await _entity_1.PartnerFloorV1.basicAggregate(pipeline);
};
exports.partnerEntireFloor = (payload, propertyFloors) => {
    let pipeline = [];
    pipeline.push({
        $match: {
            "propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
            "floorNumber": { $in: propertyFloors },
            status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE
        }
    }, {
        '$group': {
            _id: {
                "_id": "$category._id"
            },
            categoryDetail: {
                '$push': {
                    spaceId: '$spaceId',
                    categoryData: '$category',
                    subCategory: '$subCategory',
                    "floorNumber": '$floorNumber',
                    "employeeUnits": "$employeeUnits",
                    propertyId: '$propertyId',
                    seats: '$employeeUnits'
                }
            }
        }
    });
    return pipeline;
};
exports.propertyListing = async (userId) => {
    try {
        let pipeline = [];
        pipeline.push({ $match: { userId: mongoose_1.Types.ObjectId(userId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE } });
        pipeline.push({
            "$lookup": {
                "from": "propertySpace",
                "let": { "propertyId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$propertyId', '$$propertyId'] } },
                                { isEmployee: true },
                                { status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }
                            ]
                        }
                    },
                    { $project: { _id: 1 } },
                ],
                "as": "spaceData"
            }
        });
        pipeline.push({ $match: { spaceData: { $ne: [] } } });
        pipeline.push({
            $project: { _id: 1, name: 1, address: 1, floorCorners: 1 }
        });
        return await _entity_1.PropertyV1.basicAggregate(pipeline);
    }
    catch (error) {
        console.error("error in partner property listing =>>", error);
    }
};
//# sourceMappingURL=partner.builder.js.map