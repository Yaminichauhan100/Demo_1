"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminV1 = void 0;
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const base_entity_1 = __importDefault(require("../base.entity"));
const admin_model_1 = __importDefault(require("@models/admin.model"));
const admin_session_model_1 = __importDefault(require("@models/admin_session.model"));
const property_details_entity_1 = require("./property.details.entity");
const booking_v1_entity_1 = require("./booking.v1.entity");
class AdminEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createAdmin(payload) {
        payload.password = _services_1.Auth.hashData('Admin@123', payload.salt);
        let adminData = await new this.model(payload).save();
        return adminData.toObject();
    }
    async verifyPassword(adminData, password) {
        return adminData['password'] === _services_1.Auth.hashData(password, adminData.salt);
    }
    filterAdminData(adminData) {
        delete adminData.password;
        delete adminData.salt;
        return adminData;
    }
    async createNewSession(payload) {
        payload.adminId = mongoose_1.Types.ObjectId(payload.adminId);
        const sessionData = await new admin_session_model_1.default(payload).save();
        return sessionData.toObject();
    }
    async removePreviousSession(id, multi) {
        if (multi)
            await admin_session_model_1.default.updateMany({ adminId: id, isActive: true }, { isActive: false });
        else
            await admin_session_model_1.default.updateOne({ _id: id }, { isActive: false });
    }
    async updateFeaturedProp(propertyId, isFeaturedProperty, next) {
        try {
            const updatedResponse = await property_details_entity_1.PropertyV1.updateEntity({ _id: propertyId }, { isFeaturedProperty: isFeaturedProperty });
            return updatedResponse.data;
        }
        catch (error) {
            console.error(`we have an error in admin entity ==> ${error}`);
            next(error);
            return Promise.reject(error);
        }
    }
    async fetchBookingDetail(bookingId) {
        try {
            let pipeline = [];
            pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(bookingId) } });
            pipeline.push({
                $project: {
                    propertyData: 1,
                    timing: 1,
                    categoryData: {
                        category: "$category",
                        subCategory: '$subCategory',
                    },
                    fromDate: 1,
                    toDate: 1,
                    cartInfo: 1,
                    occupancy: 1,
                    userBookingStatus: 1,
                    bookingStatus: 1,
                    createdAt: 1,
                    quantity: 1,
                    price: "$basePrice",
                    totalPrice: "$totalPayable",
                    discount: { $literal: 0 },
                    bookingId: 1,
                    downloadInvoice: { $literal: 'N/A' },
                    acceptedOn: 1,
                    rejectedOn: 1,
                    isEmployee: 1,
                    floorNumber: 1,
                    floorDescription: 1,
                    floorLabel: 1,
                    bookingType: 1,
                    hostInvoice: 1,
                    invoiceUrl: 1
                }
            });
            let response = await booking_v1_entity_1.BookingV1.basicAggregate(pipeline);
            return response;
        }
        catch (error) {
            console.error(`we have an error in admin entity ==> ${error}`);
        }
    }
}
exports.AdminV1 = new AdminEntity(admin_model_1.default);
//# sourceMappingURL=admin.v1.entity.js.map