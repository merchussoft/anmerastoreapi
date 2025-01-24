import 'reflect-metadata';
import { Application, NextFunction, Request, Response, Router } from 'express';
import { RouteMeta, RouteOptions } from '../interfaces/routeMeta-interface';
import { authJswValidate } from '../app/middleware/auth-middleware';
import { ValidationChain } from 'express-validator';



export function loadRoutes(app: Application, controllers: Function[]) {
  
  controllers.forEach(ControllerClass => {
    const instance = new (ControllerClass as any)();
    const prototype = Object.getPrototypeOf(instance);
    const router = Router();

    const prefix: string = Reflect.getMetadata('prefix', ControllerClass) || '';
    // Prcesar todas las rutas definidas en el controlador 
    processControllerRoutes(instance, prototype, router);
    app.use(prefix, router);
  });

}


// Decorador para agrupar rutas a nivel de controlador
export function Controller(prefix: string): ClassDecorator {
  return (target) => Reflect.defineMetadata('prefix', prefix, target);
}


// Decorador para definir rutas individuales
export function Route(method: string, path: string, options: RouteOptions = {}): MethodDecorator {
  return (target, propertyKey) => Reflect.defineMetadata('route', { method, path , ...options}, target, propertyKey);
}


// hacemos la validacion de los metodos http
function ivValidHttpMethod(method: string): boolean {
  return ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method);
}


// se hace el registro de las rutas
function registerRoute(router: Router, method: string, path: string, handlers: Array<
  ((req: Request, res: Response, next: NextFunction) => void) | ValidationChain
>): void {

  if(!ivValidHttpMethod(method)) {
    console.log(`Método HTTP inválido: ${method} para la ruta ${path}`)
    return;
  }

  router[method as 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'](path, ...handlers);
 
}


function processControllerRoutes(instance: any, prototype: any, router: Router): void {
  Object.getOwnPropertyNames(prototype).forEach(method_name => {

    if(method_name === 'constructor') return;
    const route_meta: RouteMeta | undefined = Reflect.getMetadata('route', prototype, method_name);
  
    if(!route_meta) return;

    const { method, path, middleware = [],  authRequired } = route_meta;
    const handler = (req: Request, res: Response, next: NextFunction) => instance[method_name](req, res, next);
    
    const router_handlers: Array<(req: Request, res: Response, next: NextFunction) => void | ValidationChain > = [
      ...(authRequired  ? [authJswValidate]: []),
      ...middleware,
      handler
    ];
    
    registerRoute(router, method, path, router_handlers);
  });


}