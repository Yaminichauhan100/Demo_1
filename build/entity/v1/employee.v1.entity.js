"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const employee_model_1 = __importDefault(require("@models/employee.model"));
const _builders_1 = __importDefault(require("@builders"));
const property_details_entity_1 = require("./property.details.entity");
const user_v1_entity_1 = require("./user.v1.entity");
const partner_floor_entity_1 = require("./partner.floor.entity");
const property_spaces_v1_entity_1 = require("./property.spaces.v1.entity");
const partner_v1_entity_1 = require("./partner.v1.entity");
const _common_1 = require("@common");
class EmployeeEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async create(payload) {
        let faqData = await new this.model(payload).save();
        return faqData.toObject();
    }
    async fetchAssociatedProperties(payload, userId) {
        try {
            let propertyIdArray = [];
            const headers = payload.headers;
            payload.offset = parseInt(headers.offset);
            const availablePropertyIds = await this.findDistinct("propertyId", { userId: mongoose_1.Types.ObjectId(userId) });
            if (availablePropertyIds.length > 0) {
                for (let i = 0; i < availablePropertyIds.length; i++) {
                    propertyIdArray.push(mongoose_1.Types.ObjectId(availablePropertyIds[i]));
                }
            }
            let userDetails = await user_v1_entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(userId) }, { partnerId: 1 });
            let partnerArray = [];
            userDetails.partnerId.forEach((element) => {
                partnerArray.push(mongoose_1.Types.ObjectId(element));
            });
            const availablePropertyPipeline = _builders_1.default.User.UserPropertyBuilder.fetchPartnerProperties(payload, userId, propertyIdArray, partnerArray);
            payload['getCount'] = true;
            const availablePropertyListing = await property_details_entity_1.PropertyV1.paginateAggregate(availablePropertyPipeline, payload);
            return availablePropertyListing;
        }
        catch (error) {
            console.error(`we have an error in fetchAssociatedProperties ==> ${error}`);
        }
    }
    async fetchDistinctPropertyIds(userId) {
        try {
            return await this.findDistinct("propertyId", { userId: mongoose_1.Types.ObjectId(userId) });
        }
        catch (error) {
            console.error(`we have an error fetchDistinctPropertyIds ==> ${error}`);
        }
    }
    async fetchDistinctCountryIds(propertyIds) {
        try {
            return await property_details_entity_1.PropertyV1.findDistinct("country._id", { _id: { $in: propertyIds } });
        }
        catch (error) {
            console.error(`we have an error fetchPropertyWiseCityListing ==> ${error}`);
        }
    }
    async fetchDistinctStateIds(propertyIds) {
        try {
            return await property_details_entity_1.PropertyV1.findDistinct("state._id", { _id: { $in: propertyIds } });
        }
        catch (error) {
            console.error(`we have an error fetchPropertyWiseCityListing ==> ${error}`);
        }
    }
    async fetchDistinctCityIds(propertyIds) {
        try {
            return await property_details_entity_1.PropertyV1.findDistinct("city._id", { _id: { $in: propertyIds } });
        }
        catch (error) {
            console.error(`we have an error fetchPropertyWiseCityListing ==> ${error}`);
        }
    }
    async fetchPropertyDetailsFloorWise(payload) {
        try {
            const floorPartnerDetails = _builders_1.default.User.EmployeePropertyBuilder.employeePropertyDetails(payload);
            const floorListing = await partner_floor_entity_1.PartnerFloorV1.basicAggregate(floorPartnerDetails);
            return floorListing;
        }
        catch (error) {
            console.error(`we have an error fetchPropertyDetailsFloorWise ==> ${error}`);
        }
    }
    async fetchEmployeePropertyDetailsViaPropertySpace(payload) {
        try {
            const floorPartnerDetails = _builders_1.default.User.EmployeePropertyBuilder.employeePropertySpaceDetails(payload);
            const floorListing = await property_spaces_v1_entity_1.PropertySpaceV1.basicAggregate(floorPartnerDetails);
            return floorListing;
        }
        catch (error) {
            console.error(`we have an error fetchPropertyDetailsFloorWise ==> ${error}`);
        }
    }
    async fetchUserPropertyDetailsViaPropertySpace(payload) {
        try {
            const floorPartnerDetails = _builders_1.default.User.EmployeePropertyBuilder.userPropertySpaceDetails(payload);
            const floorListing = await property_spaces_v1_entity_1.PropertySpaceV1.basicAggregate(floorPartnerDetails);
            return floorListing;
        }
        catch (error) {
            console.error(`we have an error fetchUserPropertyDetailsViaPropertySpace ==> ${error}`);
        }
    }
    async fetchPropertyDetailsBookingType(payload) {
        try {
            let propertyDetails = [];
            switch (payload.bookingType) {
                case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                    propertyDetails = await Promise.all([
                        property_spaces_v1_entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), bookingType: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: false, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }),
                        partner_v1_entity_1.PartnerV1.distinct("partnerFloors", { "property._id": mongoose_1.Types.ObjectId(payload.propertyId) })
                    ]);
                    return propertyDetails[0].filter((f) => !propertyDetails[1].includes(f));
                case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                    propertyDetails = await Promise.all([
                        property_spaces_v1_entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), bookingType: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY, isEmployee: false, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }),
                        partner_v1_entity_1.PartnerV1.distinct("partnerFloors", { "property._id": mongoose_1.Types.ObjectId(payload.propertyId) })
                    ]);
                    return propertyDetails[0].filter((f) => !propertyDetails[1].includes(f));
                case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                    propertyDetails = await Promise.all([
                        property_spaces_v1_entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), bookingType: _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM, isEmployee: false, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }),
                        partner_v1_entity_1.PartnerV1.distinct("partnerFloors", { "property._id": mongoose_1.Types.ObjectId(payload.propertyId) })
                    ]);
                    return propertyDetails[0].filter((f) => !propertyDetails[1].includes(f));
                default:
                    propertyDetails = await Promise.all([
                        property_spaces_v1_entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), isEmployee: false, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }),
                        partner_v1_entity_1.PartnerV1.distinct("partnerFloors", { "property._id": mongoose_1.Types.ObjectId(payload.propertyId) })
                    ]);
                    return propertyDetails[0].filter((f) => !propertyDetails[1].includes(f));
            }
        }
        catch (error) {
            console.error(`we have an error fetchUserPropertyDetailsViaPropertySpace ==> ${error}`);
        }
    }
    async fetchPropertyDetailsforEmployee(payload) {
        try {
            let floorCount;
            switch (payload.bookingType) {
                case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                    floorCount = await property_spaces_v1_entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), partnerId: mongoose_1.Types.ObjectId(payload.partnerId), bookingType: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: true, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    return floorCount;
                case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                    floorCount = await property_spaces_v1_entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), partnerId: mongoose_1.Types.ObjectId(payload.partnerId), bookingType: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY, isEmployee: true, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    return floorCount;
                case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                    floorCount = await property_spaces_v1_entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), partnerId: mongoose_1.Types.ObjectId(payload.partnerId), bookingType: _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM, isEmployee: true, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    return floorCount;
                default:
                    floorCount = await property_spaces_v1_entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), partnerId: mongoose_1.Types.ObjectId(payload.partnerId), bookingType: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY, isEmployee: true, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    return floorCount;
            }
        }
        catch (error) {
            console.error(`we have an error fetchUserPropertyDetailsViaPropertySpace ==> ${error}`);
        }
    }
}
exports.EmployeeV1 = new EmployeeEntity(employee_model_1.default);
//# sourceMappingURL=employee.v1.entity.js.map