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
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient({ log: ['query'] });
router.post('/month', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const yaer = date.getFullYear();
    const month = date.getMonth() + 1;
    const userId = req.body.userId;
    const calendarMonth = `${yaer}-${month}-${userId}`;
    try {
        const data = yield prisma.calendars.findMany({
            where: {
                calendarMonth: calendarMonth
            }
        });
        res.status(200).json({ data: data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'An error occurred' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const yaer = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const userId = req.body.userId;
    const calendarId = `${yaer}-${month}-${day}-${userId}`;
    try {
        const data = yield prisma.calendars.findFirst({
            where: {
                calendarId: calendarId
            }
        });
        res.status(200).json({ data: data });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'An error occurred' });
    }
}));
exports.default = router;
