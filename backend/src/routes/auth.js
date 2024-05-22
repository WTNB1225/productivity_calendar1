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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, express_1.default)().use((0, cookie_parser_1.default)());
dotenv_1.default.config();
const router = express_1.default.Router();
router.get('/check', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.cookies);
    const token = (_a = req.cookies.token) !== null && _a !== void 0 ? _a : { value: "" };
    const secretKey = process.env.JWT_SECRET;
    try {
        const user = jsonwebtoken_1.default.verify(token, secretKey);
        res.status(200).json({ user: user });
    }
    catch (e) {
        res.status(401).json({ error: 'Unauthorized' });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.cookies);
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0
    });
    res.cookie('username', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0
    });
    res.status(200).json({ message: 'Logged out' });
}));
exports.default = router;