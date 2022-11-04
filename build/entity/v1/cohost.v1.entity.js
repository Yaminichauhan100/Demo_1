"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoHostV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const cohost_model_1 = __importDefault(require("@models/cohost.model"));
const _baseController_1 = require("@baseController");
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
const host_v1_entity_1 = require("./host.v1.entity");
const property_details_entity_1 = require("./property.details.entity");
const city_v1_entity_1 = require("./city.v1.entity");
const states_v1_entity_1 = require("./states.v1.entity");
const countries_v1_entity_1 = require("./countries.v1.entity");
class CoworkersEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async addTerritory(payload, userId) {
        let coHostId = mongoose_1.Types.ObjectId(payload.cohostId);
        payload.hostId = mongoose_1.Types.ObjectId(userId);
        if (payload.propertyId && payload.propertyId.length > 0)
            payload.accessLevel = 4;
        else if (payload.cityId && payload.cityId.length > 0)
            payload.accessLevel = 3;
        else if (payload.stateId && payload.stateId.length > 0)
            payload.accessLevel = 2;
        else if (payload.countryId && payload.countryId.length > 0)
            payload.accessLevel = 1;
        await host_v1_entity_1.HostV1.updateDocument({ _id: coHostId }, { accessLevel: payload.accessLevel });
        let checkIfOnlyCountryLevelDataPresent = await exports.CoHostV1.findOne({ cohostId: coHostId, accessLevel: 1 });
        if (checkIfOnlyCountryLevelDataPresent)
            await Promise.all([
                property_details_entity_1.PropertyV1.update({ "country.id": payload.countryId, userId: payload.hostId }, { $pull: { coHostId: coHostId } }),
                exports.CoHostV1.remove({ cohostId: coHostId, "country.id": payload.countryId })
            ]);
        if (payload.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.COUNTRY) {
            let country = [];
            let countryName = await countries_v1_entity_1.CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 });
            for (let i = 0; i < countryName.length; i++)
                country.push(countryName[i]);
            payload.country = country;
            let countryData = await exports.CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "accessLevel": { $ne: 1 } });
            if (!countryData) {
                let cohostData = await Promise.all([
                    exports.CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId } }, payload, { upsert: true, new: true }),
                    property_details_entity_1.PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                ]);
                return cohostData[0];
            }
            else {
                await exports.CoHostV1.removeAll({ cohostId: coHostId, "country.id": { $in: payload.countryId } });
                let cohostData = await Promise.all([
                    exports.CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId } }, payload, { upsert: true, new: true }),
                    property_details_entity_1.PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                ]);
                return cohostData[0];
            }
        }
        else if (payload.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.STATE) {
            let country = [];
            let state = [];
            let [stateName, countryName] = await Promise.all([
                states_v1_entity_1.StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, id: 1, _id: 0 }),
                countries_v1_entity_1.CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 })
            ]);
            for (let i = 0; i < stateName.length; i++)
                state.push(stateName[i]);
            for (let i = 0; i < countryName.length; i++)
                country.push(countryName[i]);
            payload.state = state;
            payload.country = country;
            payload.city = [];
            payload.property = [];
            let stateData = await exports.CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "state.id": { $in: payload.stateId } });
            if (!stateData) {
                let findStaateLevelTwoPresent = await exports.CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, accessLevel: 2 });
                if (findStaateLevelTwoPresent) {
                    let cohostData = await Promise.all([
                        exports.CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, { $addToSet: { state: payload.state } }),
                        property_details_entity_1.PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                    ]);
                    return cohostData[0];
                }
                else {
                    await property_details_entity_1.PropertyV1.update({ "country.id": payload.countryId, userId: payload.hostId, "state.id": { $in: payload.stateId } }, { $pull: { coHostId: coHostId } });
                    let cohostData = await Promise.all([
                        exports.CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "state.id": { $in: payload.stateId } }, payload, { upsert: true, new: true }),
                        property_details_entity_1.PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                    ]);
                    return cohostData[1];
                }
            }
            else {
                if (stateData.accessLevel == 2) {
                    if (stateData.state.length > 1) {
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "state.id": { $in: payload.stateId } }, { $addToSet: { state: payload.state } }, { upsert: true }),
                            property_details_entity_1.PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: [coHostId] } })
                        ]);
                        return cohostData[0];
                    }
                    else {
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateDocument({ cohostId: coHostId }, payload, { upsert: true, new: true }),
                            exports.CoHostV1.remove({ cohostId: coHostId, "state.id": payload.stateId, accessLevel: { $in: [3, 4] } }),
                            property_details_entity_1.PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ]);
                        return cohostData[0];
                    }
                }
                else {
                    let stateWithLevel2 = await exports.CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, accessLevel: 2 });
                    if (stateWithLevel2) {
                        await exports.CoHostV1.remove({ cohostId: coHostId, "state.id": payload.stateId, accessLevel: { $in: [3, 4] } });
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateOne({ _id: stateWithLevel2._id }, { $addToSet: { state: payload.state } }),
                            property_details_entity_1.PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ]);
                        return cohostData[0];
                    }
                    else {
                        await exports.CoHostV1.removeAll({ cohostId: coHostId, "state.id": payload.stateId, accessLevel: { $in: [3, 4] } });
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateDocument({ _id: stateData._id }, payload, { upsert: true, new: true }),
                            property_details_entity_1.PropertyV1.update({ "state.id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ]);
                        return cohostData[0];
                    }
                }
            }
        }
        else if (payload.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.CITY) {
            let country = [];
            let state = [];
            let city = [];
            let [stateName, countryName, cityName] = await Promise.all([
                states_v1_entity_1.StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, id: 1, _id: 0 }),
                countries_v1_entity_1.CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 }),
                city_v1_entity_1.CityV1.findMany({ _id: { $in: payload.cityId } }, { cityName: 1, _id: 1 }),
            ]);
            for (let i = 0; i < stateName.length; i++)
                state.push(stateName[i]);
            for (let i = 0; i < countryName.length; i++)
                country.push(countryName[i]);
            for (let i = 0; i < cityName.length; i++) {
                city.push(cityName[i]);
                payload.cityId[i] = mongoose_1.Types.ObjectId(payload.cityId[i]);
            }
            payload.state = state;
            payload.country = country;
            payload.city = city;
            let stateData = await exports.CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "city._id": { $in: payload.cityId } });
            if (!stateData) {
                let findStaateLevelTwoPresent = await exports.CoHostV1.findOne({ cohostId: coHostId, "state.id": { $in: payload.stateId }, accessLevel: { $ne: 4 } });
                if (findStaateLevelTwoPresent) {
                    if (findStaateLevelTwoPresent.state.length > 1) {
                        await property_details_entity_1.PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: payload.hostId }, { $pull: { coHostId: coHostId } });
                        await exports.CoHostV1.updateOne({ _id: mongoose_1.Types.ObjectId(findStaateLevelTwoPresent._id) }, { $pull: { state: payload.state[0] } });
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateOne({ cohostId: coHostId, "city._id": { $in: payload.cityId } }, payload, { upsert: true }),
                            property_details_entity_1.PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ]);
                        return cohostData[1];
                    }
                    else {
                        await property_details_entity_1.PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: payload.hostId }, { $pull: { coHostId: coHostId } });
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateOne({ _id: mongoose_1.Types.ObjectId(findStaateLevelTwoPresent._id) }, { $addToSet: { city: payload.city }, accessLevel: 3 }),
                            property_details_entity_1.PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ]);
                        return cohostData[0];
                    }
                }
                else {
                    await property_details_entity_1.PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId, "city._id": { $in: payload.cityId } }, { $pull: { coHostId: coHostId } });
                    await exports.CoHostV1.remove({ cohostId: coHostId, "country.id": { $in: payload.countryId }, accessLevel: 1 });
                    let cohostData = await Promise.all([
                        exports.CoHostV1.updateDocument({ cohostId: coHostId, "state.id": { $in: payload.stateId }, accessLevel: { $ne: 4 } }, payload, { upsert: true }),
                        property_details_entity_1.PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                    ]);
                    return cohostData[1];
                }
            }
            else {
                if (stateData.accessLevel == 3) {
                    if (stateData.city.length > 1) {
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "city._id": { $in: payload.cityId } }, { $addToSet: { city: payload.city } }, { upsert: true }),
                            property_details_entity_1.PropertyV1.update({ "city._id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: [coHostId] } })
                        ]);
                        return cohostData[0];
                    }
                    else {
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId } }, payload, { upsert: true, new: true }),
                            property_details_entity_1.PropertyV1.update({ "city._id": payload.stateId, userId: payload.hostId }, { $addToSet: { coHostId: [coHostId] } })
                        ]);
                        return cohostData[0];
                    }
                }
                else {
                    await exports.CoHostV1.remove({ _id: mongoose_1.Types.ObjectId(stateData._id) });
                    let cohostData = await Promise.all([
                        exports.CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "city._id": { $in: payload.cityId } }, payload, { upsert: true, new: true }),
                        property_details_entity_1.PropertyV1.update({ "city._id": payload.cityId, userId: payload.hostId }, { $addToSet: { coHostId: [coHostId] } })
                    ]);
                    return cohostData[0];
                }
            }
        }
        else if (payload.accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.PROPERTY) {
            let country = [];
            let state = [];
            let city = [];
            let property = [];
            let [stateName, countryName, cityName, propertyName] = await Promise.all([
                states_v1_entity_1.StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, id: 1, _id: 0 }),
                countries_v1_entity_1.CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 }),
                city_v1_entity_1.CityV1.findMany({ _id: { $in: payload.cityId } }, { cityName: 1, _id: 1 }),
                property_details_entity_1.PropertyV1.findMany({ _id: { $in: payload.propertyId } }, { name: 1, _id: 1 }),
            ]);
            for (let i = 0; i < stateName.length; i++)
                state.push(stateName[i]);
            for (let i = 0; i < countryName.length; i++)
                country.push(countryName[i]);
            for (let i = 0; i < cityName.length; i++) {
                city.push(cityName[i]);
                payload.cityId[i] = mongoose_1.Types.ObjectId(payload.cityId[i]);
            }
            for (let i = 0; i < propertyName.length; i++) {
                property.push(propertyName[i]);
                payload.propertyId[i] = mongoose_1.Types.ObjectId(payload.propertyId[i]);
            }
            payload.state = state;
            payload.country = country;
            payload.city = city;
            payload.property = property;
            let propertyData = await exports.CoHostV1.findOne({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "property._id": { $in: payload.propertyId } });
            if (!propertyData) {
                let findStaateLevelTwoPresent = await exports.CoHostV1.findOne({ cohostId: coHostId, "city._id": { $in: payload.cityId } });
                if (findStaateLevelTwoPresent) {
                    if (findStaateLevelTwoPresent.city.length > 1) {
                        await property_details_entity_1.PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $pull: { coHostId: coHostId } });
                        await exports.CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, { $pull: { city: payload.city[0] } });
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateOne({ cohostId: coHostId, "property._id": { $in: payload.propertyId } }, payload, { upsert: true }),
                            property_details_entity_1.PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ]);
                        return cohostData[1];
                    }
                    else {
                        await property_details_entity_1.PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: payload.hostId }, { $pull: { coHostId: coHostId } });
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, { $addToSet: { property: payload.property }, accessLevel: 4 }),
                            property_details_entity_1.PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ]);
                        return cohostData[0];
                    }
                }
                else {
                    let findStaateLevelTwoPresent = await exports.CoHostV1.findOne({ cohostId: coHostId, "state.id": { $in: payload.stateId } });
                    if (findStaateLevelTwoPresent) {
                        if (findStaateLevelTwoPresent.state.length > 1) {
                            await property_details_entity_1.PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId, "state.id": { $in: payload.stateId } }, { $pull: { coHostId: coHostId } });
                            await exports.CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, { $pull: { state: payload.state[0] } });
                            let cohostData = await Promise.all([
                                exports.CoHostV1.updateOne({ cohostId: coHostId, "property._id": { $in: payload.propertyId } }, payload, { upsert: true }),
                                property_details_entity_1.PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                            ]);
                            return cohostData[1];
                        }
                        else {
                            await property_details_entity_1.PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: payload.hostId, "state.id": { $in: payload.stateId } }, { $pull: { coHostId: coHostId } });
                            let cohostData = await Promise.all([
                                exports.CoHostV1.updateOne({ _id: findStaateLevelTwoPresent._id }, payload, { upsert: true }),
                                property_details_entity_1.PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                            ]);
                            return cohostData[1];
                        }
                    }
                    else {
                        await exports.CoHostV1.remove({ cohostId: coHostId, "country.id": { $in: payload.countryId }, accessLevel: 1 });
                        let cohostData = await Promise.all([
                            exports.CoHostV1.updateDocument({ cohostId: coHostId, "country.id": { $in: payload.countryId }, "property._id": { $in: payload.propertyId } }, payload, { upsert: true }),
                            property_details_entity_1.PropertyV1.update({ "_id": { $in: payload.propertyId }, userId: payload.hostId }, { $addToSet: { coHostId: coHostId } })
                        ]);
                        return cohostData[1];
                    }
                }
            }
            else {
                return propertyData;
            }
        }
    }
    async createCohost(payload, userId) {
        let query;
        let propertyQuery;
        let cohostQuery;
        payload.hostId = userId;
        let state = [], country = [], city = [], property = [];
        if (payload && payload.propertyId && payload.propertyId.length > 0) {
            let [cityName, stateName, countryName, propertyName] = await Promise.all([
                city_v1_entity_1.CityV1.findMany({ _id: { $in: payload.cityId } }, { cityName: 1, _id: 1 }),
                states_v1_entity_1.StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, id: 1, _id: 0 }),
                countries_v1_entity_1.CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, id: 1, _id: 0 }),
                property_details_entity_1.PropertyV1.findMany({ _id: { $in: payload.propertyId } }, { name: 1, _id: 1 }),
            ]);
            for (let i = 0; i < stateName.length; i++)
                state.push(stateName[i]);
            for (let i = 0; i < countryName.length; i++)
                country.push(countryName[i]);
            for (let i = 0; i < cityName.length; i++)
                city.push(cityName[i]);
            for (let i = 0; i < propertyName.length; i++)
                property.push(propertyName[i]);
            payload.city = city;
            payload.state = state;
            payload.country = country;
            payload.property = property;
            payload.accessLevel = _common_1.ENUM.COHOST_LEVEL.STATUS.PROPERTY;
            cohostQuery = exports.CoHostV1.updateDocument({ cohostId: mongoose_1.Types.ObjectId(payload.cohostId), "country.id": { $in: payload.countryId } }, payload, { upsert: true });
            query = host_v1_entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.cohostId) }, { accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.PROPERTY });
            propertyQuery = property_details_entity_1.PropertyV1.update({ _id: { $in: payload.propertyId } }, { $push: { coHostId: mongoose_1.Types.ObjectId(payload.cohostId) } }, { multi: true });
        }
        else if (payload && payload.cityId && payload.cityId.length > 0) {
            let state = [], country = [], city = [];
            let [cityName, stateName, countryName] = await Promise.all([
                city_v1_entity_1.CityV1.findMany({ _id: { $in: payload.cityId } }, { cityName: 1, _id: 1 }),
                states_v1_entity_1.StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, _id: 0, id: 1 }),
                countries_v1_entity_1.CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, _id: 0, id: 1 }),
            ]);
            for (let i = 0; i < stateName.length; i++)
                state.push(stateName[i]);
            for (let i = 0; i < countryName.length; i++)
                country.push(countryName[i]);
            for (let i = 0; i < cityName.length; i++)
                city.push(cityName[i]);
            payload.city = city;
            payload.state = state;
            payload.country = country;
            payload.property = [];
            payload.accessLevel = _common_1.ENUM.COHOST_LEVEL.STATUS.CITY;
            query = host_v1_entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.cohostId) }, { accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.CITY });
            propertyQuery = property_details_entity_1.PropertyV1.update({ "city._id": { $in: payload.cityId }, userId: userId }, { $push: { coHostId: mongoose_1.Types.ObjectId(payload.cohostId) } }, { multi: true });
            cohostQuery = exports.CoHostV1.updateDocument({ cohostId: mongoose_1.Types.ObjectId(payload.cohostId), "country.id": { $in: payload.countryId } }, payload, { upsert: true });
        }
        else if (payload && payload.stateId && payload.stateId.length > 0) {
            let state = [], country = [];
            let [stateName, countryName] = await Promise.all([
                states_v1_entity_1.StatesV1.findMany({ id: { $in: payload.stateId } }, { name: 1, _id: 0, id: 1 }),
                countries_v1_entity_1.CountriesV1.findMany({ id: { $in: payload.countryId } }, { name: 1, _id: 0, id: 1 }),
            ]);
            for (let i = 0; i < stateName.length; i++)
                state.push(stateName[i]);
            for (let i = 0; i < countryName.length; i++)
                country.push(countryName[i]);
            payload.country = country;
            payload.state = state;
            payload.city = [];
            payload.property = [];
            payload.accessLevel = _common_1.ENUM.COHOST_LEVEL.STATUS.STATE;
            query = host_v1_entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.cohostId) }, { accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.STATE });
            propertyQuery = property_details_entity_1.PropertyV1.update({ "state.id": { $in: payload.stateId }, userId: userId }, { $push: { coHostId: mongoose_1.Types.ObjectId(payload.cohostId) } }, { multi: true });
            cohostQuery = exports.CoHostV1.updateDocument({ cohostId: mongoose_1.Types.ObjectId(payload.cohostId), "country.id": { $in: payload.countryId } }, payload, { upsert: true });
        }
        else if (payload && payload.countryId) {
            let country = await countries_v1_entity_1.CountriesV1.findOne({ id: { $in: payload.countryId } }, { name: 1, _id: 0, id: 1 });
            payload.country = country;
            payload.state = [];
            payload.city = [];
            payload.property = [];
            payload.accessLevel = _common_1.ENUM.COHOST_LEVEL.STATUS.COUNTRY;
            query = host_v1_entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.cohostId) }, { accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.COUNTRY });
            propertyQuery = property_details_entity_1.PropertyV1.update({ "country.id": { $in: payload.countryId }, userId: userId }, { $push: { coHostId: mongoose_1.Types.ObjectId(payload.cohostId) } }, { multi: true });
            cohostQuery = exports.CoHostV1.updateDocument({ cohostId: mongoose_1.Types.ObjectId(payload.cohostId), "country.id": { $in: payload.countryId } }, payload, { upsert: true });
        }
        let cohostData = await Promise.all([
            cohostQuery,
            query,
            propertyQuery,
        ]);
        return cohostData[0];
    }
    async checkAccessLevels(res, payload) {
        var _a, _b, _c, _d, _e, _f;
        try {
            if (((_b = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.userData) === null || _b === void 0 ? void 0 : _b.isCohost) && ((_d = (_c = res === null || res === void 0 ? void 0 : res.locals) === null || _c === void 0 ? void 0 : _c.userData) === null || _d === void 0 ? void 0 : _d.accessLevel) == _common_1.ENUM.COHOST_LEVEL.STATUS.PROPERTY) {
                return _baseController_1.handleEntityResponse.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_ALLOWED);
            }
            else if ((_f = (_e = res === null || res === void 0 ? void 0 : res.locals) === null || _e === void 0 ? void 0 : _e.userData) === null || _f === void 0 ? void 0 : _f.isCohost) {
                payload['userId'] = mongoose_1.Types.ObjectId(res.locals.userData.hostId);
                return payload;
            }
            else {
                payload['userId'] = mongoose_1.Types.ObjectId(res.locals.userId);
                return payload;
            }
        }
        catch (error) {
            console.error(`we have an error while checkAccessLevels ==> ${error}`);
        }
    }
}
exports.CoHostV1 = new CoworkersEntity(cohost_model_1.default);
//# sourceMappingURL=cohost.v1.entity.js.map