import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import calendarRouter from './routes/calendar';
import codeRouter from './routes/code';
import verifyRouter from './routes/auth';
import indexRouter from './routes/index';
import countRouter from './routes/count';

dotenv.config();

const app = express();
const port = 3030;

app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

app.use(cookieParser());

app.use('/', indexRouter);
app.use('/count', countRouter);
app.use('/calendar', calendarRouter);
app.use('/code', codeRouter);
app.use('/auth', verifyRouter);

app.get('/',(req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

