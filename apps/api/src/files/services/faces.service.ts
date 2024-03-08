import { Injectable } from '@nestjs/common';
import { DetectFacesResponse } from '../../proto/face_detection.pb';

@Injectable()
export class FacesService {
  private readonly faces: Map<string, DetectFacesResponse[]> = new Map();

  createFaces(hash: string, file: DetectFacesResponse[]): void {
    this.faces.set(hash, file);
  }

  getFaces(hash: string) {
    return this.faces.get(hash);
  }
}
