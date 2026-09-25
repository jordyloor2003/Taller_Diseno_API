import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error-handler.js';
import { responseWrapper } from './middleware/response.js';
import { MongooseEmployeeRepository } from './repositories/mongoose-employee.repository.js';
import { createEmployeeRoutes } from './routes/empleados.routes.js';

export const createApp = () => {
  const app = express();
  const repository = new MongooseEmployeeRepository();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200' }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(responseWrapper);
  app.use('/api/v1', createEmployeeRoutes(repository));
  app.use(errorHandler);

  return app;
};

export default createApp;
