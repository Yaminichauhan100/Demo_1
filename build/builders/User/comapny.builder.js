"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditUserProfileAndCompany = exports.EditHostProfileAndCompany = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
exports.EditHostProfileAndCompany = async (payload) => {
    let promise = [];
    let companyData = payload.company;
    let dataToset = { userData: { "userId": mongoose_1.Types.ObjectId(payload.userId) } };
    if (payload.name)
        dataToset.userData.name = payload.name;
    let dataTosetInBookingModule = {};
    if (payload === null || payload === void 0 ? void 0 : payload.fbUrl)
        dataToset.userData.fbUrl = payload.fbUrl;
    if (payload === null || payload === void 0 ? void 0 : payload.twitterUrl)
        dataToset.userData.twitterUrl = payload.twitterUrl;
    if (payload === null || payload === void 0 ? void 0 : payload.linkedinUrl)
        dataToset.userData.linkedinUrl = payload.linkedinUrl;
    if (payload === null || payload === void 0 ? void 0 : payload.instaUrl)
        dataToset.userData.instaUrl = payload.instaUrl;
    if (payload === null || payload === void 0 ? void 0 : payload.bio)
        dataToset.userData.bio = payload.bio;
    if (payload === null || payload === void 0 ? void 0 : payload.slackUrl)
        dataToset.userData.slackUrl = payload.slackUrl;
    if (payload === null || payload === void 0 ? void 0 : payload.youtubeUrl)
        dataToset.userData.youtubeUrl = payload.youtubeUrl;
    if (payload.image) {
        dataToset['userData']['image'] = payload.image;
        dataTosetInBookingModule = { "propertyData.hostName": payload.name, "propertyData.hostImage": payload.image, "propertyData.hostEmail": payload.userData.email };
        _entity_1.BookingV1.updateEntity({ hostId: mongoose_1.Types.ObjectId(payload.userId) }, dataTosetInBookingModule, { multi: true });
    }
    if (payload.company) {
        companyData.userId = mongoose_1.Types.ObjectId(payload.userId);
        companyData.status = _common_1.ENUM.PROPERTY.STATUS.ACTIVE;
        if (companyData.countryId)
            companyData.country = await _entity_1.CountriesV1.findOne({ id: companyData.countryId }, { id: 1, sortname: 1, name: 1, countryId: 1, _id: 1 });
        if (companyData.stateId)
            companyData.state = await _entity_1.AllStatesV1.findOne({ id: companyData.stateId }, { name: 1, stateId: 1, id: 1, _id: 1 });
        if (companyData.cityId)
            companyData.city = await _entity_1.AllCityV1.findOne({ _id: mongoose_1.Types.ObjectId(companyData.cityId) }, { name: 1, iconImage: 1, _id: 1 });
        promise.push(_entity_1.CompanyV1.updateDocument({ userId: mongoose_1.Types.ObjectId(companyData.userId) }, companyData, { upsert: true }));
        await _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { profileCompleted: true });
    }
    dataToset.userData.email = payload.userData.email;
    promise.push(_entity_1.PropertyV1.updateEntity({ "userData.userId": mongoose_1.Types.ObjectId(payload.userId) }, { userData: dataToset.userData }, { multi: true }));
    if (payload.name)
        promise.push(_entity_1.BookingV1.updateEntity({ "hostId": mongoose_1.Types.ObjectId(payload.userId) }, { "propertyData.hostName": payload.name }, { multi: true }));
    promise.push(_entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, payload));
    return promise;
};
exports.EditUserProfileAndCompany = async (payload) => {
    let promise = [];
    let companyData = payload.company;
    if (!payload.name)
        payload.name = payload.userData.name;
    if (!payload.dob)
        payload.dob = payload.userData.dob;
    let dataTosaveForCoworker = {
        name: payload.name,
        image: payload.image,
        email: payload.userData.email,
        phoneNo: payload.userData.phoneNo,
        createdAt: payload.userData.createdAt,
        countryCode: payload.userData.countryCode,
        dob: payload.dob
    };
    if (payload.company) {
        companyData.userId = mongoose_1.Types.ObjectId(payload.userId);
        companyData.status = _common_1.ENUM.PROPERTY.STATUS.ACTIVE;
        if (companyData.countryId)
            companyData.country = await _entity_1.CountriesV1.findOne({ id: companyData.countryId }, { id: 1, sortname: 1, name: 1, countryId: 1, _id: 1 });
        if (companyData.stateId)
            companyData.state = await _entity_1.AllStatesV1.findOne({ id: companyData.stateId }, { name: 1, id: 1, _id: 1 });
        if (companyData.cityId) {
            companyData.city = await _entity_1.AllCityV1.findOne({ _id: mongoose_1.Types.ObjectId(companyData.cityId) }, { name: 1, iconImage: 1, _id: 1 });
        }
        payload.subCompanyType = 0;
        promise.push(_entity_1.CompanyV1.updateDocument({ userId: mongoose_1.Types.ObjectId(companyData.userId) }, companyData, { upsert: true, new: true }));
    }
    else {
        payload.subCompanyType = 1;
        promise.push(_entity_1.CompanyV1.updateDocument({ userId: mongoose_1.Types.ObjectId(payload.userId) }, { status: _common_1.ENUM.USER.STATUS.INACTIVE }));
    }
    promise.push(_entity_1.UserV1.updateDocument({ _id: payload.userId }, payload, { new: true }));
    promise.push(_entity_1.CoworkerV1.updateDocument({ coworkerId: payload.userId }, dataTosaveForCoworker));
    return promise;
};
//# sourceMappingURL=comapny.builder.js.map