import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  DetectFacesRequest,
  DetectFacesResponseArray,
  FACE_DETECTION_SERVICE_NAME,
  FaceDetectionServiceClient,
} from '../../proto/face_detection.pb';

@Injectable()
export class FaceDetectionClient implements OnModuleInit {
  private faceDetectionService: FaceDetectionServiceClient;

  constructor(@Inject('FACE_DETECTION') private client: ClientGrpc) {}

  onModuleInit() {
    this.faceDetectionService =
      this.client.getService<FaceDetectionServiceClient>(
        FACE_DETECTION_SERVICE_NAME
      );
  }

  detectFaces(
    request: DetectFacesRequest
  ): Observable<DetectFacesResponseArray> {
    return this.faceDetectionService.detectFaces(request);
  }
}
