"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const _entity_1 = require("@entity");
exports.createAdmin = function (admins) {
    admins.forEach(async (admin) => {
        let checkAdminExists = await _entity_1.AdminV1.findOne({ email: admin.email });
        if (!checkAdminExists) {
            await _entity_1.AdminV1.createAdmin({
                email: admin.email,
                name: admin.name,
                salt: 'some_random_salt'
            });
        }
    });
    return true;
};
//# sourceMappingURL=seeder.bootstrap.js.map