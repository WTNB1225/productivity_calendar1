import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/check', async(req: Request, res: Response) => {
  const token: string = req.cookies.token ?? { value: "" };
  const secretKey = process.env.JWT_SECRET as string;
  try{
      const user = jwt.verify(token, secretKey);
      res.status(200).json({user: user});
  } catch(e: any) {
      res.status(401).json({error: 'Unauthorized'});
  }
})

router.get('/logout', async(req: Request, res: Response) => {
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
  res.status(200).json({message: 'Logged out'});
})



export default router;