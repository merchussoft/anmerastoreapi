import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './app/middleware/loggerMiddleware';


const app = express();
app.set('port', process.env.PORT || 3000);


// Middleware para parsear JSON
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(loggerMiddleware);

export {app}