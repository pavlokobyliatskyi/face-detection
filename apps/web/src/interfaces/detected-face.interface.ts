export interface Emotion {
  angry: number;
  disgust: number;
  fear: number;
  happy: number;
  sad: number;
  surprise: number;
  neutral: number;
}

export interface IDetectFaceRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  leftEye: number[];
  rightEye: number[];
}

export interface IDetectFaceGender {
  Woman: number;
  Man: number;
}

export interface IDetectFaceRace {
  races: { [key: string]: number };
}

export interface IDetectFace {
  emotion: Emotion | undefined;
  dominantEmotion: string;
  region: IDetectFaceRegion | undefined;
  faceConfidence: number;
  age: number;
  gender: IDetectFaceGender | undefined;
  dominantGender: string;
  race: IDetectFaceRace | undefined;
  dominantRace: string;
}
