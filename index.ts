import 'dotenv/config';
import { app } from './src/server';
import { loadRoutes } from './src/utils/loadRoutes';
import { HomeController } from './src/app/controllers/HomeController';
import { UserController } from './src/app/controllers/UserController';
import { setupSwagger } from './src/app/services/swagger';


console.log(`mirando que sale aqui ${process.env.PORT}`);


loadRoutes(app, [HomeController, UserController]);

setupSwagger(app);

app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
})