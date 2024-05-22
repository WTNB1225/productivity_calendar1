"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const calendar_1 = __importDefault(require("./routes/calendar"));
const code_1 = __importDefault(require("./routes/code"));
const auth_1 = __importDefault(require("./routes/auth"));
const index_1 = __importDefault(require("./routes/index"));
const count_1 = __importDefault(require("./routes/count"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3030;
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use('/', index_1.default);
app.use('/count', count_1.default);
app.use('/calendar', calendar_1.default);
app.use('/code', code_1.default);
app.use('/auth', auth_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
