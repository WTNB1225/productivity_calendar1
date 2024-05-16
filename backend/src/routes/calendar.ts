import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/', async(req: Request, res: Response) => {
  const date = new Date();
  const yaer = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const userId: number = req.body.userId;
  try {

  } catch(e) {
      console.error(e);
      res.status(500).json({error: 'An error occurred'});
  }
});

export default router;