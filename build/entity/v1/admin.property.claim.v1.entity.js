"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPropertyClaimV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const properties_model_1 = __importDefault(require("@models/properties.model"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const _baseController_1 = require("@baseController");
const _services_1 = require("@services");
const htmlHelper_1 = require("../../htmlHelper");
const xl = require('excel4node');
class AdminPropertyClaimEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async insertBulkProperties(data, locationPayload, adminDetail) {
        try {
            console.log(`sheetPayload ==>`, data);
            const mappedPropertyData = await this.mapBulkPropertyData(data, locationPayload);
            await this.bulkWritePropertyModel(mappedPropertyData, adminDetail);
        }
        catch (error) {
            console.error(`we have an error in insertBulkProperties entity ==> ${error}`);
        }
    }
    async bulkWritePropertyModel(mappedPropertyData, adminDetail) {
        var _a;
        try {
            const generatedSheet = await this.generateExcelFile(mappedPropertyData);
            for (let i = 0; i < mappedPropertyData.length; i++) {
                if (((_a = mappedPropertyData[i]) === null || _a === void 0 ? void 0 : _a.insertionStatus) === 'success') {
                    const payload = mappedPropertyData[i];
                    const addedPropertyDetail = await _entity_1.PropertyV1.saveProperty(payload);
                    await _entity_1.PropertyV1.postUpdatePropertyDocument(addedPropertyDetail);
                }
            }
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/adminSheetStatus.html", {
                logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                bannerLogo: _common_1.CONSTANT.BANNER_PNG,
                userName: 'Admin',
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD
            });
            setTimeout(async () => {
                let s3Object = await _services_1.S3Invoice.uploadExcel(`${generatedSheet}`, `${process.cwd()}/public/invoices/${generatedSheet}`);
                if (s3Object === null || s3Object === void 0 ? void 0 : s3Object.LocationUrl) {
                    await _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.ADMIN_SHEET_EMAIL(adminDetail === null || adminDetail === void 0 ? void 0 : adminDetail.email, html, [
                        {
                            fileName: "Property Upload Status",
                            path: `${process.cwd()}/public/invoices/${generatedSheet}`
                        }
                    ]));
                }
            }, 1000);
        }
        catch (error) {
            console.error(`we have an error in bulkWritePropertyModel entity ==> ${error}`);
        }
    }
    async generateExcelFile(fileData) {
        var _a, _b;
        try {
            let wb = new xl.Workbook();
            let ws = wb.addWorksheet('Sheet');
            ws.cell(1, 1).string('Name');
            ws.cell(1, 2).string('AddressLine1');
            ws.cell(1, 3).string('AddressLine2');
            ws.cell(1, 4).string('Pincode');
            ws.cell(1, 5).string('Description');
            ws.cell(1, 6).string('Coordinates');
            ws.cell(1, 7).string('StartingPrice');
            ws.cell(1, 8).string('TotalFloors');
            ws.cell(1, 9).string('Capacity');
            ws.cell(1, 10).string('BuildingType');
            ws.cell(1, 11).string('HostedBy');
            ws.cell(1, 12).string('insertionStatus');
            for (let i = 0; i < fileData.length; i++) {
                let row = i + 2;
                ws.cell(row, 1).string(fileData[i].Name);
                ws.cell(row, 2).string(fileData[i].AddressLine1);
                ws.cell(row, 3).string(fileData[i].AddressLine2);
                ws.cell(row, 4).string(fileData[i].Pincode);
                ws.cell(row, 5).string(fileData[i].Description);
                ws.cell(row, 6).string(fileData[i].Coordinates);
                ws.cell(row, 7).string(fileData[i].StartingPrice);
                ws.cell(row, 8).string(fileData[i].TotalFloors);
                ws.cell(row, 9).string(fileData[i].Capacity);
                ws.cell(row, 10).string(fileData[i].BuildingType);
                ws.cell(row, 11).string(fileData[i].HostedBy);
                ws.cell(row, 12).string(((_a = fileData[i]) === null || _a === void 0 ? void 0 : _a.insertionStatus) ? (_b = fileData[i]) === null || _b === void 0 ? void 0 : _b.insertionStatus : 'success');
            }
            const fileName = `sheet_${Date.now()}.xlsx`;
            await wb.write(`./public/invoices/${fileName}`);
            return fileName;
        }
        catch (error) {
            console.error(`we have an error in generateExcelFile method => ${error}`);
        }
    }
    async mapBulkPropertyData(propertyPayload, locationPayload) {
        try {
            return propertyPayload.map((payload) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if ((payload === null || payload === void 0 ? void 0 : payload.AddressLine1) && (payload === null || payload === void 0 ? void 0 : payload.AddressLine2)) {
                    payload['address'] = (payload === null || payload === void 0 ? void 0 : payload.AddressLine1) + ', ' + (payload === null || payload === void 0 ? void 0 : payload.AddressLine2) + ', ' + ((_a = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.city)) === null || _a === void 0 ? void 0 : _a.cityName) + ', ' + ((_b = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.state)) === null || _b === void 0 ? void 0 : _b.name) + ', ' + ((_c = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.country)) === null || _c === void 0 ? void 0 : _c.name);
                }
                else {
                    payload['address'] = (payload === null || payload === void 0 ? void 0 : payload.AddressLine1) + ', ' + ((_d = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.city)) === null || _d === void 0 ? void 0 : _d.cityName) + ', ' + ((_e = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.state)) === null || _e === void 0 ? void 0 : _e.name) + ', ' + ((_f = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.country)) === null || _f === void 0 ? void 0 : _f.name);
                }
                payload['userData'] = { name: payload === null || payload === void 0 ? void 0 : payload.HostedBy };
                (payload === null || payload === void 0 ? void 0 : payload.Name) ? payload['name'] = payload === null || payload === void 0 ? void 0 : payload.Name : payload['insertionStatus'] = 'failed';
                payload['addressPrimary'] = payload === null || payload === void 0 ? void 0 : payload.AddressLine1;
                payload['addressSecondary'] = payload === null || payload === void 0 ? void 0 : payload.AddressLine2;
                payload['zipCode'] = payload === null || payload === void 0 ? void 0 : payload.Pincode;
                (payload === null || payload === void 0 ? void 0 : payload.Description) && ((_g = payload === null || payload === void 0 ? void 0 : payload.Description) === null || _g === void 0 ? void 0 : _g.length) <= 450 ? payload['description'] = payload === null || payload === void 0 ? void 0 : payload.Description.split('+').join().trim() : payload['insertionStatus'] = 'failed';
                payload['claimedStatus'] = false;
                payload['images'] = _common_1.CONSTANT.CLAIMED_STATIC_IMAGES;
                payload['country'] = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.country);
                payload['state'] = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.state);
                payload['city'] = JSON.parse(locationPayload === null || locationPayload === void 0 ? void 0 : locationPayload.city);
                payload['location'] = payload['location'] ? { coordinates: JSON.parse(payload === null || payload === void 0 ? void 0 : payload.Coordinates) } : { coordinates: [0, 0] };
                payload['location']['type'] = "Point";
                payload['propertyType'] = ((_h = payload === null || payload === void 0 ? void 0 : payload.BuildingType) === null || _h === void 0 ? void 0 : _h.startsWith('Entire')) ?
                    _common_1.ENUM.PROPERTY.PARTNER_TYPE.FULL_FLOOR :
                    _common_1.ENUM.PROPERTY.PARTNER_TYPE.PARTIAL_FLOOR;
                payload['startingPrice'] = (payload === null || payload === void 0 ? void 0 : payload.StartingPrice) ? payload === null || payload === void 0 ? void 0 : payload.StartingPrice : 0;
                payload['totalCapacity'] = payload === null || payload === void 0 ? void 0 : payload.Capacity;
                payload['status'] = _common_1.ENUM.PROPERTY.STATUS.DRAFT;
                payload['totalFloorCount'] = payload === null || payload === void 0 ? void 0 : payload.TotalFloors;
                payload['insertionStatus'] ? payload['insertionStatus'] : payload['insertionStatus'] = 'success';
                console.log(`add property payload ==>`, payload);
                return payload;
            });
        }
        catch (error) {
            console.error(`we have an error in mapBulkPropertyData entity -- ==> ${error}`);
        }
    }
    async validateAndUpdateProperty(property, payload, headers, res) {
        try {
            const propertyData = await this.formatUpdatePropertyPayload(payload, property);
            propertyData['location'] = payload['location'];
            await _entity_1.PropertyV1.updateProperty(propertyData, payload.id);
            return _baseController_1.handleEntityResponse.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_UPDATED);
        }
        catch (error) {
            console.error(`we have an error in validateAndUpdateProperty ==> ${error}`);
        }
    }
    async formatUpdatePropertyPayload(payload, property) {
        var _a, _b, _c, _d, _e, _f;
        try {
            let propertyData = {
                status: property.status,
                propertyId: property._id,
                name: property.name,
                address: property === null || property === void 0 ? void 0 : property.address,
                images: property.images,
                autoAcceptUpcomingBooking: property.autoAcceptUpcomingBooking
            };
            if (payload.images) {
                propertyData['images'] = payload.images;
            }
            payload['addressPrimary'] ? propertyData['addressPrimary'] = payload === null || payload === void 0 ? void 0 : payload.addressPrimary : "";
            payload['addressSecondary'] ? propertyData['addressSecondary'] = payload === null || payload === void 0 ? void 0 : payload.addressSecondary : "";
            payload['startingPrice'] ? propertyData['startingPrice'] = payload === null || payload === void 0 ? void 0 : payload.startingPrice : "";
            payload['zipCode'] ? propertyData['zipCode'] = payload['zipCode'] : "";
            payload['amenities'] ? propertyData['amenities'] = payload['amenities'] : "";
            payload['city'] ? propertyData['city'] = payload['city'] : "";
            payload['country'] ? propertyData['country'] = payload['country'] : "";
            payload['state'] ? propertyData['state'] = payload['state'] : "";
            payload['location'] ? propertyData['location'] = payload['location'] : "";
            payload['description'] ? propertyData['description'] = payload['description'] : "";
            payload['propertyType'] ? propertyData['propertyType'] = payload['propertyType'] : "";
            if ((payload === null || payload === void 0 ? void 0 : payload.addressPrimary) && (payload === null || payload === void 0 ? void 0 : payload.addressSecondary)) {
                propertyData['address'] = (payload === null || payload === void 0 ? void 0 : payload.addressPrimary) + ', ' + (payload === null || payload === void 0 ? void 0 : payload.addressSecondary) + ', ' + ((_a = payload === null || payload === void 0 ? void 0 : payload.city) === null || _a === void 0 ? void 0 : _a.cityName) + ', ' + ((_b = payload === null || payload === void 0 ? void 0 : payload.state) === null || _b === void 0 ? void 0 : _b.name) + ', ' + ((_c = payload === null || payload === void 0 ? void 0 : payload.country) === null || _c === void 0 ? void 0 : _c.name);
            }
            else {
                propertyData['address'] = (payload === null || payload === void 0 ? void 0 : payload.addressPrimary) + ', ' + ((_d = payload === null || payload === void 0 ? void 0 : payload.city) === null || _d === void 0 ? void 0 : _d.cityName) + ', ' + ((_e = payload === null || payload === void 0 ? void 0 : payload.state) === null || _e === void 0 ? void 0 : _e.name) + ', ' + ((_f = payload === null || payload === void 0 ? void 0 : payload.country) === null || _f === void 0 ? void 0 : _f.name);
            }
            if (payload.name) {
                propertyData['name'] = payload['name'];
                Promise.all([
                    _entity_1.PropertySpaceV1.updateEntity({ propertyId: mongoose_1.Types.ObjectId(payload.id) }, { propertyName: payload.name }, { multi: true }),
                    _entity_1.PartnerV1.updateEntity({ "property._id": mongoose_1.Types.ObjectId(payload.id) }, { "property.name": payload.name }, { multi: true })
                ]);
            }
            return propertyData;
        }
        catch (error) {
            console.error(`we have an error in formatUpdatePropertyPayload ==> ${error}`);
        }
    }
}
exports.AdminPropertyClaimV1 = new AdminPropertyClaimEntity(properties_model_1.default);
//# sourceMappingURL=admin.property.claim.v1.entity.js.map