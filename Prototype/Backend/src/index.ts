import express, { Request, Response } from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", routes);

const port = process.env.PORT || 5000;

app.get(/(.*)/, (req: Request, res: Response) => {
    res.status(404).send('<h1>404! Page not found</h1>');;
});
    
app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});

export default app;




