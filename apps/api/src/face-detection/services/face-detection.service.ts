import { Injectable } from '@nestjs/common';
import { FaceDetectionClient } from '../clients/face-detection.client';
import { lastValueFrom } from 'rxjs';
import { DetectFacesResponseArray } from '../../proto/face_detection.pb';

@Injectable()
export class FaceDetectionService {
  constructor(private readonly faceDetectionClient: FaceDetectionClient) {}

  async detectFaces(buffer: Uint8Array): Promise<DetectFacesResponseArray> {
    return await lastValueFrom(
      this.faceDetectionClient.detectFaces({ data: buffer })
    );
  }
}
