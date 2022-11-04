"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendar = void 0;
const { google } = require('googleapis');
const _common_1 = require("@common");
class GoogleCalendarModule {
    constructor() {
        this.oAuth2Client = new google.auth.OAuth2(_common_1.CONFIG.GOOGLE_CALENDAR.CLIENT_ID, _common_1.CONFIG.GOOGLE_CALENDAR.SECRET_KEY, _common_1.CONFIG.GOOGLE_CALENDAR.USER_REDIRECT_URI);
        this.oAuth2HostClient = new google.auth.OAuth2(_common_1.CONFIG.GOOGLE_CALENDAR.CLIENT_ID, _common_1.CONFIG.GOOGLE_CALENDAR.SECRET_KEY, _common_1.CONFIG.GOOGLE_CALENDAR.REDIRECT_URI);
    }
    async createGoogleCalendarEvent(userDetails) {
        try {
            const TOKEN_PATH = userDetails;
            this.oAuth2Client.setCredentials(TOKEN_PATH);
            return;
        }
        catch (error) {
            console.error('createGoogleCalendarEvent failed', error);
        }
    }
    async createHostGoogleCalendarEvent(userDetails) {
        try {
            const TOKEN_PATH = userDetails;
            this.oAuth2HostClient.setCredentials(TOKEN_PATH);
            return;
        }
        catch (error) {
            console.error('createGoogleCalendarEvent failed', error);
        }
    }
    async createEvent(userDetails, bookingDetail) {
        var _a, _b, _c, _d, _e;
        try {
            await this.createGoogleCalendarEvent(userDetails);
            const calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
            const event = {
                summary: `Booking at ${(_a = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _a === void 0 ? void 0 : _a.name} 
                location: ${(_b = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _b === void 0 ? void 0 : _b.address}
                From: ${new Date(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.fromDate).toISOString()}
                To: ${new Date(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.toDate).toISOString()}
                Property name: ${(_c = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _c === void 0 ? void 0 : _c.name}
                Category: ${(_d = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.category) === null || _d === void 0 ? void 0 : _d.name}
                Units: ${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.quantity}
                Address: ${(_e = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _e === void 0 ? void 0 : _e.address} `,
                description: `BookingId: ${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.bookingId}`,
                start: {
                    dateTime: `${new Date(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.fromDate).toISOString()}`,
                },
                end: {
                    dateTime: `${new Date(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.toDate).toISOString()}`,
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 10 }
                    ]
                }
            };
            calendar.events.insert({
                auth: this.oAuth2Client,
                calendarId: 'primary',
                resource: event
            }, function (err, event) {
                if (err) {
                    console.error('There was an error contacting the Calendar service', err);
                    return;
                }
            });
        }
        catch (error) {
            console.error('Event failed', error);
        }
    }
    async createHostEvent(userDetails, bookingDetail) {
        var _a, _b, _c, _d, _e;
        try {
            await this.createHostGoogleCalendarEvent(userDetails);
            const calendar = google.calendar({ version: 'v3', auth: this.oAuth2HostClient });
            const event = {
                summary: `Booking at ${(_a = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _a === void 0 ? void 0 : _a.name} 
                location: ${(_b = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _b === void 0 ? void 0 : _b.address}
                From: ${new Date(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.fromDate).toISOString()}
                To: ${new Date(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.toDate).toISOString()}
                Property name: ${(_c = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _c === void 0 ? void 0 : _c.name}
                Category: ${(_d = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.category) === null || _d === void 0 ? void 0 : _d.name}
                Units: ${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.quantity}
                Address: ${(_e = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.propertyData) === null || _e === void 0 ? void 0 : _e.address} `,
                description: `BookingId: ${bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.bookingId}`,
                start: {
                    dateTime: `${new Date(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.fromDate).toISOString()}`,
                },
                end: {
                    dateTime: `${new Date(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.toDate).toISOString()}`,
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 10 }
                    ]
                }
            };
            calendar.events.insert({
                auth: this.oAuth2HostClient,
                calendarId: 'primary',
                resource: event
            }, function (err, event) {
                if (err) {
                    console.error('There was an error contacting the Calendar service', err);
                    return;
                }
                console.log('Event created: %s', event);
            });
        }
        catch (error) {
            console.log('Event failed', error);
        }
    }
    async createUserUrl() {
        try {
            const scopes = [
                'https://www.googleapis.com/auth/calendar.events'
            ];
            let url = await this.oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                prompt: 'consent',
                scope: scopes
            });
            console.log(`google calendar auth url user ===> `, url);
            return url;
        }
        catch (err) {
            console.error("we have an error in => createUserUrl", err);
        }
    }
}
exports.GoogleCalendar = new GoogleCalendarModule();
//# sourceMappingURL=google.calendar.services.js.map