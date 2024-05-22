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
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const api_1 = require("../api/api");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient({ log: ['query'] });
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    const githubUrl = 'https://github.com/login/oauth/access_token';
    try {
        const response = yield axios_1.default.post(githubUrl, {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        }, {
            headers: {
                'Accept': 'application/json'
            }
        });
        const repos = yield (0, api_1.getUsersAllRepos)(response.data.access_token);
        const user = yield (0, api_1.getUserInfo)(response.data.access_token);
        //const hashedAccessToken = await bcrypt.hash(response.data.access_token, 10);
        const data = { userId: user.id, username: user.login, accessToken: response.data.access_token };
        yield prisma.users.upsert({
            where: { userId: user.id },
            update: data,
            create: data
        });
        const payload = { userId: user.id, username: user.login };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 100 * 365 * 24 * 60 * 60 * 1000 });
        res.cookie('username', user.login, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 100 * 365 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ token: response.data.access_token, repos: repos, user: user });
    }
    catch (error) {
        console.error(error.response);
        res.status(500).json({ error: 'An error occurred' });
    }
}));
exports.default = router;
