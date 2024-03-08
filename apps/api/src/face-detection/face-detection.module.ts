import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { FaceDetectionClient } from './clients/face-detection.client';
import { FaceDetectionService } from './services/face-detection.service';
import { FACE_DETECTION_PACKAGE_NAME } from '../proto/face_detection.pb';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FACE_DETECTION',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: FACE_DETECTION_PACKAGE_NAME,
          // Maybe you need to generate a full client instead?
          protoPath: join(__dirname, '../../../proto/face_detection.proto'),
        },
      },
    ]),
  ],
  providers: [FaceDetectionClient, FaceDetectionService],
  exports: [FaceDetectionService],
})
export class FaceDetectionModule {}
