"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION = void 0;
const celebrate_1 = require("celebrate");
const enum_common_1 = require("./enum.common");
const constant_common_1 = require("./constant.common");
exports.VALIDATION = {
    ADMIN: {
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        EMAIL: celebrate_1.Joi.string().trim().email(),
        PASSWORD: celebrate_1.Joi.string().min(6).max(32),
        NAME: celebrate_1.Joi.string().trim().min(2).max(40),
        PROFILE_PHOTO: celebrate_1.Joi.string().trim().uri(),
        META_TOKEN: celebrate_1.Joi.string()
    },
    TAXES: {
        LEVEL: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.ADMIN_TAXES_LEVEL.COUNTRY, constant_common_1.CONSTANT.ADMIN_TAXES_LEVEL.STATE),
        STATE: celebrate_1.Joi.array().items({ id: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i), tax: celebrate_1.Joi.number().min(0) })
    },
    ADMIN_HOST_LISTING: {
        REG_START_DATE: celebrate_1.Joi.date().iso(),
        REG_END_DATE: celebrate_1.Joi.date().iso(),
        MIN_PROPERTY: celebrate_1.Joi.number().min(0).max(1000),
        MAX_PROPERTY: celebrate_1.Joi.number().min(0).max(1000),
    },
    ADMIN_USER_LISTING: {
        REG_START_DATE: celebrate_1.Joi.date().iso(),
        REG_END_DATE: celebrate_1.Joi.date().iso(),
        MIN_BOOKING: celebrate_1.Joi.number(),
        MAX_BOOKING: celebrate_1.Joi.number(),
        COMPANY_TYPE: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.USER.COMPANY_TYPE)
    },
    ADMIN_PROPERTY_LISTING: {
        REG_START_DATE: celebrate_1.Joi.string(),
        REG_END_DATE: celebrate_1.Joi.string(),
        MIN_BOOKING: celebrate_1.Joi.number(),
        MAX_BOOKING: celebrate_1.Joi.number(),
    },
    NOTIFICATION: {
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).required(),
        ID_OPTIONAL: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
    },
    USER: {
        NAME: celebrate_1.Joi.string().min(3).max(40),
        EMAIL: celebrate_1.Joi.string().trim().email().max(100),
        PASSWORD: celebrate_1.Joi.string().min(8).max(20),
        COUNTRY_CODE: celebrate_1.Joi.string(),
        PHONE: celebrate_1.Joi.string().min(8).max(15),
        DOB: celebrate_1.Joi.string(),
        address: celebrate_1.Joi.string(),
        IMAGE: celebrate_1.Joi.string().allow("", null),
        COMPANY_TYPE: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.USER.COMPANY_TYPE),
        OTP: celebrate_1.Joi.string(),
        DEVICE: celebrate_1.Joi.object().keys({
            type: celebrate_1.Joi.number(),
            token: celebrate_1.Joi.string().allow('')
        }),
        RESET_TOKEN: celebrate_1.Joi.string(),
        SOCIAL_LOGIN_TYPE: celebrate_1.Joi.string().required().valid(enum_common_1.ENUM_ARRAY.SOCIAL_LOGIN_TYPE.PLATFORM),
        SOCIAL_ID: celebrate_1.Joi.string().required(),
        STATUS: celebrate_1.Joi.string(),
        ACCOUNT_STATUS: celebrate_1.Joi.string(),
        SORT: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.SORT_BY),
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        TYPE: celebrate_1.Joi.string().optional().valid(enum_common_1.ENUM_ARRAY.USER.TYPE),
        USER_TYPE: celebrate_1.Joi.number().optional().valid(enum_common_1.ENUM_ARRAY.USER.TYPE),
        DEEP_LINK_TYPE: celebrate_1.Joi.number().optional().valid(enum_common_1.ENUM_ARRAY.USER.DEEP_LINK_TYPE),
        CITY: celebrate_1.Joi.string().allow(null, ""),
        BIO: celebrate_1.Joi.string().allow(null, "").optional().max(450),
        GENDER: celebrate_1.Joi.string().optional().valid(enum_common_1.ENUM_ARRAY.USER.GENDER),
        LATITUDE: celebrate_1.Joi.number().min(-90).max(90),
        LONGITUDE: celebrate_1.Joi.number().min(-180).max(180),
        COUNTRYID: celebrate_1.Joi.string(),
        STATE_ID: celebrate_1.Joi.string(),
        KEYWORD: celebrate_1.Joi.string(),
        CATEGORY: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).allow(null, ""),
        fromDate: celebrate_1.Joi.date().iso(),
        toDate: celebrate_1.Joi.date().iso(),
        COWORKER_EMAILS: celebrate_1.Joi.array().items(celebrate_1.Joi.string().email()),
        COHOST_TYPE: celebrate_1.Joi.number().required().valid(0, 1, 2),
        COHOST_DETAILS_TYPE: celebrate_1.Joi.number().required().valid(0, 1)
    },
    FAQ: {
        QUESTION: celebrate_1.Joi.string().required(),
        ANSWER: celebrate_1.Joi.string(),
        LANG: celebrate_1.Joi.string(),
        USERTYPE: celebrate_1.Joi.number().required(),
        SORT_ORDER: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.FAQ_SORT_ORDER_ACTION.ANSWER, constant_common_1.CONSTANT.FAQ_SORT_ORDER_ACTION.QUESTION),
        TYPE: celebrate_1.Joi.number().required().valid(constant_common_1.CONSTANT.FAQ_ACTION.ACTIVE, constant_common_1.CONSTANT.FAQ_ACTION.INACTIVE),
    },
    TNC: {
        CONTENT: celebrate_1.Joi.string(),
        TITLE: celebrate_1.Joi.string(),
        LANG: celebrate_1.Joi.string(),
        EDIT_TYPE: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.TANDC_EDITOR.EDITOR, constant_common_1.CONSTANT.TANDC_EDITOR.EDIT_HTML),
        TYPE: celebrate_1.Joi.number().required().valid(constant_common_1.CONSTANT.TANDC.TERMSANDCONDITION, constant_common_1.CONSTANT.TANDC.PRIVACYPOLICY, constant_common_1.CONSTANT.TANDC.ABOUTUS, constant_common_1.CONSTANT.TANDC.FAQ, constant_common_1.CONSTANT.TANDC.STORY, constant_common_1.CONSTANT.TANDC.TEAM, enum_common_1.ENUM.ADMIN.CONTENT_TYPE.REFUND_POLICY, enum_common_1.ENUM.ADMIN.CONTENT_TYPE.PAYMENT_POLICY)
    },
    HOST_COMPANY_DETAILS: {
        NAME: celebrate_1.Joi.string().min(2).max(80),
        EMAIL: celebrate_1.Joi.string().trim().email().max(100),
        PROFILE_PICTURE: celebrate_1.Joi.string().allow("", null),
        COUNTRY_CODE: celebrate_1.Joi.string(),
        STREET: celebrate_1.Joi.string().allow(null, "").min(3).max(100).error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case "string.min":
                        err.message = `AddressLine2 length must be atleast 3 characters long`;
                        break;
                    case "string.max":
                        err.message = `AddressLine2 length must be less than 100 characters`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
        LANDMARK: celebrate_1.Joi.string().min(2).max(140),
        COUNTRY: celebrate_1.Joi.string(),
        REGISTRATION_NUMBER: celebrate_1.Joi.string().min(2).max(40).allow(null, ""),
        ZIP_CODE: celebrate_1.Joi.string().min(4).max(12),
        HOUSE_NUMBER: celebrate_1.Joi.string().allow(null, "").min(3).max(100).error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case "string.min":
                        err.message = `AddressLine1 length must be atleast 3 characters long`;
                        break;
                    case "string.max":
                        err.message = `AddressLine1 length must be less than 100 characters`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
        PHONE: celebrate_1.Joi.string().min(8).max(14),
        IMAGE: celebrate_1.Joi.string().allow("", null),
        COMPANY_TYPE: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.USER.COMPANY_TYPE),
        SORT: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.SORT_BY),
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        CITY: celebrate_1.Joi.string().allow(null, ""),
        STATE: celebrate_1.Joi.string().allow(null, ""),
        TAX_NUMBER: celebrate_1.Joi.string().min(2).max(40).allow(null, ""),
        LATITUDE: celebrate_1.Joi.number().min(-90).max(90),
        LONGITUDE: celebrate_1.Joi.number().min(-180).max(180),
        DOCUMENT: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).allow(null, ""),
        STATE_ID: celebrate_1.Joi.number(),
        COUNTRY_ID: celebrate_1.Joi.number(),
        tnc: celebrate_1.Joi.boolean().valid(true, false)
    },
    PROPERTY: {
        STATE_ID: celebrate_1.Joi.number(),
        NAME: celebrate_1.Joi.string().min(3).max(40).trim(),
        FAVOURITE_ACTION: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.FAV_ACTION.ADD, constant_common_1.CONSTANT.FAV_ACTION.REMOVE),
        USER_TYPE: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.PROPERTY_USER_TYPE.USER, constant_common_1.CONSTANT.PROPERTY_USER_TYPE.EMPLOYEE),
        FAV_BOOKING_STATUS: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.FAV_BOOKING_ACTION.NEVER, constant_common_1.CONSTANT.FAV_BOOKING_ACTION.PREVIOUS),
        BOOKING_STATUS: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.BOOKING.STATUS.ACCEPTED, constant_common_1.CONSTANT.BOOKING.STATUS.REJECTED, constant_common_1.CONSTANT.BOOKING.STATUS.ABANDONED, constant_common_1.CONSTANT.BOOKING.STATUS.CANCELLED, constant_common_1.CONSTANT.BOOKING.STATUS.COMPLETED, constant_common_1.CONSTANT.BOOKING.STATUS.ONGOING),
        BOOKING_MODE: celebrate_1.Joi.number().valid(enum_common_1.ENUM.BOOKING_MODE.STATUS.OFFLINE, enum_common_1.ENUM.BOOKING_MODE.STATUS.ONLINE),
        BOOKING_TYPE: celebrate_1.Joi.number().valid(enum_common_1.ENUM.USER.BOOKING_TYPE.HOURLY, enum_common_1.ENUM.USER.BOOKING_TYPE.MONTHLY, enum_common_1.ENUM.USER.BOOKING_TYPE.CUSTOM, enum_common_1.ENUM.USER.BOOKING_TYPE.EMPLOYEE),
        PARTNER_BOOKING_TYPE: celebrate_1.Joi.number().valid(enum_common_1.ENUM.USER.BOOKING_TYPE.HOURLY, enum_common_1.ENUM.USER.BOOKING_TYPE.MONTHLY, enum_common_1.ENUM.USER.BOOKING_TYPE.CUSTOM),
        BOOKING_REQUEST: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.BOOKING.REQUEST, constant_common_1.CONSTANT.BOOKING.ACCEPTED, constant_common_1.CONSTANT.BOOKING.REJECTED, constant_common_1.CONSTANT.BOOKING.OFFLINE, constant_common_1.CONSTANT.BOOKING.HISTORY, constant_common_1.CONSTANT.BOOKING.UPCOMING, constant_common_1.CONSTANT.BOOKING.ONGOING, constant_common_1.CONSTANT.BOOKING.ALL),
        FLOOR_DETAILS: celebrate_1.Joi.array()
            .items({
            subCategory: celebrate_1.Joi.object({
                _id: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).trim(),
                name: celebrate_1.Joi.string().trim(),
                description: celebrate_1.Joi.string().allow(null, '').trim(),
                iconImage: celebrate_1.Joi.string().allow(null, '').trim().optional(),
                parentId: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).trim()
            }),
            category: celebrate_1.Joi.object({
                _id: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).trim(),
                name: celebrate_1.Joi.string().trim(),
                description: celebrate_1.Joi.string().allow(null, '').trim(),
                iconImage: celebrate_1.Joi.string().allow(null, '').trim().optional(),
                colorCode: celebrate_1.Joi.string().trim(),
                options: celebrate_1.Joi.array().allow(null, ''),
            }),
            floorNumber: celebrate_1.Joi.number(),
            floorLabel: celebrate_1.Joi.string().allow(null, '').trim(),
            floorDescription: celebrate_1.Joi.string().allow(null, '').trim(),
            capacity: celebrate_1.Joi.number(),
            units: celebrate_1.Joi.number().required(),
            isEmployee: celebrate_1.Joi.boolean().required(),
            bookingType: celebrate_1.Joi.number().valid(enum_common_1.ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE).required(),
            position: celebrate_1.Joi.object({
                x: celebrate_1.Joi.number().required(),
                y: celebrate_1.Joi.number().required()
            }),
            gridRow: celebrate_1.Joi.number().min(0).required(),
            gridColumn: celebrate_1.Joi.number().min(0).required(),
            floorImage: celebrate_1.Joi.string().required(),
            spaceLabel: celebrate_1.Joi.string().allow('').trim(),
            pricing: celebrate_1.Joi.object({
                daily: celebrate_1.Joi.number(),
                monthly: celebrate_1.Joi.number(),
                hourly: celebrate_1.Joi.number(),
            }),
            offerPrice: celebrate_1.Joi.array().items({
                selectedMaxValue: celebrate_1.Joi.any(),
                selectedMinValue: celebrate_1.Joi.any(),
                seasonName: celebrate_1.Joi.string().required(),
                startDate: celebrate_1.Joi.date().required(),
                endDate: celebrate_1.Joi.date().required(),
                priceDetails: celebrate_1.Joi.array().items({
                    discountLabelType: celebrate_1.Joi.number().valid([
                        enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION,
                        enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION,
                        enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS
                    ]).required(),
                    months: celebrate_1.Joi.number(),
                    days: celebrate_1.Joi.number(),
                    discountPercentage: celebrate_1.Joi.number(),
                    minUnits: celebrate_1.Joi.number(),
                    maxUnits: celebrate_1.Joi.number(),
                }),
                priceRange: celebrate_1.Joi.object({
                    dailyPrice: celebrate_1.Joi.object({
                        min: celebrate_1.Joi.number().required(),
                        max: celebrate_1.Joi.number().required(),
                    }).required(),
                    monthlyPrice: celebrate_1.Joi.object({
                        min: celebrate_1.Joi.number().required(),
                        max: celebrate_1.Joi.number().required(),
                    }).required(),
                    hourlyPrice: celebrate_1.Joi.object({
                        min: celebrate_1.Joi.number().required(),
                        max: celebrate_1.Joi.number().required(),
                    }).required()
                })
            }).allow([]),
            isOfferPrice: celebrate_1.Joi.number().valid([
                enum_common_1.ENUM.IS_OFFER_PRICE.TRUE,
                enum_common_1.ENUM.IS_OFFER_PRICE.FALSE
            ])
        }),
        PARTNER_FLOOR_DETAILS: celebrate_1.Joi.array()
            .items({
            spaceId: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        }),
        EDITABLE_FLOOR_DETAILS: celebrate_1.Joi.array()
            .items({
            floorId: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
            floorDescription: celebrate_1.Joi.string().trim(),
            subCategory: celebrate_1.Joi.object({
                _id: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).trim(),
                name: celebrate_1.Joi.string().trim(),
                description: celebrate_1.Joi.string().allow(null, '').trim(),
                iconImage: celebrate_1.Joi.string().allow(null, '').trim(),
                parentId: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).trim()
            }).required(),
            category: celebrate_1.Joi.object({
                _id: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).trim(),
                name: celebrate_1.Joi.string().trim(),
                description: celebrate_1.Joi.string().allow(null, '').trim(),
                iconImage: celebrate_1.Joi.string().allow(null, '').trim(),
                colorCode: celebrate_1.Joi.string().trim(),
                options: celebrate_1.Joi.array().allow(null, ''),
            }).required(),
            floorNumber: celebrate_1.Joi.number(),
            floorLabel: celebrate_1.Joi.string().allow(null, ''),
            capacity: celebrate_1.Joi.number(),
            units: celebrate_1.Joi.number().required(),
            isEmployee: celebrate_1.Joi.boolean().required(),
            bookingType: celebrate_1.Joi.number().valid(enum_common_1.ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE).required(),
            position: celebrate_1.Joi.object({
                x: celebrate_1.Joi.number().required(),
                y: celebrate_1.Joi.number().required()
            }).required(),
            gridRow: celebrate_1.Joi.number().min(0).required(),
            gridColumn: celebrate_1.Joi.number().min(0).required(),
            floorImage: celebrate_1.Joi.string().required(),
            spaceLabel: celebrate_1.Joi.string().allow('').trim(),
            pricing: celebrate_1.Joi.object({
                daily: celebrate_1.Joi.number(),
                monthly: celebrate_1.Joi.number(),
                hourly: celebrate_1.Joi.number(),
            }).required(),
            offerPrice: celebrate_1.Joi.array().items({
                selectedMaxValue: celebrate_1.Joi.any(),
                selectedMinValue: celebrate_1.Joi.any(),
                seasonName: celebrate_1.Joi.string().required().trim(),
                startDate: celebrate_1.Joi.date().required(),
                endDate: celebrate_1.Joi.date().required(),
                priceDetails: celebrate_1.Joi.array().items({
                    discountLabelType: celebrate_1.Joi.number().valid([
                        enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION,
                        enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION,
                        enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS
                    ]).required(),
                    months: celebrate_1.Joi.number(),
                    days: celebrate_1.Joi.number(),
                    discountPercentage: celebrate_1.Joi.number(),
                    minUnits: celebrate_1.Joi.number(),
                    maxUnits: celebrate_1.Joi.number(),
                }),
                priceRange: celebrate_1.Joi.object({
                    dailyPrice: celebrate_1.Joi.object({
                        min: celebrate_1.Joi.number().required(),
                        max: celebrate_1.Joi.number().required(),
                    }).required(),
                    monthlyPrice: celebrate_1.Joi.object({
                        min: celebrate_1.Joi.number().required(),
                        max: celebrate_1.Joi.number().required(),
                    }).required(),
                    hourlyPrice: celebrate_1.Joi.object({
                        min: celebrate_1.Joi.number().required(),
                        max: celebrate_1.Joi.number().required(),
                    }).required()
                })
            }).allow([]),
            isOfferPrice: celebrate_1.Joi.number().valid([
                enum_common_1.ENUM.IS_OFFER_PRICE.TRUE,
                enum_common_1.ENUM.IS_OFFER_PRICE.FALSE
            ])
        }),
        BOOKING_SORTKEY: celebrate_1.Joi.any(),
        BOOKING_REQUEST_TYPE: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.BOOKING_REQUEST_STATUS.ACCEPT, constant_common_1.CONSTANT.BOOKING_REQUEST_STATUS.REJECT),
        STREET: celebrate_1.Joi.string().allow(null, "").min(3).max(100).error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case "string.min":
                        err.message = `AddressLine2 length must be atleast 3 characters long`;
                        break;
                    case "string.max":
                        err.message = `AddressLine2 length must be less than 100 characters`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
        STATUS: celebrate_1.Joi.string().valid(enum_common_1.ENUM.PROPERTY.STATUS.ACTIVE, enum_common_1.ENUM.PROPERTY.STATUS.INACTIVE),
        PROPERTY_DRAFT_STATUS: celebrate_1.Joi.string().valid(enum_common_1.ENUM.PROPERTY.STATUS.ACTIVE, enum_common_1.ENUM.PROPERTY.STATUS.DRAFT),
        TO_BE_PUBLISHED: celebrate_1.Joi.string().valid(true, false),
        LANDMARK: celebrate_1.Joi.string(),
        COUNTRY: celebrate_1.Joi.string(),
        ZIP_CODE: celebrate_1.Joi.string().min(4).max(12),
        HOUSE_NUMBER: celebrate_1.Joi.string().min(3).max(100).required(),
        ADDRESS_PRIMARY: celebrate_1.Joi.string().min(3).max(100),
        ADDRESS_SECONDARY: celebrate_1.Joi.string().min(3).max(100).allow(null, ''),
        LANE1: celebrate_1.Joi.string().min(3).max(100).error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case "string.min":
                        err.message = `Lane1 length must be atleast 3 characters long`;
                        break;
                    case "any.required":
                        err.message = "Lane1 is required!";
                        break;
                    case "string.max":
                        err.message = `Lane1 length must be less than 100 characters`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
        LANE2: celebrate_1.Joi.string().min(3).max(100).error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case "string.min":
                        err.message = `Lane2 length must be atleast 3 characters long`;
                        break;
                    case "any.required":
                        err.message = "Lane2 is required!";
                        break;
                    case "string.max":
                        err.message = `Lane2 length must be less than 100 characters`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
        IMAGES: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).allow(null, ""),
        HEADING: celebrate_1.Joi.string(),
        DOCS: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
            url: celebrate_1.Joi.string().required(),
            name: celebrate_1.Joi.string().required(),
            type: celebrate_1.Joi.string().required()
        })),
        floorCorners: celebrate_1.Joi.array()
            .items(celebrate_1.Joi.object({
            floorNumber: celebrate_1.Joi.number().required(),
            cornerLabels: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
                floorKey: celebrate_1.Joi.string().required(),
                floorLabel: celebrate_1.Joi.string().allow(null, "").required()
            }))
        })),
        DESCRIPTION: celebrate_1.Joi.string().allow(null, ""),
        BUILT_UP_AREA: celebrate_1.Joi.number(),
        FLOOR: celebrate_1.Joi.number(),
        PROPERTY_TYPE: celebrate_1.Joi.number().valid(enum_common_1.ENUM.PROPERTY.PROPERTY_TYPE.ENTIRE_BUILDING, enum_common_1.ENUM.PROPERTY.PROPERTY_TYPE.SPECIFIC_FLOOR),
        AUTO_ACCEPT_BOOKING: celebrate_1.Joi.boolean().valid(true, false),
        UPCOMING_BOOKING: celebrate_1.Joi.boolean().valid(true, false),
        CITY: celebrate_1.Joi.string().allow(null, ""),
        TAGS: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).allow(null, ""),
        STATE: celebrate_1.Joi.string().allow(null, ""),
        SEARCH: celebrate_1.Joi.string(),
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        AMENITIES: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
            amenityId: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
            name: celebrate_1.Joi.string().required(),
            iconImage: celebrate_1.Joi.string().required(),
            type: celebrate_1.Joi.string().required(),
            status: celebrate_1.Joi.string(),
            _id: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
            isFeatured: celebrate_1.Joi.number()
        })),
        STATE_OBJ: celebrate_1.Joi.any(),
        COUNTRY_OBJ: celebrate_1.Joi.any(),
        CITY_OBJ: celebrate_1.Joi.any(),
        COUNTRY_ID: celebrate_1.Joi.number(),
        LOCATION: celebrate_1.Joi.object().keys({
            coordinates: celebrate_1.Joi.array().ordered(...[
                celebrate_1.Joi.number().min(-180).max(180).required().error(Error(`Valid longitude values are between -180 and 180, both inclusive`)),
                celebrate_1.Joi.number().min(-90).max(90).required().error(Error(`Valid latitude values are between -90 and 90, both inclusive.`))
            ]).description("first Parameter Longitude, second latitude").length(2)
        }),
        EDITABLE_LOCATION: celebrate_1.Joi.object().keys({
            coordinates: celebrate_1.Joi.array().ordered(...[
                celebrate_1.Joi.number().min(-180).max(180).required().error(Error(`Valid longitude values are between -180 and 180, both inclusive`)),
                celebrate_1.Joi.number().min(-90).max(90).required().error(Error(`Valid latitude values are between -90 and 90, both inclusive.`))
            ]).description("first Parameter Longitude, second latitude").length(2)
        }).required(),
        PROPERTY_IDS: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).allow(null, ""),
        CATEGORY_ID: celebrate_1.Joi.any(),
        CITY_ID: celebrate_1.Joi.any(),
        AMENITIES_ID: celebrate_1.Joi.string().allow("", null),
        fromDate: celebrate_1.Joi.date().iso(),
        toDate: celebrate_1.Joi.date().iso(),
        type: celebrate_1.Joi.string().required().valid('activate', 'active', 'inactive', 'isDelete', 'archive'),
        partnerType: celebrate_1.Joi.string().required().valid('active', 'inactive', 'delete'),
        PROPERTYID: celebrate_1.Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    },
    BOOKING: {
        SORT_KEY: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.BOOKING_HOST_SORT.AUTO, constant_common_1.CONSTANT.BOOKING_HOST_SORT.MANUAL, constant_common_1.CONSTANT.BOOKING_HOST_SORT.ALL),
        Type: celebrate_1.Joi.number().valid(0, 1),
        BOOKING_TYPE: celebrate_1.Joi.number().valid(enum_common_1.ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE).required(),
        ADMIN_BOOKING_TYPE: celebrate_1.Joi.number().valid(enum_common_1.ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE)
    },
    PAYMENT: {
        type: celebrate_1.Joi.number().valid(constant_common_1.CONSTANT.PAYMENT_TYPE.PENDING, constant_common_1.CONSTANT.PAYMENT_TYPE.SETTLED, constant_common_1.CONSTANT.PAYMENT_TYPE.TOTAL),
    },
    PROPERTY_SPACES: {
        IS_OFFER_PRICE: celebrate_1.Joi.number().valid([
            enum_common_1.ENUM.IS_OFFER_PRICE.TRUE,
            enum_common_1.ENUM.IS_OFFER_PRICE.FALSE
        ]),
        spaceId: celebrate_1.Joi.string(),
        images: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).allow(null, ""),
        isDelete: celebrate_1.Joi.boolean(),
        capacity: celebrate_1.Joi.number(),
        units: celebrate_1.Joi.number(),
        dailyPrice: celebrate_1.Joi.number(),
        monthlyPrice: celebrate_1.Joi.number(),
        yearlyPrice: celebrate_1.Joi.number(),
        hourlyPrice: celebrate_1.Joi.number(),
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).required(),
        CATEGORY_ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        SUBCATEGORY_ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        OFFER_PRICE: celebrate_1.Joi.array().items({
            selectedMaxValue: celebrate_1.Joi.number(),
            selectedMinValue: celebrate_1.Joi.number(),
            seasonName: celebrate_1.Joi.string().required(),
            startDate: celebrate_1.Joi.date().required(),
            endDate: celebrate_1.Joi.date().required(),
            priceDetails: celebrate_1.Joi.array().items({
                discountLabelType: celebrate_1.Joi.number().valid([
                    enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION,
                    enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION,
                    enum_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS
                ]).required(),
                months: celebrate_1.Joi.number(),
                days: celebrate_1.Joi.number(),
                discountPercentage: celebrate_1.Joi.number(),
                minUnits: celebrate_1.Joi.number(),
                maxUnits: celebrate_1.Joi.number(),
            }),
            priceRange: celebrate_1.Joi.object({
                dailyPrice: celebrate_1.Joi.object({
                    min: celebrate_1.Joi.number().required(),
                    max: celebrate_1.Joi.number().required(),
                }).required(),
                monthlyPrice: celebrate_1.Joi.object({
                    min: celebrate_1.Joi.number().required(),
                    max: celebrate_1.Joi.number().required(),
                }).required(),
                yearlyPrice: celebrate_1.Joi.object({
                    min: celebrate_1.Joi.number().required(),
                    max: celebrate_1.Joi.number().required(),
                }).required()
            })
        }).allow([]),
    },
    AMENITIES: {
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).required(),
        NAME: celebrate_1.Joi.string().min(2).max(50),
        TYPE: celebrate_1.Joi.string().min(2).max(50),
        icon_image: celebrate_1.Joi.string(),
    },
    CATEGORY: {
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i).required(),
        PARENT_ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        NAME: celebrate_1.Joi.string().min(3).max(50),
        icon_image: celebrate_1.Joi.string(),
        OPTION: celebrate_1.Joi.array(),
    },
    CITY: {
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        COUNTRY_ID: celebrate_1.Joi.number().min(1),
        STATE_ID: celebrate_1.Joi.number().min(1),
        CITY_NAME: celebrate_1.Joi.string().min(3).max(50),
        ICONE_IMAGE: celebrate_1.Joi.string(),
        ZIP_CODES: celebrate_1.Joi.array().items(celebrate_1.Joi.string())
    },
    HISTORY: {
        SEARCH_TYPE: celebrate_1.Joi.string().required().valid('event', 'user'),
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
    },
    GENERAL: {
        ID: celebrate_1.Joi.string().regex(/^[a-f\d]{24}$/i),
        ANY: celebrate_1.Joi.any(),
        BOOLEAN: celebrate_1.Joi.boolean(),
        STRING: celebrate_1.Joi.string(),
        PAGINATION: {
            page: celebrate_1.Joi.number().min(1).required(),
            limit: celebrate_1.Joi.number().min(3).max(100).default(10).optional(),
            search: celebrate_1.Joi.string().trim().optional(),
        },
        OBJECT: celebrate_1.Joi.object(),
        DATE: celebrate_1.Joi.date().iso(),
        NUMBER: celebrate_1.Joi.number(),
        BOOKING_STATUS: celebrate_1.Joi.number().valid(enum_common_1.ENUM_ARRAY.BOOKING.STATUS),
        PAYMENT_STATUS: celebrate_1.Joi.number().valid(enum_common_1.ENUM_ARRAY.PAYMENT.STATUS),
        REF: (key) => celebrate_1.Joi.ref(key),
        ARRAY_OF_IDS: celebrate_1.Joi.any(),
        ARRAY_OF_NUMBERS: celebrate_1.Joi.array().items(celebrate_1.Joi.number()),
    },
    FILTER: {
        KEY: celebrate_1.Joi.array().items(celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.FILTERBY.KEYS))
    },
    SORT: {
        ADMIN_USER_LISTING: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.SORT_BY.ADMIN_USER_LISTING),
        ADMIN_HOST_LISTING: celebrate_1.Joi.number().valid(enum_common_1.ENUM_ARRAY.SORT_BY.ADMIN_BOOKING_LISTING),
        ADMIN_FAQ_LISTING: celebrate_1.Joi.number(),
        ADMIN_BOOKING_LISTING: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.SORT_BY.ADMIN_BOOKING_LISTING),
        KEY: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.SORT_BY.KEYS),
        SORT_ORDER: celebrate_1.Joi.number().valid(enum_common_1.ENUM_ARRAY.SORT_BY.ASENDING_DESCENDING),
        PAYOUT_LISTING: celebrate_1.Joi.string().valid(enum_common_1.ENUM_ARRAY.SORT_BY.KEYS),
    },
    GENERAL_MONGO_ID: celebrate_1.Joi.string().regex(/^[0-9a-fA-F]{24}$/)
};
//# sourceMappingURL=validation.common.js.map