import request from 'supertest';
import express from 'express';
import { adEngine } from '../../utilities/adEngine/adEngine';
import { trackUsage } from '../../utilities/adEngine/trackUsage';
import indexRouter from '../index';
import { client } from '../../config/db';

// Mock dependencies
jest.mock('../../utilities/adEngine/adEngine');
jest.mock('../../utilities/adEngine/trackUsage');
jest.mock('../../config/db', () => ({
  client: {
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockImplementation((query) => {
          // Mock valid API key check
          if (query.apiKey === 'test-api-key') {
            return Promise.resolve({ apiKey: 'test-api-key' });
          }
          return Promise.resolve(null);
        }),
      }),
    }),
  },
}));

describe('Index Router - GET /get-ad', () => {
  let app: express.Application;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a new express app and use the router
    app = express();
    app.use(express.json());
    app.use('/', indexRouter);
  });

  const mockApiKey = 'test-api-key';
  const invalidApiKey = 'invalid-api-key';

  describe('Authentication', () => {
    it('should return 401 if no API key is provided', async () => {
      const response = await request(app)
        .get('/get-ad')
        .send({ query: 'test query' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized : Missing API Key');
    });

    it('should return 403 if invalid API key is provided', async () => {
      const response = await request(app)
        .get('/get-ad')
        .set('x-api-key', invalidApiKey)
        .send({ query: 'test query' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Unauthorized : Invalid API Key');
    });
  });

  describe('Ad Retrieval', () => {
    it('should return 404 when no ad is found', async () => {
      (adEngine as jest.Mock).mockResolvedValue('No ad found');
      
      const response = await request(app)
        .get('/get-ad')
        .set('x-api-key', mockApiKey)
        .send({ query: 'test query' });

      expect(response.status).toBe(404);
      expect(response.text).toBe('No ad found');
      expect(adEngine).toHaveBeenCalledWith('test query');
      expect(trackUsage).toHaveBeenCalledWith(mockApiKey);
    });

    it('should return 200 and ad content when ad is found', async () => {
      const mockAd = 'Test advertisement content';
      (adEngine as jest.Mock).mockResolvedValue(mockAd);
      
      const response = await request(app)
        .get('/get-ad')
        .set('x-api-key', mockApiKey)
        .send({ query: 'test query' });

      expect(response.status).toBe(200);
      expect(response.text).toBe(mockAd);
      expect(adEngine).toHaveBeenCalledWith('test query');
      expect(trackUsage).toHaveBeenCalledWith(mockApiKey);
    });

    it('should handle errors from adEngine gracefully', async () => {
      (adEngine as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .get('/get-ad')
        .set('x-api-key', mockApiKey)
        .send({ query: 'test query' });

      expect(response.status).toBe(500);
    });

    it('should handle missing query parameter', async () => {
      const response = await request(app)
        .get('/get-ad')
        .set('x-api-key', mockApiKey)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing query parameter');
    });
  });
}); 