"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slack = void 0;
const web_api_1 = require("@slack/web-api");
const _common_1 = require("@common");
class SlackClass {
    constructor() {
        this.token = _common_1.CONFIG.SLACK_TOKEN;
        this.web = new web_api_1.WebClient(this.token);
    }
    async fetchSlackUserProfile(emailId) {
        var _a;
        try {
            const userProfile = await this.web.users.lookupByEmail({
                email: emailId
            });
            if (userProfile === null || userProfile === void 0 ? void 0 : userProfile.user)
                return (_a = userProfile === null || userProfile === void 0 ? void 0 : userProfile.user) === null || _a === void 0 ? void 0 : _a.id;
            else
                console.log(`no user found registered to slack with email ${emailId}`);
        }
        catch (error) {
            console.error(error);
        }
    }
    async postMessageToSlackUser(emailId, bookingDetails) {
        try {
            const userId = await this.fetchSlackUserProfile(emailId);
            await this.web.chat.postMessage({
                text: 'Hey! you got a new booking.',
                channel: userId,
                username: 'DeskNowAdmin'
            });
        }
        catch (error) {
            console.error(`we got an error while posting message to slack user ==> ${error}`);
        }
    }
    async adminRemoveUserFromWorkSpace(userId, teamId) {
        try {
            await this.web.admin.users.remove({
                user_id: userId,
                team_id: teamId
            });
        }
        catch (error) {
            console.error(`we have an error while removing user from workspace`, error);
        }
    }
}
exports.Slack = new SlackClass();
//# sourceMappingURL=slack.js.map