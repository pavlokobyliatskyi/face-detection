import { ChangeEvent, FormEvent, StrictMode, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { IDetectFace } from './interfaces/detected-face.interface';
import './styles.css';

// DEMO CODE!

const App = () => {
  const [file, setFile] = useState<File | null>(null);

  const [detectFaces, setDetectFaces] = useState<IDetectFace[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [face, setFace] = useState<IDetectFace>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files?.length) {
      return;
    }

    setFile(e.target.files[0]);

    const reader = new FileReader();
    reader.onload = handleFileRead;
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleFileRead = (e: ProgressEvent<FileReader>) => {
    if (!e?.target?.result) {
      return;
    }

    const imageUrl = e.target.result as string;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef?.current as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;

      // Set canvas dimensions to match image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image at (0, 0) position
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const url = 'http://localhost:3000/upload';
    const formData = new FormData();

    formData.append('file', file);

    setIsLoading(true);

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('File upload failed');
        }
      })
      .then((data: IDetectFace[]) => {
        setIsLoading(false);

        console.log('Server response:', data);
        setDetectFaces(data);

        const canvas = canvasRef?.current as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;

        // Draw
        for (const face of data) {
          if (face?.region) {
            // Draw rectangle
            const rectangle = {
              x: face.region?.x,
              y: face.region.y,
              w: face.region.w,
              h: face.region.h,
            };
            ctx.strokeStyle = 'red'; // Set rectangle border color
            ctx.lineWidth = 2; // Set border width
            ctx.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
          }
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  const handleCanvasClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef?.current as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;

    const mouseX =
      ((event.clientX - (rect?.left || 0)) * canvas!.width) /
      canvas!.clientWidth;
    const mouseY =
      ((event.clientY - (rect?.top || 0)) * canvas!.height) /
      canvas!.clientHeight;

    detectFaces.forEach((face, index) => {
      if (!face?.region) {
        return;
      }

      if (
        mouseX >= face.region.x &&
        mouseX <= face.region.x + face.region.w &&
        mouseY >= face.region.y &&
        mouseY <= face.region.y + face.region.h
      ) {
        console.log(`Clicked inside rectangle ${index + 1}`, face);
        setFace(face);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>
          Face Detector (select an image file and upload it after downloading
          click on the face to get more details)
        </h1>
        <br />
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!Boolean(file) || isLoading}>
          {isLoading ? 'Loading...' : 'Upload'}
        </button>
      </form>
      <hr />
      <div className="canvas-box">
        <canvas
          ref={canvasRef}
          width={1920 / 3}
          height={1080 / 3}
          onClick={handleCanvasClick}
        />
        {face ? (
          <div className="face-info">
            <div>
              <div>Age: {face?.age}</div>
              <div>Dominant Emotion: {face.dominantEmotion}</div>
              <div>Dominant Gender: {face.dominantGender}</div>
              <div>Emotion:</div>
              <ul>
                <li>Angry: {face.emotion?.angry}</li>
                <li>Disgust: {face.emotion?.disgust}</li>
                <li>Fear: {face.emotion?.fear}</li>
                <li>Happy: {face.emotion?.happy}</li>
                <li>Neutral: {face.emotion?.neutral}</li>
                <li>Sad: {face.emotion?.sad}</li>
                <li>Surprise: {face.emotion?.surprise}</li>
              </ul>
              <div>Face Confidence: {face.faceConfidence}</div>
              <div>Gender:</div>
              <ul>
                <li>Man: {face.gender?.Man}</li>
                <li>Woman: {face.gender?.Woman}</li>
              </ul>
              <div>Race:</div>
              <ul>
                {Object.entries(
                  face.race?.races as { [k: string]: number }
                ).map(([k, v]) => (
                  <li key={k}>
                    {k}:{v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
