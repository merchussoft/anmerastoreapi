import { Route, Controller } from "../../utils/loadRoutes";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { DatabaseConfig } from "../config/db";
import { validateLogin } from "../middleware/validateLogin";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import { jwtEncoded } from "../middleware/auth-middleware";



@Controller('/login')
export class HomeController {

    protected db: DatabaseConfig;

    constructor() {
        this.db = new DatabaseConfig()
    }


    // ruta para el login
    @Route('post', '/', {middleware: [validateLogin]})
    async getHome(req: Request, res: Response){

        const { usuario, password } = req.body;
        
        try {
            // Buscar el usuario en la base de datos por username
            const { response: {data}} = await this.db.obtieneDatos({
                lista_campos: ['count(cod_empleado) as count, password, cod_empleado'],
                table: 'empleados',
                campo: "usuario",
                valor: usuario,
                database: process.env.DB_NAME_BASEADMIN
            });

            console.log('mirando esto ', data);
            /**const data_result = data[0];
            if(!data_result.count) return sendError(res, 'warning', 'El usuario es incorrecto', 403);

            // Comparar la contraseña proporcionada con la encriptada en la base de datos
            const password_match = await bcrypt.compare(password, data_result.password);
            if(!password_match) return sendError(res, 'warning', 'La password es incorrecta', 403);

            // Generar un JWT si las credenciales son correctas
            const token = jwtEncoded({ userId: data_result.cod_empleado });
            return sendSuccess(res, {token: token}, 'Login exitoso')*/
            
        } catch (error) {
            console.log('mirando este error ', error)
            return sendError(res, 'error', 'error en el servidor', 500);
        }
        
    }


}