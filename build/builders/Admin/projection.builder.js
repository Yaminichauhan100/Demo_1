"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserList = void 0;
const _common_1 = require("@common");
exports.AdminUserList = {
    userDetails: {
        _id: 1,
        status: 1,
        accountStatus: 1,
        companyType: 1,
        type: 1,
        image: 1,
        emailVerified: 1,
        countryCode: 1,
        name: 1,
        email: 1,
        phoneNo: 1,
        createdAt: 1,
        updatedAt: 1,
        bookingCount: { $ifNull: ['$bookingCount.count', 0] }
    },
    hostDetails: {
        _id: 1,
        status: 1,
        accountStatus: 1,
        companyType: 1,
        commissionAmount: 1,
        type: 1,
        image: 1,
        emailVerified: 1,
        countryCode: 1,
        name: 1,
        email: 1,
        phoneNo: 1,
        createdAt: 1,
        updatedAt: 1,
        propertyCount: { $ifNull: ['$propertyCount.count', 0] }
    },
    AdminuserDetails: {
        _id: 1,
        status: 1, accountStatus: 1, userType: 1,
        companyType: 1, phoneVerified: 1,
        image: 1, emailVerified: 1,
        countryCode: 1, name: 1,
        email: 1, phoneNo: 1, createdAt: 1,
        updatedAt: 1,
        dob: 1
    },
    userCars: {
        _id: 1,
        status: 1, userType: 1,
        image: 1, emailVerified: 1,
        countryCode: 1, name: 1,
        email: 1, phoneNo: 1, createdAt: 1,
        updatedAt: 1, city: 1
    },
    AdminHostAndCompanyDetails: {
        _id: 1,
        image: 1,
        countryCode: 1,
        name: 1,
        bio: 1,
        email: 1,
        phoneNo: 1,
        dob: 1,
        gender: 1,
        govIdProof: 1,
        address: 1,
        status: 1,
        commissionAmount: 1,
        "companyDetails._id": 1,
        "companyDetails.name": 1,
        "companyDetails.email": 1,
        "companyDetails.countryCode": 1,
        "companyDetails.phoneNo": 1,
        "companyDetails.regNo": 1,
        "companyDetails.address": 1,
        "companyDetails.images": 1,
        "companyDetails.houseNo": 1,
        "companyDetails.documents": 1,
        "companyDetails.street": 1,
        "companyDetails.city": 1,
        "companyDetails.state": 1,
        "companyDetails.country": 1,
        "companyDetails.taxNo": 1,
        "companyDetails.status": 1,
        propertyCount: { $ifNull: ['$propertyCount.count', 0] },
        accountStatus: 1,
        taxNo: 1
    },
    AdminUserAndCompanyDetails: {
        _id: 1,
        image: 1,
        countryCode: 1,
        name: 1,
        bio: 1,
        email: 1,
        phoneNo: 1,
        dob: 1,
        gender: 1,
        govIdProof: 1,
        address: 1,
        status: 1,
        "companyDetails._id": 1,
        "companyDetails.name": 1,
        "companyDetails.email": 1,
        "companyDetails.countryCode": 1,
        "companyDetails.phoneNo": 1,
        "companyDetails.regNo": 1,
        "companyDetails.address": 1,
        "companyDetails.images": 1,
        "companyDetails.houseNo": 1,
        "companyDetails.documents": 1,
        "companyDetails.street": 1,
        "companyDetails.city": 1,
        "companyDetails.state": 1,
        "companyDetails.country": 1,
        "companyDetails.taxNo": 1,
        "companyDetails.status": 1,
        bookingCount: {
            $size: {
                $filter: {
                    input: "$bookingArray",
                    as: "booking",
                    cond: { $ne: ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ABANDONED] }
                }
            }
        },
        ongoingBookingCount: {
            $size: {
                $filter: {
                    input: "$bookingArray",
                    as: "booking",
                    cond: { $eq: ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.ONGOING] }
                }
            }
        },
        upComingBookingCount: {
            $size: {
                $filter: {
                    input: "$bookingArray",
                    as: "booking",
                    cond: { $eq: ["$$booking.bookingStatus", _common_1.ENUM.BOOKING.STATUS.UPCOMING] }
                }
            }
        },
        reviewCount: { $ifNull: ['$reviewCount.count', 0] },
    },
    payoutDetails: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        hostAmount: 1,
        "hostDetails.name": 1
    }
};
//# sourceMappingURL=projection.builder.js.map