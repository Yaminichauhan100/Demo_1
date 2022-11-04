"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDetails = exports.checkExistingUser = exports.UserList = void 0;
const index_1 = require("./index");
const mongoose_1 = require("mongoose");
const _builders_1 = __importDefault(require("@builders"));
const _common_1 = require("@common");
const _services_1 = require("@services");
exports.UserList = (payload) => {
    let pipeline = [];
    let matchconditions = [];
    let filterConditions = [];
    let sortOrder = -1;
    if (payload.sortOrder && payload.sortOrder != '')
        sortOrder = payload.sortOrder;
    if (payload.search) {
        matchconditions.push({ name: { $regex: payload.search, $options: "si" } }, { email: { $regex: payload.search, $options: "si" } }, { phoneNo: { $regex: payload.search, $options: "si" } });
    }
    if (payload.regStartDate)
        filterConditions.push({ createdAt: { $gte: new Date(payload.regStartDate) } });
    if (payload.regEndDate)
        filterConditions.push({ createdAt: { $lte: new Date(payload.regEndDate) } });
    if (payload.companyType)
        filterConditions.push({ companyType: payload.companyType });
    pipeline.push({ $match: { status: { $ne: _common_1.ENUM.USER.STATUS.ISDELETE }, type: _common_1.ENUM.USER.TYPE.USER } });
    pipeline.push({
        "$lookup": {
            "from": "booking",
            "let": { "userId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $expr: {
                            $and: [
                                { $eq: ['$userData.userId', '$$userId'] },
                                { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.ABANDONED] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$userData.userId",
                        count: { $sum: 1 }
                    }
                },
                { $project: { count: 1, _id: 0 } },
            ],
            "as": "bookingCount"
        }
    });
    pipeline.push({
        '$unwind': {
            path: '$bookingCount',
            preserveNullAndEmptyArrays: true
        }
    });
    if (matchconditions.length)
        pipeline.push({ $match: { $or: matchconditions } });
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
    pipeline.push({ $project: index_1.Projections.AdminUserList.userDetails });
    return pipeline;
};
exports.checkExistingUser = (payload, userId) => {
    let pipeline = [];
    let conditions = [];
    pipeline.push({ $match: { _id: { $ne: mongoose_1.Types.ObjectId(userId) }, status: { $ne: _common_1.ENUM.USER.STATUS.ISDELETE } } });
    if (payload.email)
        conditions.push({ email: payload.email });
    if (payload.countryCode && payload.countryCode != "" && payload.phoneNo && payload.phoneNo != "")
        conditions.push({ countryCode: payload.countryCode, phoneNo: payload.phoneNo });
    pipeline.push({ $match: { $or: conditions } });
    return pipeline;
};
exports.UserDetails = (userId) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(userId) } });
    pipeline.push({
        "$lookup": {
            "from": "booking",
            "let": { "userId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $expr: {
                            $and: [
                                { $eq: ['$userData.userId', '$$userId'] },
                                { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.ABANDONED] }
                            ]
                        }
                    }
                }
            ],
            "as": "bookingArray"
        }
    }, {
        "$lookup": {
            "from": "reviews",
            "let": { "userId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$userId', '$$userId'] } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: "$userId",
                        count: { $sum: 1 }
                    }
                },
                { $project: { count: 1, _id: 0 } },
            ],
            "as": "reviewCount"
        }
    }, {
        '$unwind': {
            path: '$reviewCount',
            preserveNullAndEmptyArrays: true
        }
    });
    pipeline.push({ $lookup: _services_1.Helper.lookupGenerator(_common_1.ENUM.COL.USER_COMPANY_Details, '_id', 'userId', 'companyDetails') });
    pipeline.push({ $project: _builders_1.default.Admin.Projections.AdminUserList.AdminUserAndCompanyDetails });
    return pipeline;
};
//# sourceMappingURL=admin.user.builder.js.map