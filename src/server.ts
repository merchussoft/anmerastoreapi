import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './app/middleware/loggerMiddleware';


const app = express();
app.set('port', process.env.PORT || 3000);


let corsOptions = {
    origin: '*' // Sensitive
  };

// Middleware para parsear JSON
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(loggerMiddleware);

app.disable("x-powered-by");

export {app}