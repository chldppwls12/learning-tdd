import { Request, Response, NextFunction } from 'express';
import productModel from '../models/Product';

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdProduct = await productModel.create(req.body);
    res.status(201).json(createdProduct);
  } catch (err: any) {
    next(err);
  }
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allProducts = await productModel.find({});
    res.status(200).json(allProducts);
  } catch (err: any) {
    next(err);
  }
};

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (!product) {
      res.status(404).send();
    } else {
      res.status(200).json(product);
    }
  } catch (err: any) {
    next(err);
  }
};

export default { createProduct, getProducts, getProductById };
