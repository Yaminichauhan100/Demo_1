"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const checkIn_model_1 = __importDefault(require("@models/checkIn.model"));
const _common_1 = require("@common");
const _services_1 = require("@services");
class CheckInEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        try {
            let create = await new this.model(payload).save();
            return create;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async searchCheckInUser(params) {
        try {
            let pipeline = [];
            let filterConditions = { $match: { $and: [] } };
            if (params && params.status == _common_1.ENUM.CHECKIN_STATUS.IN)
                filterConditions.$match.$and.push({ 'status': _common_1.ENUM.CHECKIN_STATUS.IN });
            if (params && params.status == _common_1.ENUM.CHECKIN_STATUS.OUT)
                filterConditions.$match.$and.push({ 'status': _common_1.ENUM.CHECKIN_STATUS.OUT });
            if (params && params.propertyId) {
                params.propertyId = params.propertyId.split(",");
                filterConditions.$match.$and.push({ 'property._id': { $in: await _services_1.toObjectId(params.propertyId) } });
            }
            if (params && params.bookingId)
                filterConditions.$match.$and.push({ 'bookingNo': { $regex: params.bookingId, $options: "si" } });
            filterConditions.$match.$and.push({ bookingId: { $exists: true } });
            if (params && params.country)
                filterConditions.$match.$and.push({ 'property.country.id': params.country });
            if (params && params.city)
                filterConditions.$match.$and.push({ 'property.city._id': params.city });
            if (params && params.state)
                filterConditions.$match.$and.push({ 'property.state.id': params.state });
            if (params && params.search)
                filterConditions.$match.$and.push({ 'coworker.name': { $regex: params.search, $options: "si" } });
            if (params.fromDate)
                filterConditions.$match.$and.push({
                    "date": {
                        $gte: _common_1.DATABASE.DATE_CONSTANTS.fromDate(params.fromDate, params.offset)
                    }
                });
            if (params.toDate)
                filterConditions.$match.$and.push({
                    "date": { $lte: _common_1.DATABASE.DATE_CONSTANTS.toDate(params.toDate, params.offset) }
                });
            pipeline.push(filterConditions);
            pipeline.push({ $project: { property: 0 } });
            pipeline.push({ $sort: { createdAt: -1 } });
            return await exports.CheckInV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 10, page: params.page });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
}
exports.CheckInV1 = new CheckInEntity(checkIn_model_1.default);
//# sourceMappingURL=check_in.entity.js.map