
# VisionEdit AI Backend

FastAPI backend for VisionEdit AI.

## Features

- Zero-shot object detection using Grounding DINO
- Object removal using Stable Diffusion Inpainting
- Object replacement using Stable Diffusion Inpainting
- Text-to-image generation using Stable Diffusion
- REST API for React frontend integration

## API Endpoints

- `POST /api/detect`
- `POST /api/remove`
- `POST /api/replace`
- `POST /api/generate`

## Models

The backend uses:

- Grounding DINO
- Stable Diffusion Inpainting
- Stable Diffusion v1.5

Model weights are **not included in this repository** because of their size. They must be downloaded/configured when setting up the backend.

## Runtime

The current development backend runs on a GPU-enabled Google Colab environment and is exposed to the frontend through an HTTPS tunnel.

## Important

This repository does not contain:

- Model checkpoints
- API tokens
- ngrok authentication credentials
- Colab runtime state
