import { S3Client } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
    region: "us-east-1", // La región es opcional para MinIO pero debe estar definida.
    endpoint: "http://192.168.1.25:9002", // URL de tu servidor MinIO
    forcePathStyle: true, // Obligatorio para MinIO
    credentials: {
        accessKeyId: "2aVkkSynA6wlDskdQiW9", // Reemplaza con tu clave de acceso
        secretAccessKey: "yYuDkCwtSAKgDZsfkoeTeDYrmpVwSsxcBDNC7JTh", // Reemplaza con tu clave secreta
    },
});


export default s3Client;