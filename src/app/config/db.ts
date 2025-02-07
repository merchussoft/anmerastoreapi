import mysql from 'mysql2/promise';
import { ObtieneDatos, QueryBuilderOptions, QueryResponse } from '../../interfaces/MysqlConfig-interface';
import { sendQueryResult } from '../../utils/responseHandler';
import { Config } from './config';

export class DatabaseConfig  extends Config {

    private readonly pool: mysql.Pool;

    constructor() {
        super()
        this.pool = this.createPool();
    }

    private createPool() {
        return mysql.createPool(this.mysqlDataConexion());
    }

    /**
   * Ejecuta una consulta SQL con soporte de promesas.
   * @param sql Consulta SQL a ejecutar.
   * @param data Parámetros para la consulta.
   * @returns Resultado de la consulta.
   */
    public async resultPromise(sql: string, data: any[] = []): Promise<any> {
        try {
          const [rows] = await this.pool.execute(sql, data);
          console.log( ' mirando esto ', sql)
          console.log( ' mirando esto ', rows)
          return sendQueryResult(rows)
        } catch (err: any) {
          return sendQueryResult([], err.sqlMessage, 406)
        }
    }

    /**
   * Obtiene datos de la base de datos según los parámetros enviados.
   * @param data Parámetros para la consulta.
   * @returns Resultado de la consulta.
   */
  public async obtieneDatos(data: ObtieneDatos, datos: any[] = []): Promise<QueryResponse> {
    const campos = data.lista_campos?.toString() ?? '*';
    const adicional = data.str_adicional ?? '';
    const campo = data.campo ?? '1';
    const valor = data.valor ?? '1';
    const data_table = data.database ? `${data.database.replace(/"/g, '')}.${data.table}` : data.table;

    const sql = `SELECT ${campos} FROM ${data_table} WHERE ${campo}=${this.escapeValue(valor)} ${adicional}`;
    console.log(sql)
    return await this.resultPromise(sql, datos);
  }

  /**
   * Inserta datos en una tabla específica.
   * @param table Nombre de la tabla.
   * @param data Datos a insertar.
   * @returns Resultado de la operación.
   */
  public async insertTable(table: string, datas: Record<string, any>): Promise<any> {
    const campos = Object.keys(datas).join(', ');
    const placeholders = Object.keys(datas).map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${campos}) VALUES (${placeholders})`;

    try {
      const {response: { data }} = await this.resultPromise(sql, Object.values(datas));
      return sendQueryResult({ insertId: data.insertId })
    } catch (err: any) {
        return sendQueryResult([], err.sqlMessage, 406)
    }
  }


public async buildComplexQuery(options: QueryBuilderOptions, datos: [] = []): Promise<QueryResponse> {

  const { fields: inputFields, from, joins=[], where=[], groupBy = [], having = [], orderBy = [], limit, offset } = options; 

  const fields = inputFields && inputFields.length > 0 ? inputFields : ['*'];
  let query = `SELECT ${fields.join(', ')} FROM ${from.join(', ')}`;
  if (joins.length > 0) query += ` ${joins.join(' ')}`;
  
  // Construcción de WHERE
  if (where.length > 0) {
    const where_clause = where
    .map((item, index) => `${index > 0 ? item.operator : ''} ${item.condition}`.trim())
    .join(' ');
    query += ` WHERE ${where_clause}`;
  } 

  if (groupBy.length > 0) query += ` GROUP BY ${groupBy.join(', ')}`;
  if (having.length > 0) query += ` HAVING ${having.join(' AND ')}`;
  if (orderBy.length > 0) query += ` ORDER BY ${orderBy.join(', ')}`;
  if (limit !== undefined) query += ` LIMIT ${limit}`;
  if (offset !== undefined) query += ` OFFSET ${offset}`;

  return this.resultPromise(query, datos);
}

  /**
   * Escapa valores para prevenir inyecciones SQL.
   * @param value Valor a escapar.
   * @returns Valor escapado.
   */
  private escapeValue(value: any): string {

    if(value === '?') return value;

    if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
    return value.toString();
  }
}

