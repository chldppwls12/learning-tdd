import { NextFunction } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { productController } from '../../controllers/index';
import productModel from '../../models/Product';
import newProduct from '../data/newProduct.json';

productModel.create = jest.fn<any>();

let req: MockRequest<any>;
let res: MockResponse<any>;
let next: NextFunction;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn<any>();
});

describe('Product Controller Create', () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  it('should have a createProduct function', () => {
    expect(typeof productController.createProduct).toBe('function');
  });

  it('should call Product model', async () => {
    //productController.createProduct(req, res)를 실행할 때 productModel.create가 호출이 되는지
    await productController.createProduct(req, res, next);
    expect(productModel.create).toBeCalledWith(newProduct);
  });

  it('sholud return 201 response code', async () => {
    await productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy(); //send가 잘 보내짐
  });

  it('should return json body in response', async () => {
    (productModel.create as jest.Mock).mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'description property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    (productModel.create as jest.Mock).mockReturnValue(rejectedPromise);
    await productController.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
