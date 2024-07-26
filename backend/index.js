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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var common_1 = require("common");
var app = (0, express_1.default)();
app.use(express_1.default.json());
/**
 * Validates that an integer passes the Luhn algorithm and is therefore a
 *   potentially valid credit card number
 *
 *   Luhn algorithm: https://en.wikipedia.org/wiki/Luhn_algorithm
 *
 * @param cardNum integer of any length
 * @returns true if cardNum passes Luhn algorithm check
 */
function luhnValidator(cardNum) {
    var cardStr = String(cardNum);
    var lastNum = +cardStr.charAt(cardStr.length - 1);
    var checkSum = 0;
    var doubleThisDigit = true; // double the first digit encountered
    for (var i = cardStr.length - 2; i >= 0; i--) {
        // get the appropriate info for updating the checksum
        var localDigitInfo = void 0;
        if (doubleThisDigit) {
            localDigitInfo = String(2 * +cardStr.charAt(i));
        }
        else {
            localDigitInfo = cardStr.charAt(i);
        }
        // Update checkSum using localDigitInfo
        for (var j = 0; j < localDigitInfo.length; j++) {
            checkSum += +localDigitInfo.charAt(j);
        }
        // Flip doubling bit
        doubleThisDigit = !doubleThisDigit;
    }
    //console.log('expected checksum: ' + (10 - (checkSum % 10)));
    return lastNum == (10 - (checkSum % 10));
}
;
/**
 * Determine if a given string of integers is a valid credit card number
 *
 * req.body.cardNum - an int
 */
app.post('/api/validate-card', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, validationErrors, result, validationResponseBody;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = (0, class_transformer_1.plainToClass)(common_1.CardRequestBody, req.body);
                    return [4 /*yield*/, (0, class_validator_1.validate)(body)];
                case 1:
                    validationErrors = _a.sent();
                    if (validationErrors.length > 0) {
                        //console.log('validation errors: ' + validationErrors);
                        // TODO: pass validation errors forward to user
                        res.status(400);
                    }
                    else {
                        result = luhnValidator(body.cardNum);
                        validationResponseBody = new common_1.CardResponseBody(result);
                        res.contentType('boolean');
                        res.status(200);
                        res.send(validationResponseBody);
                    }
                    return [2 /*return*/];
            }
        });
    });
});
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
    console.log('Press Ctrl+C to quit');
});
