export interface DataRegisterUser {
    nombre: string,
    usuario: string,
    email: string,
    telefono?: number,
    password: string,
    cod_perfil: number,
    direccion?: string
}