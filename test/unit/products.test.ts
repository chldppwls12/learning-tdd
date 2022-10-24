import { NextFunction } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { productController } from '../../controllers/index';
import productModel from '../../models/Product';
import newProduct from '../data/newProduct.json';
import allProducts from '../data/allProducts.json';
import Product from '../../models/Product';

productModel.create = jest.fn<any>();
productModel.find = jest.fn<any>();
productModel.findById = jest.fn<any>();

let req: MockRequest<any>;
let res: MockResponse<any>;
let next: NextFunction;

const productId = '63501a235fa7608887128981';

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

describe('Product Controller Get', () => {
  it('should have a getProducts', () => {
    expect(typeof productController.getProducts).toBe('function');
  });

  it('should call ProductModel.find({})', async () => {
    await productController.getProducts(req, res, next);
    expect(productModel.find).toBeCalledWith({});
  });

  it('should return 200 response', async () => {
    await productController.getProducts(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });

  it('should return json body in response', async () => {
    (productModel.find as jest.Mock).mockReturnValue(allProducts);
    await productController.getProducts(req, res, next);
    expect(res._getJSONData()).toStrictEqual(allProducts);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error finding product data' };
    const rejectedPromise = Promise.reject(errorMessage);
    (productModel.find as jest.Mock).mockReturnValue(rejectedPromise);
    await productController.getProducts(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('Product Controller GetById', () => {
  it('should have getProductById', () => {
    expect(typeof productController.getProductById).toBe('function');
  });

  it('should call ProductModel.findById', async () => {
    // 단위 테스트에서 id는 실제 존재하지 않는 것 넣어도 된다
    // 실제로 mongoDB는 잘 작동한다고 가정하고 테스트하는 것이기 때문
    req.params.productId = productId;
    await productController.getProductById(req, res, next);
    expect(productModel.findById).toBeCalledWith(productId);
  });

  it('should return json body and response code 200', async () => {
    (productModel.findById as jest.Mock).mockReturnValue(newProduct);
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return 404 when item does not exist', async () => {
    (productModel.findById as jest.Mock).mockReturnValue(null);
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'error' };
    const rejectedPromise = Promise.reject(errorMessage);
    (Product.findById as jest.Mock).mockReturnValue(rejectedPromise);
    await productController.getProductById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
