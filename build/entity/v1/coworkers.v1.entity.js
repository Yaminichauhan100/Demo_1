"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoworkerV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const coworkers_model_1 = __importDefault(require("@models/coworkers.model"));
const _entity_1 = require("@entity");
const _builders_1 = __importDefault(require("@builders"));
const _common_1 = require("@common");
class CoworkersEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createUser(payload) {
        let userData = await new this.model(payload).save();
        return userData.toObject();
    }
    async spaceLimitCheck(bookingId) {
        try {
            let { occupancy } = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingId) }, { occupancy: 1 });
            return await _entity_1.BookingV1.findOne({
                _id: mongoose_1.Types.ObjectId(bookingId),
                totalSpaceCapacity: { $lte: occupancy }
            }, { occupancy: 1, totalSpaceCapacity: 1 });
        }
        catch (error) {
            console.error(`we have an error in spaceLimitCheck ==> ${error}`);
        }
    }
    async fetchUserContactList(payload) {
        try {
            payload['getCount'] = true;
            let contactListPipeline = _builders_1.default.User.UserPropertyBuilder.coworkerContactListing(payload);
            let paginatedList = await exports.CoworkerV1.paginateAggregate(contactListPipeline, payload);
            return paginatedList;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async checkInCount(params) {
        try {
            let pipeline = [];
            let filterConditions = {
                $match: {
                    $and: [
                        { name: { $exists: true } },
                        { name: { $ne: "" } },
                    ]
                }
            };
            if (params && params.propertyId)
                filterConditions.$match.$and.push({ 'propertyId': mongoose_1.Types.ObjectId(params.propertyId) });
            if (params && params.bookingId)
                filterConditions.$match.$and.push({ 'bookingId': mongoose_1.Types.ObjectId(params.bookingId) });
            if (params && params.search)
                filterConditions.$match.$and.push({
                    $or: [
                        { 'bookingNumber': params.search },
                        { 'name': { $regex: params.search, $options: "si" } }
                    ]
                });
            pipeline.push(filterConditions);
            pipeline.push({
                '$lookup': {
                    from: 'check_in',
                    "let": { "coworkerId": "$_id" },
                    pipeline: [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ['$coworker._id', "$$coworkerId"] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        { $match: { status: _common_1.ENUM.CHECKIN_STATUS.IN } },
                        {
                            '$project': {
                                time: 1,
                                date: 1,
                                status: 1
                            }
                        }
                    ],
                    as: 'checkInInfo'
                }
            });
            pipeline.push({
                $unwind: {
                    path: "$checkInInfo",
                    preserveNullAndEmptyArrays: false
                }
            });
            pipeline.push({
                $match: { checkInInfo: { $exists: true } }
            });
            pipeline.push({
                $count: "count"
            });
            return await exports.CoworkerV1.basicAggregate(pipeline);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async checkOutCount(params) {
        try {
            let pipeline = [];
            let filterConditions = {
                $match: {
                    $and: [
                        { name: { $exists: true } },
                        { name: { $ne: "" } },
                    ]
                }
            };
            if (params && params.propertyId)
                filterConditions.$match.$and.push({ 'propertyId': mongoose_1.Types.ObjectId(params.propertyId) });
            if (params && params.bookingId)
                filterConditions.$match.$and.push({ 'bookingId': mongoose_1.Types.ObjectId(params.bookingId) });
            if (params && params.search)
                filterConditions.$match.$and.push({
                    $or: [
                        { 'bookingNumber': params.search },
                        { 'name': { $regex: params.search, $options: "si" } }
                    ]
                });
            pipeline.push(filterConditions);
            pipeline.push({
                '$lookup': {
                    from: 'check_in',
                    "let": { "coworkerId": "$_id" },
                    pipeline: [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ['$coworker._id', "$$coworkerId"] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        { $match: { status: _common_1.ENUM.CHECKIN_STATUS.OUT } },
                        {
                            '$project': {
                                time: 1,
                                date: 1,
                                status: 1
                            }
                        }
                    ],
                    as: 'checkInInfo'
                }
            });
            pipeline.push({
                $unwind: {
                    path: "$checkInInfo",
                    preserveNullAndEmptyArrays: false
                }
            });
            pipeline.push({
                $match: { checkInInfo: { $exists: true } }
            });
            pipeline.push({
                $count: "count"
            });
            return await exports.CoworkerV1.basicAggregate(pipeline);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async allCoworkerCount(params) {
        try {
            let pipeline = [];
            let filterConditions = {
                $match: {
                    $and: [
                        { name: { $exists: true } },
                        { name: { $ne: "" } },
                    ]
                }
            };
            if (params && params.propertyId)
                filterConditions.$match.$and.push({ 'propertyId': mongoose_1.Types.ObjectId(params.propertyId) });
            if (params && params.bookingId)
                filterConditions.$match.$and.push({ 'bookingId': mongoose_1.Types.ObjectId(params.bookingId) });
            if (params && params.search)
                filterConditions.$match.$and.push({
                    $or: [
                        { 'bookingNumber': params.search },
                        { 'name': { $regex: params.search, $options: "si" } }
                    ]
                });
            pipeline.push(filterConditions);
            pipeline.push({
                '$lookup': {
                    from: 'check_in',
                    "let": { "coworkerId": "$_id" },
                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $eq: ['$coworker._id', "$$coworkerId"] } },
                                ]
                            }
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            '$project': {
                                time: 1,
                                "date": 1,
                                status: 1
                            }
                        }
                    ],
                    as: 'checkInInfo'
                }
            });
            pipeline.push({
                $unwind: {
                    path: "$checkInInfo",
                    preserveNullAndEmptyArrays: true
                }
            });
            pipeline.push({
                $count: "count"
            });
            return await exports.CoworkerV1.basicAggregate(pipeline);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async searchCowrokerCheckInStatus(params) {
        try {
            let pipeline = [];
            let filterConditions = {
                $match: {
                    $and: [
                        { name: { $exists: true } },
                        { name: { $ne: "" } },
                    ]
                }
            };
            if (params && params.propertyId)
                filterConditions.$match.$and.push({ 'propertyId': mongoose_1.Types.ObjectId(params.propertyId) });
            if (params && params.bookingId)
                filterConditions.$match.$and.push({ 'bookingId': mongoose_1.Types.ObjectId(params.bookingId) });
            if (params && params.search)
                filterConditions.$match.$and.push({
                    $or: [
                        { 'bookingNumber': params.search },
                        { 'name': { $regex: params.search, $options: "si" } }
                    ]
                });
            pipeline.push(filterConditions);
            if (params && params.status === _common_1.ENUM.CHECKIN_STATUS.IN || params.status === _common_1.ENUM.CHECKIN_STATUS.OUT) {
                pipeline.push({
                    '$lookup': {
                        from: 'check_in',
                        "let": { "coworkerId": "$_id" },
                        pipeline: [
                            {
                                '$match': {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$coworker._id', "$$coworkerId"] }
                                        ]
                                    }
                                }
                            },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 },
                            { $match: { status: params.status } },
                            {
                                '$project': {
                                    time: 1,
                                    date: 1,
                                    status: 1
                                }
                            }
                        ],
                        as: 'checkInInfo'
                    }
                });
            }
            else {
                pipeline.push({
                    '$lookup': {
                        from: 'check_in',
                        "let": { "coworkerId": "$_id" },
                        pipeline: [
                            {
                                '$match': {
                                    $and: [
                                        { $expr: { $eq: ['$coworker._id', "$$coworkerId"] } },
                                    ]
                                }
                            },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 },
                            {
                                '$project': {
                                    time: 1,
                                    "date": 1,
                                    status: 1
                                }
                            }
                        ],
                        as: 'checkInInfo'
                    }
                });
            }
            if (params && params.status === _common_1.ENUM.CHECKIN_STATUS.IN || params.status === _common_1.ENUM.CHECKIN_STATUS.OUT) {
                pipeline.push({
                    $unwind: {
                        path: "$checkInInfo",
                        preserveNullAndEmptyArrays: false
                    }
                });
                pipeline.push({
                    $match: { checkInInfo: { $exists: true } }
                });
            }
            else {
                pipeline.push({
                    $unwind: {
                        path: "$checkInInfo",
                        preserveNullAndEmptyArrays: true
                    }
                });
            }
            return await exports.CoworkerV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 10, page: params.page });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
}
exports.CoworkerV1 = new CoworkersEntity(coworkers_model_1.default);
//# sourceMappingURL=coworkers.v1.entity.js.map