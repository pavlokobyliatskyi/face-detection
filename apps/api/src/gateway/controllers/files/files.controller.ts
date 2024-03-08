import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FacesService } from '../../../files/services/faces.service';
import { HashService } from '../../../hash/services/hash.service';
import { FaceDetectionService } from '../../../face-detection/services/face-detection.service';
import 'multer';

@Controller()
export class FilesController {
  constructor(
    private readonly filesService: FacesService,
    private readonly hashService: HashService,
    private readonly faceDetectionService: FaceDetectionService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // TODO: Check the image size (5684715 x 4194304)

    const fileHash = await this.hashService.getFileHash(file.buffer);

    const existFaces = this.filesService.getFaces(fileHash);

    if (existFaces) {
      return existFaces;
    }

    const detectedFaces = await this.faceDetectionService.detectFaces(
      file.buffer
    );

    this.filesService.createFaces(fileHash, detectedFaces?.responses || []);

    if (!detectedFaces?.responses) {
      return [];
    }

    return detectedFaces.responses;
  }
}
