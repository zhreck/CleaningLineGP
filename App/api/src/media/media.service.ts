import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    // Configuración de MinIO
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: +this.configService.get<number>('MINIO_PORT', 9000),
      useSSL:
        this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get<string>(
        'MINIO_ACCESS_KEY',
        'minioadmin',
      ),
      secretKey: this.configService.get<string>(
        'MINIO_SECRET_KEY',
        'minioadmin',
      ),
    });

    this.bucketName = this.configService.get<string>(
      'MINIO_BUCKET',
      'products',
    );
    this.publicUrl = this.configService.get<string>(
      'MINIO_PUBLIC_URL',
      'http://localhost:9000',
    );

    // Asegurar que el bucket existe
    this.ensureBucket();
  }

  /**
   * Asegurar que el bucket existe
   */
  private async ensureBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket "${this.bucketName}" created`);

        // Hacer el bucket público para lectura
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
        this.logger.log(`Bucket "${this.bucketName}" set to public`);
      }
    } catch (error) {
      this.logger.error('Error ensuring bucket:', error);
    }
  }

  /**
   * Generate unique filename using timestamp + UUID
   * Helper method for upload process
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop() || 'jpg';
    return `${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Build public URL for a file in MinIO
   * Helper method for URL construction
   */
  private buildPublicUrl(fileName: string): string {
    return `${this.publicUrl}/${this.bucketName}/${fileName}`;
  }

  /**
   * Extract filename from full URL
   * Helper method for delete operations
   */
  private extractFileName(url: string): string {
    const fileName = url.split('/').pop();
    if (!fileName) {
      throw new BadRequestException('Invalid URL: cannot extract filename');
    }
    return fileName;
  }

  /**
   * Upload an image file to MinIO storage
   * Validates file type and size, generates unique filename, and returns public URL
   */
  async upload(file: Express.Multer.File): Promise<{ url: string }> {
    try {
      // Validate file type
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only images are allowed (JPEG, PNG, GIF, WEBP)',
        );
      }

      // Generate unique filename
      const fileName = this.generateFileName(file.originalname);

      // Upload to MinIO
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      // Build and return public URL
      const url = this.buildPublicUrl(fileName);

      this.logger.log(`File uploaded successfully: ${fileName}`);

      return { url };
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * List all images from MinIO bucket
   * Returns array of public URLs for all stored images
   */
  async list(): Promise<string[]> {
    try {
      const stream = this.minioClient.listObjects(this.bucketName, '', true);
      const urls: string[] = [];

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (obj.name) {
            // Use helper method to build public URL
            const url = this.buildPublicUrl(obj.name);
            urls.push(url);
          }
        });

        stream.on('end', () => {
          this.logger.log(`Listed ${urls.length} files from bucket`);
          resolve(urls);
        });

        stream.on('error', (err) => {
          this.logger.error('Error listing files:', err);
          reject(err);
        });
      });
    } catch (error) {
      this.logger.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * Delete an image from MinIO storage
   * Accepts full URL and extracts filename for deletion
   */
  async delete(url: string): Promise<void> {
    try {
      // Extract filename from URL using helper method
      const fileName = this.extractFileName(url);

      // Remove object from MinIO
      await this.minioClient.removeObject(this.bucketName, fileName);

      this.logger.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error('Error deleting file:', error);
      throw error;
    }
  }
}
