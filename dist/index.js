"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("./query"));
const countries_json_1 = __importDefault(require("./countries.json"));
function DataNotFound(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield context.sendText(`Sorry. No data.`);
    });
}
function extractDate(str) {
    const result = str.match(/\d{4}-\d{1,2}-\d{1,2}/);
    if (!result)
        return;
    return result[0]; // TODO: normalize date string, for example: 2020/03/03
}
function App(context) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!context.event.isText)
            return;
        const foundCountry = (_a = countries_json_1.default.find((country) => context.event.text.includes(country.replace(/\*/g, '')))) !== null && _a !== void 0 ? _a : 'US';
        const foundDate = (_b = extractDate(context.event.text)) !== null && _b !== void 0 ? _b : '2020-3-23';
        const data = yield query_1.default({ country: foundCountry, date: foundDate });
        if (!data) {
            return DataNotFound;
        }
        yield context.sendText(`
Country: ${foundCountry}
Date: ${foundDate}
Added Case: ${data.added}
Active Case: ${data.active}
Confirmed Case: ${data.confirmed}
Recovered Case: ${data.recovered}
Deaths: ${data.deaths}
`);
    });
}
exports.default = App;
