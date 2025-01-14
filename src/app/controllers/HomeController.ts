import { Route } from "../../decorators/route";
import { Request, Response } from 'express';
import { DatabaseConfig } from "../config/db";
import { QueryBuilderOptions } from "../../interfaces/MysqlConfig-interface";

export class HomeController {

    protected db: DatabaseConfig;

    constructor() {
        this.db = new DatabaseConfig()
    }

    @Route('get', '/')
    async getHome(req: Request, res: Response){

        

        let result_query: QueryBuilderOptions = {
            from: ['images i'],
            joins: [
                'JOIN image_metadata im ON im.cod_image_metadata = i.cod_image_metadata'
            ]
        }

        const resultado_query = await this.db.buildComplexQuery(result_query)


        res.status(resultado_query.statusCode).json(resultado_query);
    }

    @Route('post', '/submit')
    submitData(req: Request, res: Response) {
        res.json({ message: 'Data submitted successfully!' });
    }
}