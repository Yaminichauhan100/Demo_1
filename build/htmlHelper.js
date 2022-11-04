"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATER = void 0;
const fs = __importStar(require("fs"));
const handlebar = __importStar(require("handlebars"));
exports.TEMPLATER = {
    makeHtmlTemplate: async function (source, data) {
        return new Promise((resolve, reject) => {
            fs.readFile(source, 'utf8', (err, content) => {
                if (err) {
                    console.log('Error in side makeHtmlTemplate', err);
                    reject(err);
                }
                try {
                    let template = handlebar.compile(content, { noEscape: true });
                    let html = template(data);
                    resolve(html);
                }
                catch (error) {
                    console.error(`we got error in compiling html`, error);
                    reject(error);
                }
            });
        });
    }
};
//# sourceMappingURL=htmlHelper.js.map