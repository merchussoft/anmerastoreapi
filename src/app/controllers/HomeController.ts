import { Route } from "../../decorators/route";
import { Request, Response } from 'express';
import { DatabaseConfig } from "../config/db";
import { DataRegisterUser } from "../../interfaces/dataRegisterUser-interface";
import bcrypt from 'bcrypt';
import { sendSuccessReturn } from "../../utils/responseHandler";

/**
* @swagger
* tags:
*  name: Home
*  description: logica principal
*/
export class HomeController {

    protected db: DatabaseConfig;

    constructor() {
        this.db = new DatabaseConfig()
    }


    /**
     * @swagger
     * /:
     *  get:
     *      sumary: obtener todos lo empleados
     *      description: Endpoint para obtener todos lo empleado
     */
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

        const data_json: DataRegisterUser = req.body
        data_json.password = await bcrypt.hash(data_json.password, 10);

        const {response: data}  = await this.db.obtieneDatos({
            table: process.env.DB_NAME_BASEADMIN + ".empleados",
            str_adicional: "AND (usuario=? OR email=?)"}, [data_json.usuario, data_json.email]
        );

        if(data.data.length === 0) {
            const { statusCode, response: {success}} = await this.db.insertTable(process.env.DB_NAME_BASEADMIN + ".empleados", data_json);
            if(success) return sendSuccessReturn(res, 'Usuario registrado exitosamente', statusCode);
            return sendSuccessReturn(res, 'Error al registrar al usuario', statusCode)
        }

        return sendSuccessReturn(res, 'el usuario o email ya existe por favor intentar con uno nuevo', 403)
    }
}