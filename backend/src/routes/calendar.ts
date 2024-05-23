import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient({log: ['query']});

router.post('/month', async(req: Request, res: Response) => {
  const date = new Date();
  const yaer = date.getFullYear();
  const month = date.getMonth() + 1;
  const userId: number = req.body.userId;
  const calendarMonth: string = `${yaer}-${month}-${userId}`;
  try {
    const data = await prisma.calendars.findMany({
      where: {
        calendarMonth: calendarMonth
      }
    });
    res.status(200).json({data: data});
  } catch(e: any) {
      console.error(e);
      res.status(500).json({error: 'An error occurred'});
  }
})

router.post('/', async(req: Request, res: Response) => {
  const date = new Date();
  const yaer = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const userId: number = req.body.userId;
  const calendarId: string = `${yaer}-${month}-${day}-${userId}`;
  try {
    const data = await prisma.calendars.findFirst({
      where: {
        calendarId: calendarId
      }
    });
    res.status(200).json({data: data});
  } catch(e) {
      console.error(e);
      res.status(500).json({error: 'An error occurred'});
  }
});

export default router;