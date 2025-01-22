import { Route } from "../../decorators/route";
import { Request, Response } from 'express';
import { DatabaseConfig } from "../config/db";
import { DataRegisterUser } from "../../interfaces/dataRegisterUser-interface";
import bcrypt from 'bcrypt';
//import { sendSuccessReturn } from "../../utils/responseHandler";

export class HomeController {

    protected db: DatabaseConfig;

    constructor() {
        this.db = new DatabaseConfig()
    }

    @Route('get', '/')
    async getHome(req: Request, res: Response){

        const resultado_query = await this.db.obtieneDatos({table: process.env.DB_NAME_BASEADMIN + ".empleados"});

        res.status(resultado_query.statusCode).json(resultado_query);
    }

    @Route('post', '/submit')
    submitData(req: Request, res: Response) {
        res.json({ message: 'Data submitted successfully!' });
    }


    @Route('post', '/register-user')
    async registerUser(req: Request, res: Response) {

        const data: DataRegisterUser = req.body
        data.password = await bcrypt.hash(data.password, 10);

        const resultado_query = await this.db.obtieneDatos({table: process.env.DB_NAME_BASEADMIN + ".empleados", str_adicional: "AND usuario=? OR email=?"}, [data.usuario, data.email]);

        console.log(resultado_query)
        //const { statusCode, response: {success}} = await this.db.insertTable(process.env.DB_NAME_BASEADMIN + ".empleados", data);
    
        //if(success) return sendSuccessReturn(res, 'Usuario registrado exitosamente', statusCode);
        //return sendSuccessReturn(res, 'Error al registrar al usuario', statusCode)

    }
}