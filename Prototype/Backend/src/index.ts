import express, { Request, Response } from 'express';
import cors from 'cors';
import { routes } from './Routes';
import path from 'path';
const cookieParser = require('cookie-parser');
import { sessionCookieHandler } from './cookieManagement/sessionCookieHandler';
import { StemRoute } from './routes/stemSeparation/stemRoute';

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
/*

*/
//Gets the absolute path to the media directory for use in the rest of the app
export const MEDIA_FILE_PATH: string = '/media';

const port = process.env.PORT || 50000;

app.use(express.json());
//app.use(cors());
app.use(cookieParser());

//Cookie middleware
app.use(sessionCookieHandler);

app.use("/", routes);

//
app.use("/api/stem", StemRoute);


app.get(/(.*)/, (req: Request, res: Response) => {
    res.status(404).send('<h1>404! Page not found</h1>');;
});
    
app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
    console.log("to run on a different port, type 'PORT=<port number> npm run dev'");
});

export default app;



