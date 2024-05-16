import express, { Request, Response } from 'express'; 
import { PrismaClient } from '@prisma/client';
import { extractShaId, extractLinesOfCode, getUsersAllRepos } from '../api/api';

const router = express.Router();
const prisma = new PrismaClient({log: ['query']});


router.get('/:username/:userId', async(req: Request, res: Response) => {
  const username = req.params.username;
  const userId = parseInt(req.params.userId);
  console.log(userId)
  if (userId === undefined) {
      return;
  }
  try {
      const User = await prisma.users.findFirst({
          where: {
              userId: userId
          }
      });
      if (User === null) {
          throw new Error('Access token not found');
      }

      const allReposPromises = await getUsersAllRepos(User.accessToken);
      const allRepos = Promise.resolve(allReposPromises);
      if(!allRepos){
        return;
      }
      const allReposLen: number = allReposPromises?.repos.length ?? 0;
      if (!allReposPromises || allReposLen === 0 || allReposPromises.repos === undefined) {
        return;
      }
      const temp: Sha[] = [];
      for (let i = 0; i < allReposLen; i++) {
          const repoName: string = (await allRepos).repos[i].name;
          const linesOfCode = await extractShaId({ username: username, reposName: repoName, access_token: User.accessToken, id: userId});
          if (!linesOfCode) {
              console.log('No data')
              return;
          }
          temp.push(linesOfCode);
      }
      const promises: Promise<number[]>[] = temp.map(async (temp2: Sha) => {
          const lines = await extractLinesOfCode(temp2);
          return lines;
      })


      const linesArrays = await Promise.all(promises);
      const total_array: number[] = linesArrays.flat();
      const total = total_array.reduce((a, b) => a + b, 0);
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();
      const previousDay = new Date(year, month - 1, day);
      const previousDayYear = previousDay.getFullYear();
      const previousDayMonth = previousDay.getMonth() + 1;
      const previousDayDay = previousDay.getDate();
      const prevCode = await prisma.calendars.findFirst({
          where: {
              calendarId: `${previousDayYear}-${previousDayMonth}-${previousDayDay}-${userId}`
          },
          select: {
              total_number: true
          }
      }) ?? {total_number: 0};

      const data = {calendarId: `${year}-${month}-${day}-${userId}`, calendar_Day: `${year}-${month}-${day}`, calendarOwnerId: userId, total_number: total, day_number: total - prevCode.total_number};
      await prisma.calendars.upsert({
          where: {
              calendarId: `${year}-${month}-${day}-${userId}`
          },
          create: data,
          update: data
      });
      res.status(200).json({total: total});
  } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'An error occurred' });
  }
  
});

export default router;
