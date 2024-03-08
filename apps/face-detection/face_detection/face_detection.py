import io

import grpc
import numpy as np
from PIL import Image
from deepface import DeepFace
from concurrent import futures

import pathlib

import sys
sys.path.append(f"{pathlib.Path(__file__).parent.resolve()}/proto")

from proto import face_detection_pb2, face_detection_pb2_grpc

class FaceDetectionService(face_detection_pb2_grpc.FaceDetectionServiceServicer):
  def DetectFaces(self, request, context):
    image = Image.open(io.BytesIO(request.data))
    image.save("test.jpg")
    image_array = np.array(image)
    demographics = DeepFace.analyze(image_array)

    if len(demographics) == 0:
      return face_detection_pb2.DetectFacesResponseArray(responses=[])

    responses = []

    for demography in demographics:
      # Creating instances of nested message types
      emotion = face_detection_pb2.Emotion(**demography['emotion'])
      region = face_detection_pb2.Region(**demography['region'])
      gender = face_detection_pb2.Gender(**demography['gender'])
      race = face_detection_pb2.Race(races=demography['race'])

      # # Creating the GrpcResponse instance
      response = face_detection_pb2.DetectFacesResponse(
        emotion=emotion,
        dominant_emotion=demography['dominant_emotion'],
        region=region,
        face_confidence=demography['face_confidence'],
        age=demography['age'],
        gender=gender,
        dominant_gender=demography['dominant_gender'],
        race=race,
        dominant_race=demography['dominant_race']
      )

      responses.append(response)

    return face_detection_pb2.DetectFacesResponseArray(responses=responses)


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  face_detection_pb2_grpc.add_FaceDetectionServiceServicer_to_server(FaceDetectionService(), server)
  server.add_insecure_port('[::]:50051')
  print("Starting server on port 50051...")
  server.start()
  server.wait_for_termination()


if __name__ == '__main__':
  serve()
