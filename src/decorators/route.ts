import 'reflect-metadata';

export const Route = (method: 'get'| 'post'| 'put'| 'delete', path: string) => {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata('route', {method, path}, target, propertyKey)
    };
}