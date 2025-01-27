import { Route, Controller, UploadMiddleware } from "../../utils/loadRoutes";
import { Request, Response } from 'express';
import { DatabaseConfig } from "../config/db";
import { sendSuccess } from "../../utils/responseHandler";


@Controller('/products')

export class ProductsController {
    protected db: DatabaseConfig;

    constructor() {
        this.db = new DatabaseConfig()
    }


    @Route('get', '/', {authRequired: true})
    async getProduct(req: Request, res: Response) {
        return sendSuccess(res, {})
    }


    @Route('post', '/register', {authRequired: true})
    @UploadMiddleware('image_products')
    async registerProducts(req: Request, res: Response) {
        const file = req.file;

        console.log("Archivo subido:", file)
    }
}