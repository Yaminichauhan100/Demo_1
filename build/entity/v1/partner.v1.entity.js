"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const partner_model_1 = __importDefault(require("@models/partner.model"));
const states_v1_entity_1 = require("./states.v1.entity");
const countries_v1_entity_1 = require("./countries.v1.entity");
const property_details_entity_1 = require("./property.details.entity");
const _entity_1 = require("@entity");
const city_v1_entity_1 = require("./city.v1.entity");
const partner_floor_entity_1 = require("./partner.floor.entity");
const property_spaces_v1_entity_1 = require("./property.spaces.v1.entity");
const _common_1 = require("@common");
const _services_1 = require("@services");
const host_v1_entity_1 = require("./host.v1.entity");
const xl = require('excel4node');
const htmlHelper_1 = require("../../htmlHelper");
class PartnerEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async savePartner(payload) {
        try {
            let [state, country, city, property] = await Promise.all([states_v1_entity_1.StatesV1.findOne({ id: payload.stateId }, { id: 1, name: 1 }),
                countries_v1_entity_1.CountriesV1.findOne({ id: payload.countryId }, { id: 1, name: 1 }),
                city_v1_entity_1.CityV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cityId) }, { _id: 1, cityName: 1 }),
                property_details_entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, { _id: 1, name: 1 })
            ]);
            payload.state = state;
            payload.country = country;
            payload.city = city;
            payload.property = property;
            if (payload.floorDetails && payload.floorDetails.length == 0) {
                payload.partnerType = _common_1.ENUM.PROPERTY.PROPERTY_TYPE.ENTIRE_BUILDING;
            }
            else {
                payload.partnerType = _common_1.ENUM.PROPERTY.PROPERTY_TYPE.SPECIFIC_FLOOR;
            }
            let partner = await new this.model(payload).save();
            payload.partnerId = partner._id;
            if (payload.floorDetails && payload.floorDetails.length > 0)
                await this.saveFloorDetails(payload);
            return partner.toObject();
        }
        catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> savePartner", error);
        }
    }
    async saveFloorDetails(payload) {
        try {
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                payload.floorDetails[floorNumber].partnerId = payload.partnerId;
                await this.addPartnerFloor(payload.floorDetails[floorNumber]);
            }
        }
        catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> saveFloorDetails", error);
        }
    }
    async addPartnerFloor(payload) {
        try {
            let floorData = await property_spaces_v1_entity_1.PropertySpaceV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.spaceId) }, { partnerId: mongoose_1.Types.ObjectId(payload.partnerId) });
            return floorData;
        }
        catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> addPartnerFloor", error);
            return error;
        }
    }
    async updateFloorDetails(payload) {
        try {
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                payload.floorDetails[floorNumber].partnerId = payload.partnerId;
                await this.updatePartnerFloor(payload.floorDetails[floorNumber]);
            }
        }
        catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> updateFloorDetails", error);
        }
    }
    async updatePartnerFloor(payload) {
        try {
            let floorData = await property_spaces_v1_entity_1.PropertySpaceV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.spaceId) }, { partnerId: mongoose_1.Types.ObjectId(payload.partnerId) });
            return floorData;
        }
        catch (error) {
            console.error("we have an error in =>>>>>>>>>>>>>>>>>>>>> updatePartnerFloor", error);
            return error;
        }
    }
    async checkFloorAvailabilityWhileAdding(payload) {
        try {
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                let findFloorNumberFromSpace = await property_spaces_v1_entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.floorDetails[floorNumber].spaceId) }, { floorNumber: 1 });
                if (findFloorNumberFromSpace) {
                    let searchPartnerFLoorDetails = await exports.PartnerV1.findOne({ "property._id": mongoose_1.Types.ObjectId(payload.propertyId), partnerFloors: findFloorNumberFromSpace.floorNumber }, {});
                    if (searchPartnerFLoorDetails)
                        return findFloorNumberFromSpace.floorNumber;
                    else
                        return searchPartnerFLoorDetails;
                }
                return findFloorNumberFromSpace;
            }
        }
        catch (error) {
            console.error("error in check floor availability function in partner entity", error);
        }
    }
    async checkFloorAvailabilityWhileUpdatingPartner(payload) {
        try {
            for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                let findFloorNumberFromSpace = await property_spaces_v1_entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.floorDetails[floorNumber].spaceId) }, { floorNumber: 1 });
                let searchPartnerFLoorDetails = await exports.PartnerV1.findOne({ "property._id": mongoose_1.Types.ObjectId(payload.propertyId), partnerFloors: findFloorNumberFromSpace.floorNumber, _id: { $ne: mongoose_1.Types.ObjectId(payload.partnerId) } }, {});
                if (searchPartnerFLoorDetails) {
                    return findFloorNumberFromSpace.floorNumber;
                }
            }
        }
        catch (error) {
            console.error("error in check floor availability function in partner entity", error);
        }
    }
    async checkFloorAvailabilityWhileUpdating(payload) {
        try {
            if (payload.partnerFloors && payload.partnerFloors.length > 0) {
                let partnerFloors = await Promise.all([
                    partner_floor_entity_1.PartnerFloorV1.distinct("floorNumber", { partnerId: mongoose_1.Types.ObjectId(payload.partnerId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, floorNumber: { $in: payload.partnerFloors } }),
                    partner_floor_entity_1.PartnerFloorV1.distinct("_id", { partnerId: mongoose_1.Types.ObjectId(payload.partnerId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, floorNumber: { $in: payload.partnerFloors } })
                ]);
                let partnerArray = [];
                partnerFloors[1].forEach((element) => {
                    partnerArray.push(mongoose_1.Types.ObjectId(element));
                });
                await Promise.all([
                    partner_floor_entity_1.PartnerFloorV1.removeAll({ _id: { $in: partnerArray } }),
                    exports.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload.partnerId) }, { $pull: { partnerFloors: { $in: partnerFloors[0] } } })
                ]);
            }
            if (payload.floorDetails && payload.floorDetails.length > 0) {
                for (let floorNumber = 0; floorNumber < payload.floorDetails.length; floorNumber++) {
                    let floorSpaceNumber = await property_spaces_v1_entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.floorDetails[floorNumber].spaceId) }, { floorNumber: 1 });
                    await exports.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload.partnerId) }, { $pull: { partnerFloors: floorSpaceNumber.floorNumber } });
                }
            }
            return;
        }
        catch (error) {
            console.error("error in check floor availability function in partner entity", error);
        }
    }
    async updatePartner(payload) {
        try {
            if (payload.stateId)
                payload.state = await states_v1_entity_1.StatesV1.findOne({ id: payload.stateId }, { id: 1, name: 1 });
            if (payload.countryId)
                payload.country = await countries_v1_entity_1.CountriesV1.findOne({ id: payload.countryId }, { id: 1, name: 1 });
            if (payload.cityId)
                payload.city = await city_v1_entity_1.CityV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cityId) }, { _id: 1, cityName: 1 });
            if (payload.propertyId) {
                payload.property = await property_details_entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, { _id: 1, name: 1 });
                await _entity_1.EmployeeV1.updateEntity({ partnerId: mongoose_1.Types.ObjectId(payload.partnerId) }, { propertyId: mongoose_1.Types.ObjectId(payload.propertyId) }, { multi: true });
            }
            payload.status = _common_1.ENUM.PROPERTY.STATUS.ACTIVE;
            let response = await exports.PartnerV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.partnerId) }, payload);
            await property_spaces_v1_entity_1.PropertySpaceV1.update({ partnerId: mongoose_1.Types.ObjectId(payload.partnerId) }, { $unset: { partnerId: "" } }, { multi: true });
            if (payload.floorDetails && payload.floorDetails.length > 0) {
                await this.saveFloorDetails(payload);
            }
            return response;
        }
        catch (error) {
            console.error("error in updatePartner", error);
            return 0;
        }
    }
    async bulkEmployee(payload, partnerId) {
        try {
            {
                let status = [];
                let finalDataToWriteFile = [];
                let findHostEmail;
                for (let i = 0; i < payload.length; i++) {
                    let dataToWrite = {};
                    let [searchDuplicateUser, findProperty] = await Promise.all([
                        _entity_1.UserV1.findOne({ $or: [{ email: payload[i].email }, { phoneNo: payload[i].phoneNo, countryCode: payload[i].countryCode }] }),
                        exports.PartnerV1.findOne({ _id: mongoose_1.Types.ObjectId(partnerId) }, { property: 1, name: 1, hostId: 1 })
                    ]);
                    findHostEmail = await host_v1_entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(findProperty.hostId) }, { email: 1, name: 1 });
                    payload[i].propertyId = mongoose_1.Types.ObjectId(findProperty.property._id);
                    if (searchDuplicateUser) {
                        let searchDuplicateEmployee = await _entity_1.EmployeeV1.findOne({ partnerId: mongoose_1.Types.ObjectId(partnerId), $or: [{ email: payload[i].email }, { phoneNo: payload[i].phoneNo, countryCode: payload[i].countryCode }] });
                        if (payload[i].phoneNo.toString().length > 14 || payload[i].phoneNo.toString().length < 8 || payload[i].phoneNo.toString()[0] === '0') {
                            dataToWrite = payload[i];
                            dataToWrite.status = "failure";
                            finalDataToWriteFile.push(dataToWrite);
                            status.push("failure" + payload[i].name);
                            continue;
                        }
                        else if (searchDuplicateEmployee) {
                            dataToWrite = payload[i];
                            dataToWrite.status = "failure";
                            finalDataToWriteFile.push(dataToWrite);
                            status.push("failure" + payload[i].name);
                            continue;
                        }
                        else {
                            payload[i].userId = mongoose_1.Types.ObjectId(searchDuplicateUser._id);
                            payload[i].partnerId = mongoose_1.Types.ObjectId(partnerId);
                            await Promise.all([_entity_1.UserV1.update({ _id: mongoose_1.Types.ObjectId(searchDuplicateUser._id) }, { $addToSet: { partnerId: partnerId } }),
                                _entity_1.EmployeeV1.create(payload[i]),
                                exports.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(partnerId) }, { $inc: { totalEmployees: 1 } })
                            ]);
                            dataToWrite = payload[i];
                            dataToWrite.status = "success";
                            finalDataToWriteFile.push(dataToWrite);
                            status.push("success" + payload[i].name);
                            let html = await _common_1.employeeSignupTemplater(payload[i], findProperty.name);
                            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_SIGNUP_EMAIL(payload[i].email, html));
                            continue;
                        }
                    }
                    let searchDuplicateEmployee = await _entity_1.EmployeeV1.findOne({ partnerId: mongoose_1.Types.ObjectId(partnerId), $or: [{ email: payload[i].email }, { phoneNo: payload[i].phoneNo, countryCode: payload[i].countryCode }] });
                    if (payload[i].phoneNo.toString().length > 14 || payload[i].phoneNo.toString().length < 8 || payload[i].phoneNo.toString()[0] === '0') {
                        dataToWrite = payload[i];
                        dataToWrite.status = "failure";
                        finalDataToWriteFile.push(dataToWrite);
                        status.push("failure" + payload[i].name);
                        continue;
                    }
                    else if (searchDuplicateEmployee) {
                        dataToWrite = payload[i];
                        dataToWrite.status = "failure";
                        finalDataToWriteFile.push(dataToWrite);
                        status.push("failure" + payload[i].name);
                        continue;
                    }
                    else {
                        payload[i].partnerId = mongoose_1.Types.ObjectId(partnerId);
                        await Promise.all([
                            exports.PartnerV1.updateOne({ _id: mongoose_1.Types.ObjectId(partnerId) }, { $inc: { totalEmployees: 1 } }),
                            _entity_1.EmployeeV1.create(payload[i])
                        ]);
                        dataToWrite = payload[i];
                        dataToWrite.status = "success";
                        finalDataToWriteFile.push(dataToWrite);
                        status.push("success" + payload[i].name);
                        let html = await _common_1.employeeSignupTemplater(payload[i], findProperty.name);
                        _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_SIGNUP_EMAIL(payload[i].email, html));
                        continue;
                    }
                }
                const generatedSheetDetail = await this.generateExcelFile(finalDataToWriteFile);
                let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + `/src/views/Bulk employee/employee_bulk_upload.html`, {
                    logo: _common_1.CONSTANT.PAM_LOGO,
                    hostName: findHostEmail === null || findHostEmail === void 0 ? void 0 : findHostEmail.name,
                    facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                    igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                    twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                    linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                    welcome: "Pam",
                    webPanelUrl: _common_1.CONSTANT.EMAILER_URLS.WEB_PANEL,
                    contactUsUrl: _common_1.CONSTANT.EMAILER_URLS.CONTACT_US,
                    FAQUrl: _common_1.CONSTANT.EMAILER_URLS.FAQUrl,
                });
                setTimeout(async () => {
                    let s3Object = await _services_1.S3Invoice.uploadExcel(`${generatedSheetDetail}`, `${process.cwd()}/public/invoices/${generatedSheetDetail}`);
                    if (s3Object === null || s3Object === void 0 ? void 0 : s3Object.LocationUrl) {
                        _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.EMPLOYEE_SHEET_EMAIL(findHostEmail.email, html, [{ fileName: "Employee Status", path: `${process.cwd()}/uploads/${generatedSheetDetail}` }]));
                    }
                }, 1000);
                return;
            }
        }
        catch (error) {
            console.error("error in bulkEmployee", error);
        }
    }
    async generateExcelFile(fileData) {
        try {
            const createSheet = () => {
                return new Promise(resolve => {
                    var wb = new xl.Workbook();
                    var ws = wb.addWorksheet('Sheet');
                    ws.cell(1, 1)
                        .string('name');
                    ws.cell(1, 2)
                        .string('email');
                    ws.cell(1, 3)
                        .string('phoneNo');
                    ws.cell(1, 4)
                        .string('countryCode');
                    ws.cell(1, 5)
                        .string('status');
                    for (let i = 0; i < fileData.length; i++) {
                        let row = i + 2;
                        ws.cell(row, 1)
                            .string(fileData[i].name);
                        ws.cell(row, 2)
                            .string(fileData[i].email);
                        ws.cell(row, 3)
                            .number(fileData[i].phoneNo);
                        ws.cell(row, 4)
                            .number(fileData[i].countryCode);
                        ws.cell(row, 5)
                            .string(fileData[i].status);
                    }
                    resolve(wb);
                });
            };
            const sheetDetail = await createSheet();
            const fileName = `${+new Date()}.xlsx`;
            sheetDetail.write(`./public/invoices/${fileName}`);
            return fileName;
        }
        catch (error) {
            console.error(`we have an error in generateExcelFile method => ${error}`);
        }
    }
}
exports.PartnerV1 = new PartnerEntity(partner_model_1.default);
//# sourceMappingURL=partner.v1.entity.js.map