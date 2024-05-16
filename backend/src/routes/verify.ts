import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
  const token = req.cookies.token ?? { value: "" };
  const secretKey = process.env.JWT_SECRET as string;
  try{
      const user = jwt.verify(token, secretKey);
      res.status(200).json({user: user});
  } catch(e: any) {
      res.status(401).json({error: 'Unauthorized'});
  }
});

export default router;