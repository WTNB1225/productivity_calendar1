import express, { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getUsersAllRepos, getUserInfo } from '../api/api';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient({log: ['query']});

router.post('/', async (req: Request, res: Response) => {
  const code = req.body.code;
　　const githubUrl = 'https://github.com/login/oauth/access_token';
  try {
      const response = await axios.post(
          githubUrl,
          {
              client_id: process.env.GITHUB_CLIENT_ID,
              client_secret: process.env.GITHUB_CLIENT_SECRET,
              code: code
          },
          {
              headers: {
                  'Accept': 'application/json'
              }
          }
      );
      const repos = await getUsersAllRepos(response.data.access_token);
      const user = await getUserInfo(response.data.access_token);
      //const hashedAccessToken = await bcrypt.hash(response.data.access_token, 10);
      const data = {userId: user.id, username: user.login, accessToken: response.data.access_token};
      await prisma.users.upsert({
          where: { userId: user.id },
          update: data,
          create: data
      });
      const payload = {userId: user.id, username: user.login};
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: '1h'});
      res.cookie('token', token, {httpOnly: true, sameSite: 'none', secure: true})
      res.cookie('username', user.login, {httpOnly: true, sameSite: 'none', secure: true});
      res.status(200).json({ token: response.data.access_token, repos: repos, user: user });
  } catch (error: any) {
      console.error(error.response);
      res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;