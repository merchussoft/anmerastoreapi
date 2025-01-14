import express from 'express';
import { loggerMiddleware } from './app/middleware/loggerMiddleware';


const app = express()



app.set('port', process.env.PORT || 3000);


// Middleware para parsear JSON
app.use(express.json());
app.use(loggerMiddleware)

export {app}