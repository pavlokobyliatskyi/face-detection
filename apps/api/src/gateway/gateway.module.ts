import { HashModule } from '../hash/hash.module';
import { Module } from '@nestjs/common';
import { FilesController } from './controllers/files/files.controller';
import { FacesModule } from '../files/faces.module';
import { FaceDetectionModule } from '../face-detection/face-detection.module';

@Module({
  imports: [FacesModule, HashModule, FaceDetectionModule],
  controllers: [FilesController],
})
export class GatewayModule {}
