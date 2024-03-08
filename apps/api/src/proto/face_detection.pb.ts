/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'face_detection';

export interface DetectFacesRequest {
  data: Uint8Array;
}

export interface Emotion {
  angry: number;
  disgust: number;
  fear: number;
  happy: number;
  sad: number;
  surprise: number;
  neutral: number;
}

export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
  leftEye: number[];
  rightEye: number[];
}

export interface Gender {
  Woman: number;
  Man: number;
}

export interface Race {
  races: { [key: string]: number };
}

export interface Race_RacesEntry {
  key: string;
  value: number;
}

export interface DetectFacesResponse {
  emotion: Emotion | undefined;
  dominantEmotion: string;
  region: Region | undefined;
  faceConfidence: number;
  age: number;
  gender: Gender | undefined;
  dominantGender: string;
  race: Race | undefined;
  dominantRace: string;
}

export interface DetectFacesResponseArray {
  responses: DetectFacesResponse[];
}

export const FACE_DETECTION_PACKAGE_NAME = 'face_detection';

export interface FaceDetectionServiceClient {
  detectFaces(
    request: DetectFacesRequest
  ): Observable<DetectFacesResponseArray>;
}

export interface FaceDetectionServiceController {
  detectFaces(
    request: DetectFacesRequest
  ):
    | Promise<DetectFacesResponseArray>
    | Observable<DetectFacesResponseArray>
    | DetectFacesResponseArray;
}

export function FaceDetectionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['detectFaces'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod('FaceDetectionService', method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod('FaceDetectionService', method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const FACE_DETECTION_SERVICE_NAME = 'FaceDetectionService';
