import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand,ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import s3Client from "../config/minioClient-config";
import { Readable } from "stream";

// subir un archivo
class minioService {
    
    private client;

    constructor() {
        this.client = s3Client
    }

    async uploadFile(bucketName: string, key: string, body: Buffer | Readable) {
        try {
            
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: body
            });

            const response = await this.client.send(command);
            console.log("Archivo suiido correctamente ", response)
            return response;
        } catch (error) {
            console.error("Error al subir archivo:", error);
            throw error;
        }
    }
}