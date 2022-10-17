import { Request, Response } from 'express';

const getAllProduct = (req: Request, res: Response) => {
  return res.json({ test: 'test' });
};

export default { getAllProduct };

const a: String = 'abc';
