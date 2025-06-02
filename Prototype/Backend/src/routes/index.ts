import express from 'express';
import { SimilarityRouter } from './acousticBrainz/SimilarityRoute';
import { DownloadRoute } from './ytDownloader/DownloadRoute';
import { GetFileRoute } from './utility/GetFileRoute';
import { CutRoute } from './audioManipulation/CutRoute';
import { CombineRoute } from './audioManipulation/CombineRoute';

export const routes = express.Router();

routes.use(SimilarityRouter);
routes.use('/Download', DownloadRoute);
routes.use(GetFileRoute);
routes.use(CutRoute);
routes.use(CombineRoute);