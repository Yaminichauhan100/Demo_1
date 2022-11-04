"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
class BaseEntity {
    constructor(model) {
        this.model = model;
        this.model = model;
    }
    async findOne(condition, project = {}, options = {}) {
        return this.model.findOne(condition, project, options).lean().exec();
    }
    async findDistinct(criteria, options) {
        return await this.model.distinct(criteria, options);
    }
    async insertMany(data) {
        return this.model.insertMany(data);
    }
    async createOne(data) {
        return this.model.create(data);
    }
    async findMany(condition, project = {}, sort) {
        if (sort)
            return await this.model.find(condition, project).sort(sort).lean().exec();
        return await this.model.find(condition, project).lean().exec();
    }
    async count(condition) {
        return this.model.countDocuments(condition).lean().exec();
    }
    async distinct(key, condition) {
        return this.model.distinct(key, condition).lean().exec();
    }
    async editEntity(condition, payload, options = {}) {
        if (options.multi) {
            await this.model.updateMany(condition, payload, options).exec();
            return { type: 'MULTI' };
        }
        else {
            if (typeof options.new === 'undefined')
                options.new = true;
            let updatedData = await this.model.findOneAndUpdate(condition, payload, options).lean().exec();
            if (updatedData)
                return { type: 'SINGLE', data: updatedData };
            else
                return { type: 'SINGLE' };
        }
    }
    async updateEntity(condition, payload, options = {}, unset) {
        if (options.multi) {
            await this.model.updateMany(condition, { $set: payload }, options).exec();
            return { type: 'MULTI' };
        }
        else {
            if (typeof options.new === 'undefined')
                options.new = true;
            let updatedData = await this.model.findOneAndUpdate(condition, { $set: payload }, options).lean().exec();
            if (updatedData)
                return { type: 'SINGLE', data: updatedData };
            else
                return { type: 'SINGLE' };
        }
    }
    async removeMultipleFields(condition, payload, options = {}) {
        return await this.model.updateMany(condition, payload, options).exec();
    }
    async updateCronJob(condition, payload, options = {}) {
        if (options.multi) {
            return await this.model.updateMany(condition, { $set: payload }, options).exec();
        }
        else {
            if (typeof options.new === 'undefined')
                options.new = true;
            let updatedData = await this.model.findOneAndUpdate(condition, { $set: payload }, options).lean().exec();
            if (updatedData)
                return { type: 'SINGLE', data: updatedData };
            else
                return { type: 'SINGLE' };
        }
    }
    async update(condition, payload, options = {}) {
        let updateRes = await this.model.updateMany(condition, payload, options);
        return updateRes;
    }
    async updateEntityWithoutIsDelete(condition, payload, options = {}) {
        if (options.multi) {
            await this.model.updateMany(condition, { $set: payload }, options).exec();
            return { type: 'MULTI' };
        }
        else {
            if (typeof options.new === 'undefined')
                options.new = true;
            let updatedData = await this.model.findOneAndUpdate(condition, { $set: payload }, options).lean().exec();
            if (updatedData)
                return { type: 'SINGLE', data: updatedData };
            else
                return { type: 'SINGLE' };
        }
    }
    async updateDocument(condition, payload, options) {
        try {
            let data = await this.model.findOneAndUpdate(condition, { $set: payload }, options).lean().exec();
            return data;
        }
        catch (error) {
            console.error(`we have an error in updateDocument mongo ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async updateManyDocument(condition, payload, options) {
        try {
            let data = await this.model.updateMany(condition, { $set: payload }, options).lean().exec();
            return data;
        }
        catch (error) {
            console.error(`we have an error in updateDocument mongo ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async updateOne(condition, payload, options) {
        let data = await this.model.updateOne(condition, payload, options);
        return data;
    }
    async updatewithIncrementDecrement(condition, payload, options) {
        let data = await this.model.findOneAndUpdate(condition, { $inc: payload }, options).lean().exec();
        return data;
    }
    async updateWithDeleteDocument(condition, payload, removePayload, options) {
        try {
            let data = await this.model.findOneAndUpdate(condition, { $set: payload, $unset: removePayload }, options).lean().exec();
            return data;
        }
        catch (error) {
            console.error(`we have an error updateWithDeleteDocument ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async basicAggregate(pipeline) {
        return this.model.aggregate(pipeline).collation({ locale: 'en', strength: 1 }).exec();
    }
    async cursorAggregate(pipeline, option) {
        return this.model.aggregate(pipeline).cursor(option).exec();
    }
    async paginateAggregate(pipeline, options = {}) {
        if (options.getCount) {
            pipeline.push({
                $facet: {
                    'total': [{ $count: 'count' }],
                    'result': [{ $skip: (options.page - 1) * options.limit }, { $limit: options.limit }]
                }
            });
            let aggregateData = await this.model.aggregate(pipeline).collation({ locale: 'en', strength: 1 }).allowDiskUse(true).exec();
            if (aggregateData.length) {
                if (aggregateData[0].result.length) {
                    let paginationResult = { next: false, page: options.page, total: aggregateData[0].total[0].count };
                    if ((options.limit * options.page) < paginationResult.total) {
                        paginationResult.next = true;
                        paginationResult.limit = options.limit;
                    }
                    paginationResult.result = aggregateData[0].result;
                    paginationResult.limit = options.limit;
                    return paginationResult;
                }
                else
                    return { next: false, result: [], page: options.page, total: aggregateData[0].total.length ? aggregateData[0].total[0].count : 0 };
            }
            else
                throw new Error('Error in paginate aggregation pipeline');
        }
        else {
            if (!options.prePaginated) {
                if (options.range)
                    pipeline.push({ $match: options.range });
                else
                    pipeline.push({ $skip: (options.page - 1) * options.limit });
                pipeline.push({ $limit: options.limit + 1 });
            }
            let aggregateData = await this.model.aggregate(pipeline).collation({ locale: 'en', strength: 1 }).allowDiskUse(true).exec();
            if (aggregateData.length) {
                let paginationResult = { next: false, page: options.page };
                if (aggregateData.length > options.limit) {
                    paginationResult.next = true;
                    paginationResult.result = aggregateData.slice(0, aggregateData.length - 1);
                }
                else
                    paginationResult.result = aggregateData;
                return paginationResult;
            }
            else
                return { next: false, result: [], page: options.page };
        }
    }
    async remove(condition) {
        let removedData = await this.model.deleteOne(condition).exec();
        if (removedData.ok && removedData.n)
            return { success: true };
        else
            return { success: false };
    }
    async removeAll(condition) {
        let removedData = await this.model.deleteMany(condition).exec();
        if (removedData.ok && removedData.n)
            return { success: true };
        else
            return { success: false };
    }
    async bulkWrite(operations, options) {
        return this.model.bulkWrite(operations, options);
    }
    async fetchDeviceToken(userId) {
        try {
            return this.model.distinct('deviceDetails.deviceToken', {
                userId: mongoose_1.Types.ObjectId(userId),
                notificationEnabled: _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE,
                isActive: true
            });
        }
        catch (error) {
            console.error(`we have an error while fetching device tokens ==> ${error}`);
        }
    }
}
exports.default = BaseEntity;
//# sourceMappingURL=base.entity.js.map