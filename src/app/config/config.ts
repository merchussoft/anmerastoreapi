import { MysqlRoot } from "../../interfaces/MysqlConfig-interface";

export abstract class Config {

    mysqlDataConexion(): MysqlRoot {
        return {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
        }
    }
}