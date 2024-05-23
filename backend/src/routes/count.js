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
const client_1 = require("@prisma/client");
const api_1 = require("../api/api");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient({ log: ['query'] });
router.get('/:username/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const username = req.params.username;
    const userId = parseInt(req.params.userId);
    console.log(userId);
    if (userId === undefined) {
        return;
    }
    try {
        const User = yield prisma.users.findFirst({
            where: {
                userId: userId
            }
        });
        if (User === null) {
            throw new Error('Access token not found');
        }
        const allReposPromises = yield (0, api_1.getUsersAllRepos)(User.accessToken);
        const allRepos = Promise.resolve(allReposPromises);
        if (!allRepos) {
            return;
        }
        const allReposLen = (_a = allReposPromises === null || allReposPromises === void 0 ? void 0 : allReposPromises.repos.length) !== null && _a !== void 0 ? _a : 0;
        if (!allReposPromises || allReposLen === 0 || allReposPromises.repos === undefined) {
            return;
        }
        const temp = [];
        for (let i = 0; i < allReposLen; i++) {
            const repoName = (yield allRepos).repos[i].name;
            const linesOfCode = yield (0, api_1.extractShaId)({ username: username, reposName: repoName, access_token: User.accessToken, id: userId });
            if (!linesOfCode) {
                console.log('No data');
                return;
            }
            temp.push(linesOfCode);
        }
        const promises = temp.map((temp2) => __awaiter(void 0, void 0, void 0, function* () {
            const lines = yield (0, api_1.extractLinesOfCode)(temp2);
            return lines;
        }));
        const linesArrays = yield Promise.all(promises);
        const total_array = linesArrays.flat();
        const total = total_array.reduce((a, b) => a + b, 0);
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        const previousDay = new Date(year, month - 1, day);
        const previousDayYear = previousDay.getFullYear();
        const previousDayMonth = previousDay.getMonth() + 1;
        const previousDayDay = previousDay.getDate();
        const prevCode = (_b = yield prisma.calendars.findFirst({
            where: {
                calendarId: `${previousDayYear}-${previousDayMonth}-${previousDayDay}-${userId}`
            },
            select: {
                total_number: true
            }
        })) !== null && _b !== void 0 ? _b : { total_number: 0 };
        const data = { calendarId: `${year}-${month}-${day}-${userId}`, calendarMonth: `${year}-${month}-${userId}`, calendar_Day: `${year}-${month}-${day}`, calendarOwnerId: userId, total_number: total, day_number: total - prevCode.total_number };
        yield prisma.calendars.upsert({
            where: {
                calendarId: `${year}-${month}-${day}-${userId}`
            },
            create: data,
            update: data
        });
        res.status(200).json({ total: total });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'An error occurred' });
    }
}));
exports.default = router;
