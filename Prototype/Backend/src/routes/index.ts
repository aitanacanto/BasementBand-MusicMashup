import express from 'express';
import { MBIDRoute } from './acousticBrainz/MBIDRoute';
import { SimilarityRouter } from './acousticBrainz/SimilarityRoute';
import { DownloadRoute } from './ytDownloader/DownloadRoute';
import { GetFileRoute } from './utility/GetFileRoute';

export const routes = express.Router();

routes.use(MBIDRoute);
routes.use(SimilarityRouter);
routes.use(DownloadRoute);
routes.use(GetFileRoute);
