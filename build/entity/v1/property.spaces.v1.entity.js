"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertySpaceV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const propertySpaces_model_1 = __importDefault(require("@models/propertySpaces.model"));
const _entity_1 = require("@entity");
const _baseController_1 = require("@baseController");
const _common_1 = require("@common");
const partner_floor_entity_1 = require("./partner.floor.entity");
const partner_v1_entity_1 = require("./partner.v1.entity");
const employee_v1_entity_1 = require("./employee.v1.entity");
class SpaceEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createPropertySpace(payload) {
        try {
            let floorDetail = await new this.model(payload).save();
            return floorDetail;
        }
        catch (error) {
            console.error(`we have an error while createPropertySpace ==> ${error}`);
        }
    }
    async addFloors(addPropertyResponse, payload, res, headers) {
        var _a, _b;
        try {
            if ((payload === null || payload === void 0 ? void 0 : payload.status) == _common_1.ENUM.PROPERTY.STATUS.ACTIVE && ((_a = payload === null || payload === void 0 ? void 0 : payload.floorDetails) === null || _a === void 0 ? void 0 : _a.length) < 0) {
                return _baseController_1.handleEntityResponse.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INCOMPLETE_FLOOR_DETAILS);
            }
            let totalCapacity = 0;
            if ((_b = payload === null || payload === void 0 ? void 0 : payload.floorDetails) === null || _b === void 0 ? void 0 : _b.length) {
                for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                    console.log("no. of time loops been called .....", totalCapacity);
                    const floorDetail = payload.floorDetails[floorNumber];
                    floorDetail['propertyId'] = addPropertyResponse._id;
                    floorDetail['propertyName'] = addPropertyResponse.name;
                    totalCapacity = totalCapacity + floorDetail.capacity;
                    await this.addFloor(floorDetail, res, headers);
                }
            }
            console.log("=>>>>>>>>>>>>>>>>>>>> total capacity", totalCapacity);
            await _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(addPropertyResponse._id) }, {
                $set: {
                    totalCapacity: totalCapacity,
                }
            });
        }
        catch (error) {
            console.error(`we have an error while adding floors ==> ${error}`);
        }
    }
    async addFloor(payload, res, headers) {
        try {
            let offset = headers.offset;
            let spaceDetail = await _entity_1.HostV1.addPropertySpace(payload);
            if (!spaceDetail) {
                return _baseController_1.handleEntityResponse.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).DUPLICATE_SPACE_ID);
            }
            if (payload.offerPrice && payload.offerPrice.length > 0) {
                await _entity_1.OPriceV1.saveMultipleOfferPrice(payload.offerPrice, spaceDetail._id, spaceDetail.propertyId, parseInt(offset));
            }
            _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.propertyId) }, {
                $inc: { totalUnits: parseInt(payload === null || payload === void 0 ? void 0 : payload.units) }
            });
        }
        catch (error) {
            console.error(`we have an error while add Space entity ==> ${error}`);
        }
    }
    async updateFloors(addPropertyResponse, payload, res, headers, next) {
        try {
            let activeFloors = [];
            let activeFloorsNumber = [];
            let totalCapacity = 0;
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                const floorDetail = payload.floorDetails[floorNumber];
                floorDetail['propertyId'] = addPropertyResponse._id;
                totalCapacity += floorDetail.capacity;
                activeFloorsNumber.push(floorDetail.floorNumber);
                const updatedFloors = await this.updateFloor(floorDetail, res, headers, next);
                activeFloors.push(updatedFloors);
            }
            if ((activeFloors === null || activeFloors === void 0 ? void 0 : activeFloors.length) > 0) {
                await Promise.all([
                    exports.PropertySpaceV1.update({ propertyId: mongoose_1.Types.ObjectId(addPropertyResponse._id), _id: { $nin: activeFloors } }, { $set: { status: _common_1.ENUM.PROPERTY_SPACE.STATUS.ISDELETE } }),
                    partner_floor_entity_1.PartnerFloorV1.update({ propertyId: mongoose_1.Types.ObjectId(addPropertyResponse._id), spaceId: { $nin: activeFloors } }, { $set: { status: _common_1.ENUM.PROPERTY_SPACE.STATUS.ISDELETE } }),
                    _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(addPropertyResponse._id) }, {
                        $set: {
                            totalCapacity: totalCapacity,
                        }
                    }),
                ]);
            }
        }
        catch (error) {
            console.error(`we have an error while updateFloors entity ==> ${error}`);
            next(error);
        }
    }
    async updatePartnersAssociatedWithProperty(payload) {
        var _a, _b, _c;
        try {
            let findPartners = await partner_v1_entity_1.PartnerV1.findMany({ "property._id": mongoose_1.Types.ObjectId(payload) });
            let concatArray = [];
            let removePartnerArray = [];
            for (let i = 0; i < findPartners.length; i++) {
                let partialFloorDetails = await partner_floor_entity_1.PartnerFloorV1.findOne({ partnerId: mongoose_1.Types.ObjectId(findPartners[i]._id), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                if (partialFloorDetails)
                    concatArray = (_b = (_a = findPartners[i]) === null || _a === void 0 ? void 0 : _a.partnerFloors) === null || _b === void 0 ? void 0 : _b.concat(partialFloorDetails.partnerFloors);
                else
                    concatArray = (_c = findPartners[i]) === null || _c === void 0 ? void 0 : _c.partnerFloors;
                if (concatArray.length == 0)
                    removePartnerArray.push(mongoose_1.Types.ObjectId(findPartners[i]._id));
            }
            await Promise.all([
                partner_v1_entity_1.PartnerV1.removeAll({ _id: { $in: removePartnerArray } }),
                employee_v1_entity_1.EmployeeV1.removeAll({ partnerId: { $in: removePartnerArray } })
            ]);
        }
        catch (error) {
            console.error(`we have an error while updatePartnersAssociatedWithFloors entity ==> ${error}`);
            throw error;
        }
    }
    async updateFloor(floorDetail, res, headers, next) {
        var _a;
        try {
            let payload = floorDetail;
            let offset = headers.offset;
            const [capacityFromDb, response] = await Promise.all([
                exports.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.floorId) }),
                _entity_1.HostV1.updatePropertySpace(payload, res, next)
            ]);
            console.log(`capacityFromDb ==>`, capacityFromDb);
            if (!response)
                return _baseController_1.handleEntityResponse.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).DUPLICATE_SPACE_ID);
            if (((_a = payload === null || payload === void 0 ? void 0 : payload.offerPrice) === null || _a === void 0 ? void 0 : _a.length) > 0 && (payload === null || payload === void 0 ? void 0 : payload.isOfferPrice)) {
                await _entity_1.OPriceV1.updateMultipleOfferPrice(payload.offerPrice, response._id, response.propertyId, offset);
            }
            return response === null || response === void 0 ? void 0 : response._id;
        }
        catch (error) {
            console.error(`we have an error while updateFloor entity ==> ${error}`);
        }
    }
}
exports.PropertySpaceV1 = new SpaceEntity(propertySpaces_model_1.default);
//# sourceMappingURL=property.spaces.v1.entity.js.map