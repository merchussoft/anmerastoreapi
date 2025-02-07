export interface ObtieneDatos {
    lista_campos?: {},
    str_adicional?: string,
    campo?: number | string,
    valor?: number | string,
    table: string,
    database?: string
}

export interface MysqlRoot {
    host: string | undefined
    user: string | undefined
    password: string | undefined
    database: string | undefined
    port: number | undefined
  }


export interface QueryBuilderOptions {
    fields?: string[]; // Campos a seleccionar
    from: string[]; // Tablas principales
    joins?: string[]; // Uniones (JOINs)
    where?: WhereCondition[]; // Condiciones WHERE
    groupBy?: string[]; // Agrupaciones
    having?: string[]; // Condiciones HAVING
    orderBy?: string[]; // Ordenamientos
    limit?: number; // Límite de resultados
    offset?: number; // Desplazamiento de resultados
}

export interface QueryResponse {
    statusCode: number;
    response: {
      success: boolean;
      data: any[];
      message: string;
    };
  }

export interface WhereCondition {
    operator: 'AND' | 'OR'; // Operadores válidos
    condition: string;      // Condición SQL como 'campo = valor' o 'campo IN (...)'
  }