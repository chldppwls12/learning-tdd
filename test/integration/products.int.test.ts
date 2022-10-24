import { response } from 'express';
import { it, expect, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import server from '../../src/index';
import newProduct from '../data/newProduct.json';

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
}

let firstProduct: IProduct;

afterAll(async () => {
  server.close();
  await mongoose.connection.close();
});

it('POST /api/products', async () => {
  const response = await request(server).post('/api/products').send(newProduct);

  expect(response.statusCode).toBe(201);
  expect(response.body.name).toBe(newProduct.name);
  expect(response.body.description).toBe(newProduct.description);
});

it('should be return 500 on POST /api/products', async () => {
  const response = await request(server).post('/api/products').send({ name: 'jjae' });

  expect(response.statusCode).toBe(500);
  expect(response.body).toStrictEqual({
    message: 'Product validation failed: description: Path `description` is required.'
  });
});

it('GET /api/products', async () => {
  const response = await request(server).get('/api/products');

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].name).toBeDefined();
  expect(response.body[0].description).toBeDefined();

  firstProduct = response.body[0];
});

it('GET /api/products/:productId', async () => {
  //통합 테스트에서는 실제 mongoDB를 통해서 요청 이루어지기 때문에 존재하는 id 넣어야 함
  const response = await request(server).get(`/api/products/${firstProduct._id}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(firstProduct.name);
  expect(response.body.description).toBe(firstProduct.description);
});

it('GET id does not exist /api/products/:productId', async () => {
  //productId를 아무거나 입력할 시에는 mongoDB가 유효하지 않은 것을 인지하고 next로 넘어가 500을 줌
  const response = await request(server).get(`/api/products/63501a235fa7608887128981`);

  expect(response.statusCode).toBe(404);
});
