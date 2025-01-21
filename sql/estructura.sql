CREATE DATABASE IF NOT EXISTS anmera;
CREATE DATABASE IF NOT EXISTS anmera_admin;

CREATE USER 'anmera'@'%' IDENTIFIED WITH mysql_native_password BY '#Cuervo2017';

GRANT ALL PRIVILEGES ON anmera.* TO 'anmera'@'%';
GRANT ALL PRIVILEGES ON anmera_admin.* TO 'anmera'@'%';
FLUSH PRIVILEGES;

-- aqui vamos a empesar a crear la estructura de la base de datos.

-- Categorías de productos
CREATE TABLE IF NOT EXISTS categorias(
    cod_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


-- Productos
CREATE TABLE IF NOT EXISTS productos(
    cod_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    cod_categoria INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_categoria) REFERENCES categorias(cod_categoria) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

-- Clientes
CREATE TABLE IF NOT EXISTS clientes (
    cod_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(15),
    direccion TEXT,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;





-- anmera_admin.empleados
CREATE TABLE IF NOT EXISTS anmera_admin.empleados (
    cod_empleado INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    telefono VARCHAR(15),
    direccion TEXT,
    cod_perfil INT,
    fecha_contratacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_perfil) REFERENCES anmera_admin.perfiles(cod_perfil) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


-- crear la vista que replique la tabla empleado
CREATE OR REPLACE VIEW anmera.empleados AS
SELECT * FROM anmera_admin.empleados;


CREATE TABLE IF NOT EXISTS Ventas (
    cod_venta INT AUTO_INCREMENT PRIMARY KEY,
    cod_cliente INT,
    cod_empleado INT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cod_cliente) REFERENCES clientes(cod_cliente) ON DELETE SET NULL,
    FOREIGN KEY (cod_empleado) REFERENCES anmera_admin.empleados(cod_empleado) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE IF NOT EXISTS detalle_ventas (
    cod_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    cod_venta INT NOT NULL,
    cod_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (cod_venta) REFERENCES ventas(cod_venta) ON DELETE CASCADE,
    FOREIGN KEY (cod_producto) REFERENCES productos(cod_producto) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

-- Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    cod_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(150) UNIQUE,
    direccion TEXT,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


-- Compras
CREATE TABLE IF NOT EXISTS compras (
    cod_compra INT AUTO_INCREMENT PRIMARY KEY,
    cod_proveedor INT NOT NULL,
    cod_empleado INT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cod_proveedor) REFERENCES proveedores(cod_proveedor) ON DELETE CASCADE,
    FOREIGN KEY (cod_empleado) REFERENCES anmera_admin.empleados(cod_empleado) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


-- Detalle de compras
CREATE TABLE IF NOT EXISTS detalle_compras (
    cod_detalle_compra INT AUTO_INCREMENT PRIMARY KEY,
    cod_compra INT NOT NULL,
    cod_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (cod_compra) REFERENCES compras(cod_compra) ON DELETE CASCADE,
    FOREIGN KEY (cod_producto) REFERENCES productos(cod_producto) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

-- Inventarios
CREATE TABLE IF NOT EXISTS inventarios (
    cod_inventario INT AUTO_INCREMENT PRIMARY KEY,
    cod_producto INT NOT NULL,
    stock_actual INT NOT NULL,
    stock_minimo INT NOT NULL,
    ultima_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_producto) REFERENCES productos(cod_producto) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


-- Métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pagos (
    cod_metodos_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


-- Pagos
CREATE TABLE IF NOT EXISTS pagos (
    cod_pago INT AUTO_INCREMENT PRIMARY KEY,
    cod_venta INT NOT NULL,
    cod_metodos_pago INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cod_venta) REFERENCES ventas(cod_venta) ON DELETE CASCADE,
    FOREIGN KEY (cod_metodos_pago) REFERENCES metodos_pagos(cod_metodos_pago) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

-- perfiles
CREATE TABLE IF NOT EXISTS anmera_admin.perfiles(
	cod_perfil INT AUTO_INCREMENT PRIMARY KEY,
	nombre varchar(50) unique not null,
	activo tinyint default 0,
	createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;