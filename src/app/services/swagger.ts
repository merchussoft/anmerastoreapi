import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Api Documentacion',
            version: '1.0.0',
            description: 'Documentación de la API usando Swagger y TypeScript'
        },
        servers: [
            { url: `http://localhost:${process.env.PORT}`}
        ]
    },
    apis: ['./src/app/controllers/*.ts']
};

const swagger_spec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: any): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger_spec))
}