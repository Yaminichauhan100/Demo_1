"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const auth_service_1 = require("../../services/auth.service");
const _common_1 = require("@common");
const _services_1 = require("@services");
const _entity_1 = require("@entity");
const host_model_1 = __importDefault(require("@models/host.model"));
const host_session_model_1 = __importDefault(require("@models/host_session.model"));
const _controllers_1 = require("@controllers");
const partner_floor_entity_1 = require("./partner.floor.entity");
const _baseController_1 = require("@baseController");
class HostEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createUser(payload) {
        payload.password = auth_service_1.Auth.hashData(payload.password, _common_1.CONSTANT.PASSWORD_HASH_SALT);
        let userData = await new this.model(payload).save();
        let dataToInsertInRedis = {
            "userId": userData._id.toString(),
            "email": payload.email,
            "phoneNo": payload.phone
        };
        await _services_1.redisDOA.insertKeyInRedis("users", JSON.stringify(dataToInsertInRedis));
        return userData.toObject();
    }
    async updateHostToken(hostId, deviceToken) {
        try {
            return await host_session_model_1.default.updateOne({ userId: mongoose_1.Types.ObjectId(hostId), isActive: true }, {
                $set: { 'device.token': deviceToken }
            });
        }
        catch (error) {
            console.error(`we have an error in updatingDeviceToken ==> ${error}`);
        }
    }
    async createUserNew(payload) {
        let adminData = await new this.model(payload).save();
        return adminData.toObject();
    }
    async fetchHostDeviceToken(hostId) {
        try {
            return await host_session_model_1.default.distinct("device.token", {
                userId: mongoose_1.Types.ObjectId(hostId),
                isActive: true,
                notificationEnabled: _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    filterUserData(userData) {
        return userData;
    }
    async createNewSession(payload) {
        payload.userId = mongoose_1.Types.ObjectId(payload.userId);
        let sessionData = await new host_session_model_1.default(payload).save();
        return sessionData.toObject();
    }
    async removePreviousSession(id, multi) {
        if (multi)
            await host_session_model_1.default.remove({ userId: id, isActive: true });
        else
            await host_session_model_1.default.remove({ _id: id });
    }
    async removeSession(id) {
        await host_session_model_1.default.updateMany({ _id: id }, { isActive: false });
    }
    async blockUser(userId, actionDir) {
        userId = mongoose_1.Types.ObjectId(userId);
        let updatedUser = await this.updateEntity({ _id: userId }, {
            isActive: !actionDir,
            status: actionDir ? _common_1.ENUM.USER.STATUS.BLOCK : _common_1.ENUM.USER.STATUS.ACTIVE
        });
        if (updatedUser.data) {
            if (actionDir)
                await this.removePreviousSession(userId, true);
            return { success: true };
        }
        else
            return { success: false };
    }
    async getAllUserTokens(payload) {
        let matchCondition = { 'device.token': { $exists: true, $ne: '' }, status: _common_1.ENUM.USER.STATUS.ACTIVE, };
        if (payload.usersList)
            matchCondition['_id'] = { $in: payload.usersList };
        let userData = await this.basicAggregate([
            { $match: matchCondition },
            { $group: { _id: null, tokens: { $push: '$device.token' } } }
        ]);
        if (userData.length)
            return userData[0].tokens;
        else
            return [];
    }
    async checkHostAlreadyExists(payload) {
        let conditions = [];
        let matchCondition;
        if (payload.resetToken && payload.resetToken != '')
            conditions.push({ resetToken: payload.resetToken });
        if (payload.email && payload.email != '')
            conditions.push({ email: payload.email });
        if (payload.type && payload.type != '')
            conditions.push({ type: payload.type });
        if (payload.resetPasswordToken && payload.resetPasswordToken != '')
            conditions.push({ resetPasswordToken: payload.resetPasswordToken });
        if (payload.emailVerificationToken && payload.emailVerificationToken != '')
            conditions.push({ emailVerificationToken: payload.emailVerificationToken });
        if (payload.phoneNo && payload.phoneNo != '' && payload.countryCode && payload.countryCode != '')
            conditions.push({ phoneNo: payload.phoneNo, countryCode: payload.countryCode });
        if (payload.userId)
            conditions.push({ _id: payload.userId });
        if (payload.type && payload.type != '')
            matchCondition = {
                status: _common_1.ENUM.USER.STATUS.ACTIVE,
                $and: conditions,
            };
        else
            matchCondition = {
                status: _common_1.ENUM.USER.STATUS.ACTIVE,
                $or: conditions,
            };
        if (conditions.length) {
            let userData = await this.basicAggregate([
                {
                    $match: matchCondition
                }
            ]);
            return userData;
        }
        return [];
    }
    async checkSocialIdExists(payload) {
        let conditions = [];
        if (payload && payload.email) {
            conditions.push({ email: payload.email });
        }
        else {
            if (payload.socialType == _common_1.ENUM.LOGIN_TYPE.FACEBOOK)
                conditions.push({ facebookId: payload.socialId });
            if (payload.socialType == _common_1.ENUM.LOGIN_TYPE.LINKEDIN)
                conditions.push({ linkedInId: payload.socialId });
            if (payload.socialType == _common_1.ENUM.LOGIN_TYPE.APPLE)
                conditions.push({ appleId: payload.socialId });
        }
        let userData = await this.basicAggregate([
            {
                $match: {
                    $or: conditions
                }
            }
        ]);
        return userData;
    }
    async createHostFromSocialId(payload, userData) {
        userData && userData.length > 0 ? userData = userData[0] : userData = undefined;
        let dataToSave = {
            name: payload.name
        };
        if (payload.email && payload.email != '') {
            dataToSave.email = payload.email;
            dataToSave.emailVerified = true;
        }
        ;
        if (payload.phoneNo)
            dataToSave.phoneNo = payload.phoneNo;
        dataToSave.status = userData && userData.status ? userData.status : 'active',
            dataToSave.type = 2,
            dataToSave.accountStatus = userData && userData.accountStatus ? userData.accountStatus : 'unverified',
            dataToSave.profileCompleted = userData && userData.profileCompleted ? userData.profileCompleted : false;
        dataToSave.phoneVerified = userData && userData.phoneVerified ? userData.phoneVerified : false;
        if (payload.countryCode)
            dataToSave.countryCode = payload.countryCode;
        if (payload.image)
            dataToSave.image = payload.image;
        if (payload.socialType == _common_1.ENUM.LOGIN_TYPE.FACEBOOK)
            dataToSave.facebookId = payload.socialId;
        if (payload.socialType == _common_1.ENUM.LOGIN_TYPE.LINKEDIN)
            dataToSave.linkedInId = payload.socialId;
        if (payload.socialType == _common_1.ENUM.LOGIN_TYPE.APPLE)
            dataToSave.appleId = payload.socialId;
        if (userData && userData._id)
            return await this.updateDocument({ _id: userData._id }, dataToSave, { upsert: true, new: true, lean: true });
        else
            return await new this.model(dataToSave).save();
    }
    async verifyUserPhone(userId) {
        let update = {
            phoneVerified: true,
            otp: null
        };
        return await this.updateDocument({ _id: userId }, update);
    }
    async mergeUserAccount(payload, userData) {
        try {
            let dataToUpdate = {};
            if (payload.platform == _common_1.ENUM.LOGIN_TYPE.FACEBOOK)
                dataToUpdate = { facebookId: payload.socialId };
            if (payload.platform == _common_1.ENUM.LOGIN_TYPE.LINKEDIN)
                dataToUpdate = { linkedInId: payload.socialId };
            return await this.updateDocument({ _id: userData._id }, dataToUpdate);
        }
        catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    removeUnnecessaryData(data) {
        delete (data.password);
        delete (data.otp);
        delete (data.otpExpiry);
        delete (data.resetToken);
        return data;
    }
    async formatUserResponse(type, payload) {
        try {
            let dataToSend = {};
            switch (type) {
                case _common_1.DATABASE.FORMATED_RESPONSE_TYPE.VERIFY_OTP:
                    {
                        dataToSend['_id'] = payload._id;
                        dataToSend['status'] = payload.status;
                        dataToSend['type'] = payload.type;
                        dataToSend['accountStatus'] = payload.accountStatus;
                        dataToSend['name'] = payload.name;
                        dataToSend['email'] = payload.email;
                        dataToSend['authToken'] = payload.authToken;
                        dataToSend['createdAt'] = payload.createdAt;
                        dataToSend['countryCode'] = payload.countryCode;
                        dataToSend['phoneNo'] = payload.phoneNo;
                    }
                    return dataToSend;
            }
        }
        catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    async addPropertySpace(payload) {
        try {
            payload['propertyId'] = mongoose_1.Types.ObjectId(payload.propertyId);
            payload['category'] = payload.category;
            payload['subCategory'] = payload.subCategory;
            payload['pricing'] = {
                hourly: payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.HOURLY ? payload.pricing.hourly : 0,
                daily: payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM ? payload.pricing.daily : 0,
                monthly: payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY ? payload.pricing.monthly : 0
            };
            payload['propertyName'] = payload.propertyName;
            const spaceData = await _entity_1.PropertySpaceV1.createPropertySpace(payload);
            await this.updateSpaceStartingPrice(spaceData, payload.propertyId);
            return spaceData;
        }
        catch (error) {
            console.error(`we have an error in addPropertySpace method ==>`, error);
        }
    }
    async updateSpaceStartingPrice(spaceData, propertyId) {
        try {
            if (spaceData) {
                let spaceDetails = await _entity_1.PropertySpaceV1.findMany({ propertyId: mongoose_1.Types.ObjectId(propertyId), status: _common_1.ENUM.PROPERTY_SPACE.STATUS.ACTIVE }, { pricing: 1 });
                if (spaceDetails.length > 0) {
                    let startingPrice = Number.POSITIVE_INFINITY;
                    let temp;
                    let startingPriceType;
                    let spaceMap = {};
                    for (let i = spaceDetails.length - 1; i >= 0; i--) {
                        if (spaceDetails[i].pricing.hourly) {
                            temp = spaceDetails[i].pricing.hourly;
                            startingPriceType = _common_1.ENUM.PROPERTY.PRICING_TYPE.HOURLY;
                        }
                        else {
                            if (spaceDetails[i].pricing.daily) {
                                temp = spaceDetails[i].pricing.daily;
                                startingPriceType = _common_1.ENUM.PROPERTY.PRICING_TYPE.CUSTOM;
                            }
                            else if (spaceDetails[i].pricing.monthly) {
                                temp = spaceDetails[i].pricing.monthly;
                                startingPriceType = _common_1.ENUM.PROPERTY.PRICING_TYPE.MONTHLY;
                            }
                        }
                        if (temp < startingPrice) {
                            startingPrice = temp;
                            startingPriceType = startingPriceType;
                            spaceMap['spaceId'] = spaceDetails[i]._id;
                            spaceMap['isLowest'] = 1;
                        }
                    }
                    let criteria = { _id: mongoose_1.Types.ObjectId(propertyId) };
                    let dataToUpdate = { startingPrice: startingPrice, startingPriceType: startingPriceType };
                    await Promise.all([
                        _entity_1.PropertyV1.updateDocument(criteria, dataToUpdate),
                        _entity_1.PropertySpaceV1.updateDocument({ _id: mongoose_1.Types.ObjectId(spaceMap === null || spaceMap === void 0 ? void 0 : spaceMap.spaceId) }, { isLowest: 1 }),
                        _entity_1.PropertySpaceV1.updateDocument({ _id: { $ne: mongoose_1.Types.ObjectId(spaceMap === null || spaceMap === void 0 ? void 0 : spaceMap.spaceId) }, propertyId: mongoose_1.Types.ObjectId(propertyId) }, { isLowest: 0 })
                    ]);
                }
            }
            return;
        }
        catch (error) {
            console.error(`we have an error while updatingSpace starting Price==> ${error}`);
            throw error;
        }
    }
    async partnerEmployeeUnitsCheck(floorDetail, res, next) {
        var _a;
        try {
            const partnerTotalOccupiedUnits = await partner_floor_entity_1.PartnerFloorV1.basicAggregate([
                { '$match': { spaceId: mongoose_1.Types.ObjectId(floorDetail.floorId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE } },
                { '$project': { employeeUnits: 1, spaceId: 1 } },
                {
                    $group: {
                        _id: '$spaceId',
                        totalEmployeeUnits: { $sum: '$employeeUnits' }
                    }
                }
            ]);
            if ((partnerTotalOccupiedUnits === null || partnerTotalOccupiedUnits === void 0 ? void 0 : partnerTotalOccupiedUnits.length) && (floorDetail === null || floorDetail === void 0 ? void 0 : floorDetail.units.employee) < ((_a = partnerTotalOccupiedUnits[0]) === null || _a === void 0 ? void 0 : _a.totalEmployeeUnits)) {
                return _baseController_1.handleEntityResponse.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BAD_EMPLOYEE_REQUEST);
            }
        }
        catch (error) {
            console.error(`we have an error while fetching partnerEmployeeUnitsCheck ==> ${error}`);
            next(error);
        }
    }
    async updatePropertySpace(payload, res, next) {
        var _a, _b, _c, _d, _e, _f;
        try {
            if (((_a = payload === null || payload === void 0 ? void 0 : payload.pricing) === null || _a === void 0 ? void 0 : _a.daily) || ((_b = payload === null || payload === void 0 ? void 0 : payload.pricing) === null || _b === void 0 ? void 0 : _b.monthly) || (payload === null || payload === void 0 ? void 0 : payload.yearly) || ((_c = payload === null || payload === void 0 ? void 0 : payload.pricing) === null || _c === void 0 ? void 0 : _c.hourly)) {
                payload.pricing = {
                    hourly: payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.HOURLY ? payload.pricing.hourly : 0,
                    daily: payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM ? payload.pricing.daily : 0,
                    monthly: payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY ? payload.pricing.monthly : 0,
                };
            }
            const spaceData = await _entity_1.PropertySpaceV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.floorId) }, payload, { new: true, upsert: true, setDefaultsOnInsert: true });
            if (((_d = payload === null || payload === void 0 ? void 0 : payload.pricing) === null || _d === void 0 ? void 0 : _d.daily) || ((_e = payload === null || payload === void 0 ? void 0 : payload.pricing) === null || _e === void 0 ? void 0 : _e.monthly) || (payload === null || payload === void 0 ? void 0 : payload.yearly) || ((_f = payload === null || payload === void 0 ? void 0 : payload.pricing) === null || _f === void 0 ? void 0 : _f.hourly)) {
                this.updateSpaceStartingPrice(spaceData, payload.propertyId);
            }
            await partner_floor_entity_1.PartnerFloorV1.updateEntity({ spaceId: mongoose_1.Types.ObjectId(payload.floorId) }, payload, { multi: true });
            return spaceData;
        }
        catch (error) {
            console.error(`we have an error in updatePropertySpace ==>`, error);
            next(error);
        }
    }
    async fetchSpaceDetail(spaceId) {
        try {
            const { isOfferPrice } = await _entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(spaceId) }, { isOfferPrice: 1 });
            switch (isOfferPrice) {
                case _common_1.ENUM.IS_OFFER_PRICE.TRUE: {
                    let spaceDetail = await _entity_1.PropertySpaceV1.basicAggregate([
                        {
                            "$match": {
                                "status": _common_1.ENUM.PROPERTY.STATUS.ACTIVE,
                                _id: mongoose_1.Types.ObjectId(spaceId),
                                isOfferPrice: _common_1.ENUM.IS_OFFER_PRICE.TRUE
                            }
                        },
                        {
                            $project: {
                                pricing: 1,
                                capacity: 1,
                                units: 1,
                                subCategory: 1,
                                category: 1,
                                spaceId: 1,
                                propertyId: 1,
                                images: 1,
                                isOfferPrice: 1,
                                include: 1,
                                propertyName: 1
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
                                                "$eq": ["$spaceId", "$$spaceId"]
                                            }
                                        }
                                    }
                                ],
                                "as": "offerPrice"
                            }
                        },
                        {
                            '$lookup': {
                                from: 'booking',
                                let: {
                                    propertyId: '$propertyId',
                                    spaceId: '$_id'
                                },
                                pipeline: [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    { '$eq': ['$propertyData.propertyId', '$$propertyId'] },
                                                    { '$eq': ['$spaceId', '$$spaceId'] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: 'bookingArray'
                            }
                        },
                        {
                            $project: {
                                dailyPrice: "$pricing.daily",
                                monthlyPrice: "$pricing.monthly",
                                yearlyPrice: "$pricing.yearly",
                                hourlyPrice: "$pricing.hourly",
                                capacity: 1,
                                units: 1,
                                subCategoryId: "$subCategory._id",
                                categoryId: "$category._id",
                                categoryName: "$category.name",
                                subCategoryName: "$subCategory.name",
                                spaceId: 1,
                                propertyId: 1,
                                propertyName: 1,
                                images: 1,
                                isOfferPrice: 1,
                                offerPrice: 1,
                                include: 1,
                                selectedMaxValue: 1,
                                selectedMinValue: 1,
                                totalBookingCount: {
                                    $size: {
                                        $filter: {
                                            input: "$bookingArray",
                                            as: "booking",
                                            cond: { $ne: ["$$booking.bookingStatus", 5] }
                                        }
                                    }
                                }
                            }
                        }
                    ]);
                    return spaceDetail;
                }
                case _common_1.ENUM.IS_OFFER_PRICE.FALSE: {
                    let spaceDetail = await _entity_1.PropertySpaceV1.basicAggregate([
                        {
                            $match: {
                                status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE,
                                _id: mongoose_1.Types.ObjectId(spaceId),
                                isOfferPrice: _common_1.ENUM.IS_OFFER_PRICE.FALSE
                            }
                        },
                        {
                            '$lookup': {
                                from: 'booking',
                                let: {
                                    propertyId: '$propertyId',
                                    spaceId: '$_id'
                                },
                                pipeline: [
                                    {
                                        '$match': {
                                            '$expr': {
                                                '$and': [
                                                    { '$eq': ['$propertyData.propertyId', '$$propertyId'] },
                                                    { '$eq': ['$spaceId', '$$spaceId'] }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: 'bookingArray'
                            }
                        },
                        {
                            $project: {
                                dailyPrice: "$pricing.daily",
                                monthlyPrice: "$pricing.monthly",
                                yearlyPrice: "$pricing.yearly",
                                hourlyPrice: "$pricing.hourly",
                                capacity: 1,
                                units: 1,
                                subCategoryId: "$subCategory._id",
                                categoryId: "$category._id",
                                categoryName: "$category.name",
                                subCategoryName: "$subCategory.name",
                                spaceId: 1,
                                propertyId: 1,
                                images: 1,
                                isOfferPrice: 1,
                                offerPrice: { $literal: [] },
                                include: 1,
                                propertyName: 1,
                                totalBookingCount: {
                                    $size: {
                                        $filter: {
                                            input: "$bookingArray",
                                            as: "booking",
                                            cond: { $ne: ["$$booking.bookingStatus", 5] }
                                        }
                                    }
                                }
                            }
                        }
                    ]);
                    return spaceDetail;
                }
                default:
                    break;
            }
        }
        catch (error) {
            console.error(`we have an error in host entity ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async fectchHostProfileDetails(userId) {
        try {
            let pipeline = [];
            pipeline.push({
                $match: {
                    _id: mongoose_1.Types.ObjectId(userId)
                }
            }, {
                "$lookup": {
                    "from": "user_company_details",
                    "let": { "userId": "$_id" },
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$eq": ["$userId", "$$userId"]
                                }
                            }
                        },
                    ],
                    "as": "userComapnyDetails"
                }
            }, {
                "$unwind": {
                    "path": "$userComapnyDetails",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    "_id": 1,
                    "status": 1,
                    "type": 1,
                    "emailVerified": 1,
                    "accountStatus": 1,
                    "profileCompleted": 1,
                    "name": 1,
                    "email": 1,
                    "address": 1,
                    "zipCode": 1,
                    "landmark": 1,
                    "street": 1,
                    "countryCode": 1,
                    "phoneNo": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "bio": 1,
                    "dob": 1,
                    "image": 1,
                    "userComapnyDetails": 1,
                    notificationEnabled: 1,
                    mailNotificationEnabled: 1,
                    twitterUrl: 1,
                    fbUrl: 1,
                    linkedinUrl: 1,
                    instaUrl: 1,
                    slackUrl: 1,
                    youtubeUrl: 1,
                    permissions: 1,
                    isCohost: 1,
                    facebookId: 1,
                    linkedInId: 1,
                    appleId: 1,
                    commissionAmount: 1
                }
            });
            let result = await host_model_1.default.aggregate(pipeline);
            if (result && result.length > 0)
                return result[0];
            else
                return {};
        }
        catch (error) {
            console.error(`we have an error in user ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async createCohost(payload) {
        payload.isCohost = 1;
        payload.hostId = payload.userId;
        let password = await this.randomPassword(8);
        payload.password = auth_service_1.Auth.hashData(password, _common_1.CONSTANT.PASSWORD_HASH_SALT);
        let hostData = await new this.model(payload).save();
        await exports.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { $push: { coHost: mongoose_1.Types.ObjectId(hostData._id) } });
        hostData = {
            _id: hostData._id,
            permissions: hostData.permissions,
            name: hostData.name,
            countryCode: hostData.countryCode,
            phoneNo: hostData.phoneNo,
            password: password,
            email: hostData.email
        };
        return hostData;
    }
    async randomPassword(len) {
        var length = (len) ? (len) : (10);
        var entity1, entity2, entity3, hold;
        var string = "abcdefghijklmnopqrstuvwxyz";
        var numeric = '0123456789';
        var punctuation = '!@';
        var password = "";
        var character = "";
        while (password.length < length) {
            entity1 = Math.ceil(string.length * Math.random() * Math.random());
            entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
            entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
            hold = string.charAt(entity1);
            hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
            character += hold;
            character += numeric.charAt(entity2);
            character += punctuation.charAt(entity3);
            password = character;
        }
        password = password.split('').sort(function () { return 0.5 - Math.random(); }).join('');
        return password.substr(0, len);
    }
    async initiateRefund(bookingId, bookingDetail) {
        try {
            const differenceTime = Math.abs((bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.toDate) - (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.fromDate));
            const numberOfDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));
            let criteria = await _entity_1.BookingV1.cancellationCriteria(bookingDetail, numberOfDays);
            let amountToRefund;
            if (criteria) {
                (criteria === null || criteria === void 0 ? void 0 : criteria.PERCENT_AMOUNT) > 0 ? amountToRefund = criteria === null || criteria === void 0 ? void 0 : criteria.PERCENT_AMOUNT : {};
            }
            await _controllers_1.PaymentController.refund(bookingId, amountToRefund);
        }
        catch (error) {
            console.error(`we have an error in initiateRefund ==> ${error}`);
        }
    }
}
exports.HostV1 = new HostEntity(host_model_1.default);
//# sourceMappingURL=host.v1.entity.js.map