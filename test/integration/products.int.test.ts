import { it, expect, afterAll } from '@jest/globals';
import { response } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import server from '../../src/index';
import newProduct from '../data/newProduct.json';

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
});
