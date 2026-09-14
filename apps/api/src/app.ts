import cors from 'cors';
import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from 'express';
import { EligibilityController } from './controllers/eligibility.controller.js';
import { NotFoundError } from './errors/not-found.error.js';
import { InMemoryPatientRepository } from './repositories/patient.repository.js';
import { EligibilityService } from './services/eligibility.service.js';

export const app = express();

app.use(cors());
app.use(express.json());

const repository = new InMemoryPatientRepository();
const service = new EligibilityService(repository);
const controller = new EligibilityController(service);

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.get(
  '/api/patients/:patientId/eligibility',
  controller.execute as RequestHandler,
);

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof NotFoundError) {
    response.status(404).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: 'Internal server error' });
};

app.use(errorHandler);
