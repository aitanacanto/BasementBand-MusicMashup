import express from 'express';
import { MBIDRoute } from './MBIDRoute';
//import { SimilarityRouter } from './SimilarityRoute';

export const routes = express.Router();

routes.use(MBIDRoute);
//routes.use(SimilarityRouter);