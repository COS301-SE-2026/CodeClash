import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/config/db';

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));