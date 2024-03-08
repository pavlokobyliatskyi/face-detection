Generate .py files from proto

```shell
cd apps/face-detection
```

```shell
poetry shell
```

```shell
poetry run python -m grpc_tools.protoc -I./../../proto --python_out=./face_detection/proto --grpc_python_out=./face_detection/proto ../../proto/face_detection.proto
```
