"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitMQController = void 0;
const user_sessions_model_1 = __importDefault(require("@models/user_sessions.model"));
const host_session_model_1 = __importDefault(require("@models/host_session.model"));
const connection_1 = require("./connection");
const rabbitMQConst_1 = require("./rabbitMQConst");
const _common_1 = require("@common");
const _services_1 = require("@services");
const allCities_model_1 = __importDefault(require("@models/allCities.model"));
class RabbitMQController {
    async publisherToSendPushToAllUser(payload) {
        var _a;
        try {
            let pubArray = [];
            let batchSize = _common_1.CONSTANT.NOTIFICATION_BATCH_SIZE;
            let criteria = [];
            let matchCriteria = {
                $match: {
                    $and: [
                        { "isActive": true },
                        { "notificationEnabled": _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE }
                    ]
                }
            };
            matchCriteria.$match.$and.push({ 'isActive': true, });
            if (payload && ((_a = payload === null || payload === void 0 ? void 0 : payload.userList) === null || _a === void 0 ? void 0 : _a.length) > 0)
                matchCriteria.$match.$and.push({ 'userId': { $in: await _services_1.toObjectId(payload.userList) } });
            if (payload && payload.recipientType == _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.APP)
                matchCriteria.$match.$and.push({ 'device.type': { $ne: 3 } });
            if (payload && payload.recipientType == _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.WEB)
                matchCriteria.$match.$and.push({ 'device.type': { $eq: 3 } });
            criteria.push(matchCriteria);
            criteria.push({
                $group: {
                    _id: '$device.token',
                }
            });
            let stream = user_sessions_model_1.default.aggregate(criteria).cursor({ batchSize: batchSize }).exec();
            let count = 0;
            let subArray = [];
            console.log(count);
            stream.on('data', async function (doc) {
                doc && doc._id ? subArray.push(doc._id) : '';
                count++;
                if (subArray && subArray.length == batchSize) {
                    connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_USER, Buffer.from(JSON.stringify({ token: subArray, payload: payload })));
                    pubArray = pubArray.concat(subArray);
                    count = 0;
                    subArray = [];
                }
            });
            stream.on('end', async function (doc) {
                doc && doc._id ? subArray.push(doc._id) : '';
                if (subArray && subArray.length > 0) {
                    connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_USER, Buffer.from(JSON.stringify({ token: subArray, payload: payload })));
                    return {};
                }
                return;
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async publisherToInsertNotificationToAllUserIndb(notificationData) {
        var _a;
        try {
            let pubArray = [];
            let batchSize = _common_1.CONSTANT.NOTIFICATION_BATCH_SIZE;
            let criteria = [];
            let matchCriteria = {
                $match: {
                    $and: [
                        { "isActive": true },
                        { "notificationEnabled": _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE }
                    ]
                }
            };
            matchCriteria.$match.$and.push({ 'isActive': true, });
            if (notificationData && ((_a = notificationData === null || notificationData === void 0 ? void 0 : notificationData.userList) === null || _a === void 0 ? void 0 : _a.length) > 0)
                matchCriteria.$match.$and.push({ 'userId': { $in: await _services_1.toObjectId(notificationData.userList) } });
            if (notificationData && notificationData.recipientType == _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.APP)
                matchCriteria.$match.$and.push({ 'device.type': { $ne: 3 } });
            if (notificationData && notificationData.recipientType == _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.WEB)
                matchCriteria.$match.$and.push({ 'device.type': { $eq: 3 } });
            criteria.push(matchCriteria);
            criteria.push({
                $group: {
                    _id: {
                        receiverId: '$userId',
                        type: { $literal: 4 },
                        title: { $literal: notificationData.title },
                        message: { $literal: notificationData.description },
                        image: { $literal: notificationData.image },
                        status: { $literal: 'active' },
                        isRead: { $literal: false },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                }
            });
            criteria.push({ $replaceRoot: { newRoot: "$_id" } });
            let stream = user_sessions_model_1.default.aggregate(criteria).cursor({ batchSize: batchSize }).exec();
            let count = 0;
            let subArray = [];
            console.log(count);
            stream.on('data', async function (doc) {
                subArray.push(doc);
                count++;
                if (subArray && subArray.length == batchSize) {
                    await connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_USER, Buffer.from(JSON.stringify(subArray)));
                    pubArray = pubArray.concat(subArray);
                    count = 0;
                    subArray = [];
                }
            });
            stream.on('end', async function (doc) {
                if (subArray && subArray.length > 0) {
                    await connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_USER, Buffer.from(JSON.stringify(subArray)));
                    return {};
                }
                return;
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async publisherToSendPushToAllHost(payload) {
        var _a;
        try {
            let pubArray = [];
            let batchSize = _common_1.CONSTANT.NOTIFICATION_BATCH_SIZE;
            let criteria = [];
            let matchCriteria = {
                $match: {
                    $and: [
                        { "isActive": true },
                        { "notificationEnabled": _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE }
                    ]
                }
            };
            matchCriteria.$match.$and.push({ 'isActive': true, });
            if (payload && ((_a = payload === null || payload === void 0 ? void 0 : payload.hostList) === null || _a === void 0 ? void 0 : _a.length) > 0)
                matchCriteria.$match.$and.push({ 'userId': { $in: await _services_1.toObjectId(payload.hostList) } });
            if (payload && payload.recipientType == _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.APP)
                matchCriteria.$match.$and.push({ 'device.type': { $ne: 3 } });
            if (payload && payload.recipientType == _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.WEB)
                matchCriteria.$match.$and.push({ 'device.type': { $eq: 3 } });
            criteria.push(matchCriteria);
            criteria.push({
                $group: {
                    _id: '$device.token',
                }
            });
            let stream = await host_session_model_1.default.aggregate(criteria).cursor({ batchSize: batchSize }).exec();
            let count = 0;
            let subArray = [];
            console.log(count);
            stream.on('data', async function (doc) {
                doc && doc._id ? subArray.push(doc._id) : '';
                count++;
                if (subArray && subArray.length == batchSize) {
                    await connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_HOST, Buffer.from(JSON.stringify({ token: subArray, payload: payload })));
                    pubArray = pubArray.concat(subArray);
                    count = 0;
                    subArray = [];
                }
            });
            stream.on('end', async function (doc) {
                doc && doc._id ? subArray.push(doc._id) : '';
                if (subArray && subArray.length > 0) {
                    await connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.PUSH_NOTIFICATION_HOST, Buffer.from(JSON.stringify({ token: subArray, payload: payload })));
                    return {};
                }
                return;
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async publisherToInsertNotificationToAllHostIndb(notificationData) {
        var _a;
        try {
            let pubArray = [];
            let batchSize = _common_1.CONSTANT.NOTIFICATION_BATCH_SIZE;
            let criteria = [];
            let matchCriteria = {
                $match: {
                    $and: [
                        { "isActive": true },
                        { "notificationEnabled": _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE }
                    ]
                }
            };
            matchCriteria.$match.$and.push({ 'isActive': true, });
            if (notificationData && ((_a = notificationData === null || notificationData === void 0 ? void 0 : notificationData.hostList) === null || _a === void 0 ? void 0 : _a.length) > 0)
                matchCriteria.$match.$and.push({ 'userId': { $in: await _services_1.toObjectId(notificationData.hostList) } });
            criteria.push(matchCriteria);
            criteria.push({
                $group: {
                    _id: {
                        receiverId: '$userId',
                        type: { $literal: 4 },
                        title: { $literal: notificationData.title },
                        message: { $literal: notificationData.description },
                        image: { $literal: notificationData.image },
                        status: { $literal: 'active' },
                        isRead: { $literal: false },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                }
            });
            criteria.push({ $replaceRoot: { newRoot: "$_id" } });
            let stream = host_session_model_1.default.aggregate(criteria).cursor({ batchSize: batchSize }).exec();
            let count = 0;
            let subArray = [];
            console.log(count);
            stream.on('data', async function (doc) {
                subArray.push(doc);
                count++;
                if (subArray && subArray.length == batchSize) {
                    connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_HOST, Buffer.from(JSON.stringify(subArray)));
                    pubArray = pubArray.concat(subArray);
                    count = 0;
                    subArray = [];
                }
            });
            stream.on('end', async function (doc) {
                if (subArray && subArray.length > 0) {
                    connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.DATABASE_INSERT_HOST, Buffer.from(JSON.stringify(subArray)));
                    return {};
                }
                return;
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async publisherToInsertAllCitiesIndb(notificationData) {
        try {
            let pubArray = [];
            let batchSize = 20000;
            let criteria = [
                {
                    '$lookup': {
                        from: 'countries',
                        let: { countryId: "$country_id" },
                        "pipeline": [
                            {
                                '$match': {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$id', '$$countryId'] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'countryData'
                    }
                },
                {
                    '$unwind': '$countryData'
                },
                {
                    '$lookup': {
                        from: 'states',
                        let: { stateId: "$state_id" },
                        pipeline: [
                            {
                                '$match': {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$id', '$$stateId'] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'stateData'
                    }
                },
                {
                    '$unwind': '$stateData'
                },
                {
                    '$project': {
                        _id: 0,
                        isFeatured: {
                            '$literal': false
                        },
                        status: {
                            '$literal': 'inActive'
                        },
                        isDelete: {
                            '$literal': false
                        },
                        countryId: '$country_id',
                        stateId: '$state_id',
                        cityName: '$name',
                        countryName: '$countryData.name',
                        stateName: '$stateData.name'
                    }
                }
            ];
            let stream = await allCities_model_1.default.aggregate(criteria).cursor({ batchSize: batchSize }).exec();
            let count = 0;
            console.log(count);
            let subArray = [];
            stream.on('data', async function (doc) {
                try {
                    subArray.push(doc);
                    count++;
                    if (subArray && subArray.length === batchSize) {
                        connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.BULK_INSERT_DATABASE, Buffer.from(JSON.stringify(subArray)));
                        pubArray = pubArray.concat(subArray);
                        count = 0;
                        subArray = [];
                    }
                }
                catch (error) {
                    console.error(`we have an error ==> ${error}`);
                }
            });
            stream.on('end', async function (doc) {
                if (subArray && subArray.length > 0) {
                    connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.BULK_INSERT_DATABASE, Buffer.from(JSON.stringify(subArray)));
                    return {};
                }
                return;
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async publisherToInsertBulkEmployee(fileData, partnerId) {
        try {
            connection_1.channel.sendToQueue(rabbitMQConst_1.rabbitMQConst.INSERT_BULK_EMPLOYEE, Buffer.from(JSON.stringify({ fileData: fileData, partnerId: partnerId })));
            return;
        }
        catch (error) {
            console.log("error in send que for bulk insert:-", error);
        }
    }
}
exports.rabbitMQController = new RabbitMQController();
//# sourceMappingURL=publisher.js.map