import mysql from 'mysql2/promise';
import { obtiene_datos, QueryBuilderOptions, QueryResponse } from '../../interfaces/MysqlConfig-interface';
import { sendQueryResult } from '../../utils/responseHandler';
import { Config } from './config';

export class DatabaseConfig  extends Config {

    private pool: mysql.Pool;

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
  public async obtieneDatos(data: obtiene_datos, datos?: []): Promise<QueryResponse> {
    const campos = data.lista_campos?.toString() || '*';
    const adicional = data.str_adicional || '';
    const campo = data.campo || '1';
    const valor = data.valor || '1';

    const sql = `SELECT ${campos} FROM ${data.table} WHERE ${campo}=${this.escapeValue(
      valor
    )} ${adicional}`;
    return this.resultPromise(sql);
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
  //asignar '*' si no se especifica campos
  const fields = inputFields && inputFields.length > 0 ? inputFields : ['*'];
  // Construcción de SELECT y FROM
  let query = `SELECT ${fields.join(', ')} FROM ${from.join(', ')}`;
  // Construcción de JOINs
  if (joins.length > 0) query += ` ${joins.join(' ')}`;
  // Construcción de WHERE
  if (where.length > 0) {

    const where_clause = where
    .map((item, index) => `${index > 0 ? item.operator : ''} ${item.condition}`.trim())
    .join(' ');
    query += ` WHERE ${where_clause}`;
  } 
  // Construcción de GROUP BY
  if (groupBy.length > 0) query += ` GROUP BY ${groupBy.join(', ')}`;
  // Construcción de HAVING
  if (having.length > 0) query += ` HAVING ${having.join(' AND ')}`;
  // Construcción de ORDER BY
  if (orderBy.length > 0) query += ` ORDER BY ${orderBy.join(', ')}`;
  // Construcción de LIMIT y OFFSET
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
    if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
    return value.toString();
  }
}

