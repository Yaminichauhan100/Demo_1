"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const node_cron_1 = require("node-cron");
class CronServiceClass {
    constructor() {
    }
    async recurringPaymentScheduler() {
        try {
            node_cron_1.schedule('* * * * *', () => {
                console.log('running a task every minute');
            });
        }
        catch (error) {
            console.error(`we encountered an error while scheduling ==> ${error}`);
        }
    }
    async calendarScheduler() {
        try {
            node_cron_1.schedule('*/5 * * * *', () => {
                console.log('running a task every five minutes');
            });
        }
        catch (error) {
            console.error(`we encountered an error while calendar scheduling ==> ${error}`);
        }
    }
}
exports.CronService = new CronServiceClass();
//# sourceMappingURL=cron.service.js.map