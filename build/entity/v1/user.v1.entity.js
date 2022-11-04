"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserV1 = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const base_entity_1 = __importDefault(require("../base.entity"));
const user_model_1 = __importDefault(require("@models/user.model"));
const user_sessions_model_1 = __importDefault(require("@models/user_sessions.model"));
const auth_service_1 = require("../../services/auth.service");
const constant_common_1 = require("../../common/constant.common");
const _services_1 = require("@services");
const user_sessions_model_2 = __importDefault(require("@models/user_sessions.model"));
const _entity_1 = require("@entity");
class UserEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createUser(payload) {
        payload.password = auth_service_1.Auth.hashData(payload.password, constant_common_1.CONSTANT.PASSWORD_HASH_SALT);
        let userData = await new this.model(payload).save();
        let dataToInsertInRedis = {
            "userId": userData._id.toString(),
            "email": payload.email,
            "phoneNo": payload.phone
        };
        await _services_1.redisDOA.setKey("users", JSON.stringify(dataToInsertInRedis));
        return userData.toObject();
    }
    async createUserNew(payload) {
        let adminData = await new this.model(payload).save();
        return adminData.toObject();
    }
    filterUserData(userData) {
        return userData;
    }
    async createNewSession(payload) {
        payload['userId'] = mongoose_1.Types.ObjectId(payload.userId);
        let sessionData = await new user_sessions_model_1.default(payload).save();
        return sessionData.toObject();
    }
    async removePreviousSession(id, multi) {
        if (multi)
            await user_sessions_model_1.default.updateMany({ userId: id, isActive: true }, { isActive: false });
        else
            await user_sessions_model_1.default.updateOne({ _id: id }, { isActive: false });
    }
    async removeSession(id) {
        await user_sessions_model_1.default.updateMany({ _id: id }, { isActive: false });
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
    async checkUserAlreadyExists(payload) {
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
                    status: _common_1.ENUM.USER.STATUS.ACTIVE,
                    $or: conditions
                }
            }
        ]);
        return userData;
    }
    async createUserFromSocialId(payload, userData) {
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
            dataToSave.type = 1,
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
        else {
            let checkUserExistsAsPartner = await _entity_1.EmployeeV1.findMany({ status: _common_1.ENUM.USER.STATUS.ACTIVE, partnerStatus: _common_1.ENUM.USER.STATUS.ACTIVE, $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { partnerId: 1, _id: 0 });
            if (checkUserExistsAsPartner.length > 0) {
                for (let i = 0; i < checkUserExistsAsPartner.length; i++) {
                    let findPartnerHaveActiveFloors = await _entity_1.PartnerFloorV1.findOne({ partnerId: mongoose_1.Types.ObjectId(checkUserExistsAsPartner[i].partnerId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    if (findPartnerHaveActiveFloors) {
                        dataToSave.partnerId = [];
                        for (let i = 0; i < checkUserExistsAsPartner.length; i++)
                            dataToSave.partnerId.push(mongoose_1.Types.ObjectId(checkUserExistsAsPartner[i].partnerId));
                    }
                }
            }
            let response = await new this.model(dataToSave).save();
            let checkUserExistsAsPartnerButInactive = await _entity_1.EmployeeV1.findMany({ $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { partnerId: 1, _id: 0 });
            if (checkUserExistsAsPartnerButInactive.length > 0) {
                await _entity_1.EmployeeV1.updateEntity({ $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { userId: mongoose_1.Types.ObjectId(response._id) }, { multi: true });
            }
            return response;
        }
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
            console.error("Error", error);
            return Promise.reject(error);
        }
    }
    async formatUserResponse(type, payload) {
        try {
            let dataToSend = {};
            switch (type) {
                case constant_common_1.DATABASE.FORMATED_RESPONSE_TYPE.VERIFY_OTP:
                    {
                        dataToSend['_id'] = payload._id;
                        dataToSend['status'] = payload.status;
                        dataToSend['type'] = payload.type;
                        dataToSend['accountStatus'] = payload.accountStatus;
                        dataToSend['name'] = payload.name;
                        dataToSend['email'] = payload.email;
                        dataToSend['authToken'] = payload.authToken;
                        dataToSend['image'] = payload.image;
                        dataToSend['createdAt'] = payload.createdAt;
                        dataToSend['countryCode'] = payload.countryCode;
                        dataToSend['phoneNo'] = payload.phoneNo;
                    }
                    return dataToSend;
            }
        }
        catch (error) {
            console.error("Error", error);
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
    async fetchSearchList(payload) {
        try {
            const { userId } = payload;
            let response = await _entity_1.RecentSearchV1.findMany({ userId: mongoose_1.Types.ObjectId(userId) }, {}, { createdAt: -1 });
            return response;
        }
        catch (error) {
            console.error(`we have an error in user ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async fetchOfferPricingForUser(payload, spaceId) {
        try {
            const { propertyId, fromDate, toDate } = payload;
            let pipeline = [];
            let matchCondition = {};
            matchCondition['propertyId'] = mongoose_1.Types.ObjectId(propertyId);
            matchCondition['status'] = _common_1.ENUM.PROPERTY.STATUS.ACTIVE;
            spaceId ? matchCondition['_id'] = mongoose_1.Types.ObjectId(spaceId) : "";
            let pipelineMatchCondition = {
                "$expr": {
                    "$and": [
                        { "$eq": ["$spaceId", "$$spaceId"] },
                    ]
                }
            };
            if (fromDate && toDate) {
                pipelineMatchCondition['$expr']['$and'] =
                    [
                        { "$eq": ["$spaceId", "$$spaceId"] },
                        { '$gte': [constant_common_1.DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload === null || payload === void 0 ? void 0 : payload.offset), '$startDate'] },
                        { '$lte': [constant_common_1.DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload === null || payload === void 0 ? void 0 : payload.offset), '$endDate'] }
                    ];
            }
            pipeline.push({ '$match': matchCondition }, {
                "$lookup": {
                    "from": "offers",
                    "let": {
                        "spaceId": "$_id"
                    },
                    "pipeline": [
                        {
                            "$match": pipelineMatchCondition
                        },
                        {
                            $project: {
                                priceDetails: {
                                    $filter: {
                                        input: "$priceDetails",
                                        as: "elem",
                                        cond: { $ne: ["$$elem.discountPercentage", 0] }
                                    }
                                }
                            }
                        }
                    ],
                    "as": "offerPricing"
                }
            }, {
                $group: {
                    _id: '$category._id',
                    data: {
                        $addToSet: {
                            offerPricing: "$offerPricing",
                            defaultPrice: "$pricing",
                            price: '$priceDetails',
                            startDate: '$startDate',
                            endDate: '$endDate',
                            isOfferPrice: "$isOfferPrice",
                            seasonName: '$seasonName',
                            spaceId: '$spaceId',
                            category: '$category',
                            subCategory: '$subCategory',
                            include: '$include',
                            capacity: '$capacity',
                            units: '$units',
                            space_Id: '$_id',
                            maxQuantity: '$units',
                            isLowest: '$isLowest',
                            floorNumber: '$floorNumber',
                            floorDescription: '$floorDescription'
                        }
                    }
                }
            });
            let response = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            return response;
        }
        catch (error) {
            console.error(`we have an error in fetching in user entity ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async fectchUserProfileDetails(userId) {
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
                                $and: [
                                    { $expr: { $eq: ["$userId", "$$userId"] } },
                                    { $expr: { $eq: ["$status", _common_1.ENUM.USER.STATUS.ACTIVE] } }
                                ]
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
                    address: { $cond: [{ $not: ["$address"] }, { $literal: "" }, "$address"] },
                    bio: { $cond: [{ $not: ["$bio"] }, { $literal: "" }, "$bio"] },
                    "zipCode": 1,
                    "landmark": 1,
                    "street": 1,
                    "countryCode": 1,
                    "phoneNo": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "dob": { $cond: [{ $not: ["$dob"] }, { $literal: "" }, "$dob"] },
                    "image": 1,
                    "userComapnyDetails": 1,
                    "companyType": 1,
                    "subCompanyType": 1,
                    notificationEnabled: 1,
                    mailNotificationEnabled: 1,
                    profileStatus: 1,
                    passbaseVerification: 1,
                    facebookId: 1,
                    linkedInId: 1,
                    appleId: 1,
                    googleCalendarSyncStatus: 1,
                    outlookCalendarSyncStatus: 1
                }
            });
            let result = await user_model_1.default.aggregate(pipeline);
            if (result && result.length > 0) {
                return result[0];
            }
            else
                return {};
        }
        catch (error) {
            console.error(`we have an error in user ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async fetchUserDeviceToken(userId) {
        try {
            return await user_sessions_model_1.default.distinct("device.token", {
                userId: mongoose_1.Types.ObjectId(userId),
                isActive: true,
                notificationEnabled: _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
            });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async otpExhaustLimit(payload, keyName) {
        try {
            keyName ? keyName = keyName : keyName = `${payload.countryCode}_${payload.phoneNo}_${payload.type}`;
            let keyExist = await _services_1.redisDOA.getFromKey(keyName);
            if (!keyExist)
                await _services_1.redisDOA.insertKeyInRedis(keyName, '5');
            let ttl = await _services_1.redisDOA.getTTL(keyName);
            if (keyExist)
                await _services_1.redisDOA.expireKey(keyName, 300);
            let attemptCountLeft = await _services_1.redisDOA.decrementKeyInRedis(keyName);
            if (attemptCountLeft && attemptCountLeft < 0)
                attemptCountLeft = 0;
            let response = {
                timeToRetryInSeconds: attemptCountLeft < 1 ? ttl : 0,
                attemptCountLeft: attemptCountLeft || attemptCountLeft >= 0 ? Number(attemptCountLeft) : ""
            };
            return await response;
        }
        catch (error) {
            console.error(`we have an error in ${error}`);
        }
    }
    async otpExhaustLimitforgotPassword(payload) {
        try {
            let keyName = `otpForgot_${payload.phoneNo}_${payload.type}`;
            return await this.otpExhaustLimit(payload, keyName);
        }
        catch (error) {
            console.error(`we have an error in ${error}`);
        }
    }
    async otpExhaustLimitVerifyNewPhoneNo(payload) {
        try {
            let keyName = `otpNewPhone_${payload.phoneNo}_${payload.type}`;
            return await this.otpExhaustLimit(payload, keyName);
        }
        catch (error) {
            console.error(`we have an error in otp handling ==> ${error}`);
        }
    }
    async otpExhaustBlockHandling(payload, keyName) {
        try {
            keyName ? keyName = keyName : keyName = `${payload.countryCode}-${payload.phoneNo}-${payload.type}`;
            console.log("keyName----->", keyName);
            const keyExist = await _services_1.redisDOA.getKeyFromRedis(keyName);
            console.log("keyExist---->", keyExist);
            if (keyExist) {
                let timeLeft = await _services_1.redisDOA.getTTL(keyName);
                let minutesLeft = Math.floor(timeLeft / 60);
                let secondsLeft = timeLeft - minutesLeft * 60;
                return { minutesLeft, secondsLeft };
            }
            else
                return `don't block`;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
    async otpExhaustBlockerOtpNewPhone(payload) {
        try {
            let keyName = `${payload.countryCode}-${payload.phoneNo}_-${payload.type}`;
            return await this.otpExhaustBlockHandling(payload, keyName);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
    async updateUserToken(hostId, deviceToken) {
        try {
            return await user_sessions_model_2.default.updateMany({ userId: mongoose_1.Types.ObjectId(hostId), isActive: true }, {
                $set: { 'device.token': deviceToken }
            }, { multi: true });
        }
        catch (error) {
            console.error(`we have an error in updatingDeviceToken ==> ${error}`);
        }
    }
    async updateProfileBadges(profileDetail) {
        try {
            if (profileDetail.subCompanyType == _common_1.ENUM.USER.SUB_COMPANY_TYPE.COMPANY) {
                if (profileDetail.passbaseVerification == 1) {
                    if (!profileDetail.userComapnyDetails.houseNo ||
                        !profileDetail.userComapnyDetails.city ||
                        !profileDetail.userComapnyDetails.country ||
                        !profileDetail.userComapnyDetails.countryCode ||
                        !profileDetail.userComapnyDetails.documents ||
                        !profileDetail.userComapnyDetails.name ||
                        !profileDetail.userComapnyDetails.phoneNo ||
                        !profileDetail.userComapnyDetails.regNo ||
                        !profileDetail.userComapnyDetails.state ||
                        !profileDetail.userComapnyDetails.zipCode ||
                        !profileDetail.dob ||
                        !profileDetail.bio ||
                        !profileDetail.image ||
                        !profileDetail.address) {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(profileDetail._id) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.INTERMEDIATE });
                    }
                    else {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(profileDetail._id) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.ADVANCED });
                    }
                }
                else {
                    if (!profileDetail.userComapnyDetails.houseNo ||
                        !profileDetail.userComapnyDetails.city ||
                        !profileDetail.userComapnyDetails.country ||
                        !profileDetail.userComapnyDetails.countryCode ||
                        !profileDetail.userComapnyDetails.documents ||
                        !profileDetail.userComapnyDetails.name ||
                        !profileDetail.userComapnyDetails.phoneNo ||
                        !profileDetail.userComapnyDetails.regNo ||
                        !profileDetail.userComapnyDetails.state ||
                        !profileDetail.userComapnyDetails.zipCode ||
                        !profileDetail.dob ||
                        !profileDetail.bio ||
                        !profileDetail.image ||
                        !profileDetail.address) {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(profileDetail._id) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.BEGINNER });
                    }
                    else {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(profileDetail._id) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.INTERMEDIATE });
                    }
                }
            }
            if (profileDetail.subCompanyType == _common_1.ENUM.USER.SUB_COMPANY_TYPE.FREELANCER) {
                if (profileDetail.passbaseVerification == 1) {
                    if (!profileDetail.dob || !profileDetail.bio || !profileDetail.image || !profileDetail.address) {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(profileDetail._id) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.INTERMEDIATE });
                    }
                    else {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(profileDetail._id) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.ADVANCED });
                    }
                }
                else {
                    if (!profileDetail.dob || !profileDetail.bio || !profileDetail.image || !profileDetail.address) {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(profileDetail._id) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.BEGINNER });
                    }
                    else {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(profileDetail._id) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.INTERMEDIATE });
                    }
                }
            }
        }
        catch (error) {
            console.error(`we have an error in updatingBadge ==> ${error}`);
        }
    }
    async updateUserIndividualBadge(finalResponse, payload) {
        try {
            if (finalResponse.companyType != 'company') {
                if (finalResponse.passbaseVerification == 1) {
                    if (!finalResponse.dob || !finalResponse.bio || !finalResponse.image || !finalResponse.address) {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.INTERMEDIATE });
                    }
                    else {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.ADVANCED });
                    }
                }
                else {
                    if (!finalResponse.dob || !finalResponse.bio || !finalResponse.image || !finalResponse.address) {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.BEGINNER });
                    }
                    else {
                        await exports.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.INTERMEDIATE });
                    }
                }
            }
        }
        catch (error) {
            console.error(`we have an error while updating individual badge ${error}`);
        }
    }
    async sendAutoRejectPush(bookingId) {
        try {
            const bookingDetail = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingId) });
            let [hostToken, userToken] = await Promise.all([
                _entity_1.HostV1.fetchHostDeviceToken(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.hostId),
                exports.UserV1.fetchUserDeviceToken(bookingDetail.userData.userId)
            ]);
            await Promise.all([
                _services_1.PushNotification.bookingRequestHostReject(hostToken, bookingDetail),
                _services_1.PushNotification.sendBookingRequestUserRejected(userToken, bookingDetail)
            ]);
        }
        catch (error) {
            console.error(`we have an error in sending auto reject error ==> ${error}`);
        }
    }
    async getUserCount(payload) {
        try {
            let pipeline = [];
            let matchCriteria = [];
            matchCriteria.push({ 'status': 'active' });
            if (payload.fromDate)
                matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
            if (payload.toDate)
                matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
            pipeline.push({ $match: { $and: matchCriteria } });
            pipeline.push({ $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0 } });
            let result = await user_model_1.default.aggregate(pipeline);
            result && result.length > 0 ? result = result[0] : result = { count: 0 };
            return result === null || result === void 0 ? void 0 : result.count;
        }
        catch (error) {
            console.error(`we have an error in user ==> ${error}`);
            return Promise.reject(error);
        }
    }
}
exports.UserV1 = new UserEntity(user_model_1.default);
//# sourceMappingURL=user.v1.entity.js.map