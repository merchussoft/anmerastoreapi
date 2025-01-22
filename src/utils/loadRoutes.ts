import { Application, Request, Response, Router } from 'express';
import 'reflect-metadata';
import { RouteGroups } from '../interfaces/routeGroups-interface';
import { RouteMeta } from '../interfaces/routeMeta-interface';

export function loadRoutes(app: Application, routeGroups: RouteGroups[]) {

    routeGroups.forEach(({prefix, controllers}) => {
        const router = Router();
        controllers.forEach((ControllerClass) => {
            const instance = new ControllerClass();
            const prototype = Object.getPrototypeOf(instance);
        
            Object.getOwnPropertyNames(prototype).forEach((methodName) => {
              if (methodName !== 'constructor') {
                const routeMeta: RouteMeta | undefined = Reflect.getMetadata('route', prototype, methodName);
                if (routeMeta) {
                  const { method, path } = routeMeta;
                  if(['get', 'post', 'put', 'delete'].includes(method)) {
                    app[method as 'get'| 'post'| 'put'| 'delete'](path, (req: Request, res: Response) => instance[methodName](req, res));
                  } else {
                    console.error(`Método HTTP inválido: ${method} para la ruta ${path}`);
                  }
                }
              }
            });
          });
          app.use(prefix, router);
    })
}