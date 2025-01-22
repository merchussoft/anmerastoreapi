import 'dotenv/config';
import { app } from './src/server';
import { loadRoutes } from './src/utils/loadRoutes';
import { HomeController } from './src/app/controllers/HomeController';
import { setupSwagger } from './src/app/services/swagger';


const route_group = [
    {
        prefix: '/api',
        controllers: [HomeController]
    }
]

loadRoutes(app, route_group);

setupSwagger(app);

app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
})