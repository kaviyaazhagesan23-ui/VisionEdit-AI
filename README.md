# VisionEdit AI

> Zero-Shot Object Detection and Generative Image Editing with Grounding DINO and Stable Diffusion

VisionEdit AI is an AI-powered image understanding and editing system that allows users to interact with images using natural-language prompts.

The system combines **Grounding DINO** for open-vocabulary object detection with **Stable Diffusion** for generative image editing and text-to-image generation.

Users can detect objects, remove objects, replace objects with new content, and generate completely new images from text prompts through a single web interface.

---

## Overview

Traditional image-editing systems often require manual selection, masking, and editing.

VisionEdit AI automates this workflow by combining computer vision and generative AI:

```text
Natural-Language Prompt
        |
        v
   Grounding DINO
        |
        v
 Object Detection
        |
        v
 Bounding Box
        |
        v
 Automatic Mask
        |
        +----------------------+
        |                      |
        v                      v
 Remove / Replace       Stable Diffusion
                         Inpainting
                              |
                              v
                         Edited Image

For image generation, the system directly sends the user's text prompt to Stable Diffusion.

Features
1. Detect

Detect objects in an uploaded image using a natural-language prompt.

Example:

Prompt: car

The system identifies matching objects and returns:

Object label
Confidence score
Bounding box
Object index

The detection model uses Grounding DINO, allowing open-vocabulary detection without restricting the system to a fixed set of predefined object classes.

2. Remove

Remove a detected object from an image.

Example:

Prompt: car
Action: Remove

The system:

Detects the requested object.
Selects the target bounding box.
Converts the bounding box into an editing mask.
Sends the image and mask to Stable Diffusion Inpainting.
Generates a reconstructed background.
3. Replace

Replace an object with new content using a text prompt.

Example:

Object: car
Replacement: futuristic electric vehicle

The system automatically creates the mask for the detected object and uses Stable Diffusion Inpainting to generate the replacement while attempting to preserve the surrounding scene.

4. Generate

Generate a new image directly from a text prompt using Stable Diffusion.

Example:

A futuristic city at sunset with flying cars

The generated image can then be viewed or downloaded from the application.

System Architecture
                         USER
                           |
                           v
                  React / Vite Frontend
                           |
                           | HTTPS
                           v
                     ngrok Tunnel
                           |
                           v
                    FastAPI Backend
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
      Grounding DINO   Stable Diffusion  Stable Diffusion
       Object Detection  Inpainting       Text-to-Image
             |             |             |
             v             v             v
        Bounding Box     Remove/Replace  Generated Image
             |             |
             +-------------+
                   |
                   v
              Output Portal
              /           \
             v             v
           VIEW         DOWNLOAD
AI Pipeline
Object Detection

VisionEdit AI uses Grounding DINO for open-vocabulary object detection.

Instead of requiring a fixed class list such as:

person
car
dog
cat

the user can provide natural-language prompts such as:

red car
person wearing a jacket
bicycle
truck

Grounding DINO returns bounding boxes and confidence scores for matching objects.

Automatic Mask Generation

The detected normalized bounding box is converted into an image-space region.

The system creates a grayscale mask:

Detected Object
       |
       v
Bounding Box
       |
       v
Mask Generation
       |
       v
Stable Diffusion Inpainting

The mask determines which part of the image should be regenerated.

Generative Editing

Stable Diffusion Inpainting receives:

Original image
Generated mask
Editing prompt
Negative prompt

It then generates new content inside the selected region.

This enables both:

Object Removal

and:

Object Replacement

using the same generative editing pipeline.

Technology Stack
Frontend
React
Vite
JavaScript
Framer Motion
Three.js
React Three Fiber
Drei
Lucide Icons
Backend
Python
FastAPI
Uvicorn
Python Multipart
Pillow
NumPy
OpenCV
AI / Machine Learning
Grounding DINO
Stable Diffusion Inpainting
Stable Diffusion v1.5
PyTorch
Hugging Face Transformers
Hugging Face Diffusers
Accelerate
Infrastructure
Google Colab GPU
NVIDIA Tesla T4
ngrok
GitHub
Application Modes
Mode	Technology	Purpose
Detect	Grounding DINO	Detect objects using natural-language prompts
Remove	Grounding DINO + Stable Diffusion Inpainting	Remove selected objects
Replace	Grounding DINO + Stable Diffusion Inpainting	Replace selected objects
Generate	Stable Diffusion v1.5	Generate images from text
API

The FastAPI backend exposes the following endpoints.

Detect
POST /api/detect

Form data:

image
prompt

Example response:

{
  "success": true,
  "prompt": "car",
  "boxes": [
    {
      "id": "object-1",
      "label": "car",
      "score": 0.91,
      "box": [0.21, 0.18, 0.42, 0.35]
    }
  ]
}
Remove
POST /api/remove

Form data:

image
prompt
target_index

Returns:

Edited image
Generated mask
Detection information
Replace
POST /api/replace

Form data:

image
prompt
replacement_prompt
target_index

Returns:

Edited image
Generated mask
Detection information
Generate
POST /api/generate

Form data:

prompt
negative_prompt

Returns a generated image encoded as a data URL.

Frontend

The frontend provides a visual AI workspace with four primary workflows:

+------------------------------------------------+
|                 VISIONEDIT AI                  |
+------------------------------------------------+
|                                                |
|  DETECT    REMOVE    REPLACE    GENERATE       |
|                                                |
|        Image Workspace / Vision Chamber        |
|                                                |
|              Processing / Result               |
|                                                |
|          VIEW              DOWNLOAD            |
|                                                |
+------------------------------------------------+

The interface is designed as a futuristic visual-computing workspace rather than a traditional form-based dashboard.

The visual design combines:

Space-inspired environment
Animated particles
Three-dimensional elements
Technical HUD elements
Image-processing workspace
Motion-based transitions
Interactive result viewing
Responsive layout
Project Structure
VisionEdit-AI/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
│
├── public/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── lib/
│   └── ...
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
Frontend Setup
Requirements

Install:

Node.js
npm

Clone the repository:

git clone https://github.com/kaviyaazhagesan23-ui/VisionEdit-AI.git

Move into the project:

cd VisionEdit-AI

Install dependencies:

npm install
Environment Configuration

Create a .env file based on .env.example.

Example:

VITE_MOCK=false
VITE_API_BASE_URL=http://localhost:8000

For a remotely hosted backend, VITE_API_BASE_URL can point to the backend's HTTPS endpoint.

Do not commit .env files containing private credentials or tokens.

Run Frontend
npm run dev

The Vite development server will start locally.

Backend Setup

The backend requires a GPU environment for practical inference performance.

The current development setup uses:

Google Colab
    |
    v
NVIDIA Tesla T4 GPU
    |
    v
FastAPI
    |
    v
ngrok HTTPS Tunnel

Install the backend dependencies:

pip install -r backend/requirements.txt

The backend requires model weights for:

Grounding DINO
Stable Diffusion Inpainting
Stable Diffusion v1.5

Model checkpoints are intentionally not included in this repository because of their size.

Model Details
Grounding DINO

Grounding DINO is used for open-vocabulary object detection.

Input:

Image + Text Prompt

Output:

Bounding Boxes
Confidence Scores
Detected Labels
Stable Diffusion Inpainting

Stable Diffusion Inpainting is used for:

Object removal
Object replacement

Input:

Original Image
+
Mask
+
Prompt

Output:

Edited Image
Stable Diffusion v1.5

Stable Diffusion v1.5 is used for text-to-image generation.

Input:

Text Prompt

Output:

Generated Image
Example Workflow
Object Removal
1. Upload image
        |
2. Select REMOVE
        |
3. Enter object prompt
        |
4. Grounding DINO detects object
        |
5. Select target object
        |
6. Generate mask
        |
7. Stable Diffusion Inpainting
        |
8. Display edited result
        |
9. View / Download
Object Replacement
Image
  |
  v
Detect Target
  |
  v
Generate Mask
  |
  v
Replacement Prompt
  |
  v
Stable Diffusion Inpainting
  |
  v
Edited Image
Why This Project

VisionEdit AI demonstrates the integration of multiple AI capabilities into a single end-to-end application.

The project combines:

Computer Vision
       +
Generative AI
       +
Natural Language Interaction
       +
Web Application Development
       +
GPU Inference
       =
VisionEdit AI

Instead of building an isolated machine-learning model, the project focuses on connecting AI models with a usable interactive application.

Key Technical Challenges
Open-Vocabulary Detection

The system needs to interpret arbitrary natural-language object prompts rather than relying only on predefined object classes.

Detection-to-Editing Pipeline

Object detection produces bounding boxes, while image editing requires masks.

The project therefore includes an intermediate mask-generation step to connect the two models.

GPU Memory Management

Stable Diffusion models require significant GPU memory, making GPU-based inference important for practical execution.

Frontend / Backend Integration

The React frontend communicates with the FastAPI backend through HTTP requests and multipart form data.

Remote GPU Backend

The application can connect a local browser-based frontend to a GPU-backed Google Colab runtime through an HTTPS tunnel.

Current Limitations
The current development backend depends on a GPU-enabled runtime.
Google Colab sessions are temporary and can disconnect.
ngrok tunnel URLs may change when a new tunnel is created.
Large generative models require substantial GPU memory.
Generated results can vary between runs.
Detection accuracy depends on the image and natural-language prompt.
The current backend setup is primarily intended for development and demonstration rather than production-scale deployment.
Future Improvements

Potential future improvements include:

Permanent GPU/cloud backend deployment
Persistent API hosting
Segmentation-based masks instead of bounding-box masks
More precise object selection
Multi-object editing
Image history and undo/redo
User accounts and saved projects
Batch image processing
Model optimization and quantization
GPU inference optimization
Production deployment with Docker
Background job processing for long-running generations
Improved safety filtering for generated content
Project Status

Status: Working Prototype

The current system supports:

 React frontend
 FastAPI backend
 Grounding DINO object detection
 Stable Diffusion inpainting
 Object removal
 Object replacement
 Stable Diffusion image generation
 Frontend/backend API integration
 GPU inference
 HTTPS backend connection
 Image viewing
 Image downloading
 GitHub repository
Repository

GitHub:

https://github.com/kaviyaazhagesan23-ui/VisionEdit-AI

Disclaimer

This project is an educational and portfolio-oriented AI application.

The models used by the project are pretrained generative and computer-vision models. Generated results may contain inaccuracies, artifacts, or unexpected visual content.

Author

Kaviya Azhagesan

B.Tech Computer Science and Engineering
Artificial Intelligence & Machine Learning

License

This repository contains application code developed for the VisionEdit AI project.

The pretrained models used by the project are subject to their respective licenses and terms of use.
