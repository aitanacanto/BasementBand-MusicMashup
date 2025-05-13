import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.json('This is the backend talking to the frontend');
});

    
app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});


