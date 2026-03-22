import {
  Bucket$,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import r2Client from '@/shared/services/r2-client';

@Injectable()
export class R2Service {
  private readonly bucket = process.env.R2_BUCKET_NAME!;

  async uploadFile(file: Express.Multer.File, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await r2Client.send(command);

    return `https://pub-0c96a741fb544fc3ac454292edeeb4c6.r2.dev/${key}`;
  }

  async deleteFile(key: string) {
    try {
      await r2Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (err) {
      if (err.name === 'NotFound') {
        console.log('الملف غير موجود!');
        return;
      }

      throw err;
    }
  }
}
