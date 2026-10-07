from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import io
import base64
import traceback

from PIL import Image


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="VisionEdit AI API",
    version="1.0.0",
    description="Zero-shot object detection and generative image editing API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# IMAGE -> BASE64
# ============================================================

def image_to_base64(image):
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")

    encoded = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    return f"data:image/png;base64,{encoded}"


# ============================================================
# DETECT
# ============================================================

@app.post("/api/detect")
async def detect_objects(
    image: UploadFile = File(...),
    prompt: str = Form(...)
):
    try:
        print("\n========== API DETECT ==========")

        image_bytes = await image.read()

        pil_image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        temp_path = "/tmp/visionedit_detect.png"
        pil_image.save(temp_path)

        image_source, image_tensor = load_image(
            temp_path
        )

        image_tensor = image_tensor.cpu()

        fresh_model_cpu.eval()

        boxes, logits, phrases = predict(
            model=fresh_model_cpu,
            image=image_tensor,
            caption=prompt,
            box_threshold=0.25,
            text_threshold=0.20,
            device="cpu"
        )

        height, width = image_source.shape[:2]

        detections = []

        for index, (box, score, phrase) in enumerate(
            zip(boxes, logits, phrases)
        ):

            cx, cy, bw, bh = box.tolist()

            detections.append({
                "id": f"object-{index + 1}",
                "label": phrase,
                "score": round(float(score), 4),
                "box": [
                    round(cx - bw / 2, 4),
                    round(cy - bh / 2, 4),
                    round(bw, 4),
                    round(bh, 4)
                ]
            })

        print("Detected:", len(detections))
        print("Phrases:", phrases)

        return JSONResponse({
            "success": True,
            "prompt": prompt,
            "imageWidth": width,
            "imageHeight": height,
            "boxes": detections
        })

    except Exception as e:

        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )


# ============================================================
# REMOVE
# ============================================================

@app.post("/api/remove")
async def remove_objects(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    target_index: int = Form(0)
):
    try:

        print("\n========== API REMOVE ==========")

        image_bytes = await image.read()

        pil_image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        temp_path = "/tmp/visionedit_remove.png"
        pil_image.save(temp_path)

        image_source, image_tensor = load_image(
            temp_path
        )

        image_tensor = image_tensor.cpu()

        fresh_model_cpu.eval()

        boxes, logits, phrases = predict(
            model=fresh_model_cpu,
            image=image_tensor,
            caption=prompt,
            box_threshold=0.25,
            text_threshold=0.20,
            device="cpu"
        )

        if len(boxes) == 0:

            return JSONResponse(
                status_code=404,
                content={
                    "success": False,
                    "error": f"No objects detected for prompt: {prompt}"
                }
            )

        if target_index < 0 or target_index >= len(boxes):

            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": f"Invalid target_index. Detected {len(boxes)} objects."
                }
            )

        result, remove_mask = remove_object(
            image_source,
            boxes,
            target_index=target_index
        )

        print("Remove completed")

        return JSONResponse({
            "success": True,
            "prompt": prompt,
            "targetIndex": target_index,
            "detectedObjects": len(boxes),
            "image": image_to_base64(result),
            "mask": image_to_base64(remove_mask)
        })

    except Exception as e:

        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )


# ============================================================
# REPLACE
# ============================================================

@app.post("/api/replace")
async def replace_objects(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    replacement_prompt: str = Form(...),
    target_index: int = Form(0)
):
    try:

        print("\n========== API REPLACE ==========")

        image_bytes = await image.read()

        pil_image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        temp_path = "/tmp/visionedit_replace.png"
        pil_image.save(temp_path)

        image_source, image_tensor = load_image(
            temp_path
        )

        image_tensor = image_tensor.cpu()

        fresh_model_cpu.eval()

        boxes, logits, phrases = predict(
            model=fresh_model_cpu,
            image=image_tensor,
            caption=prompt,
            box_threshold=0.25,
            text_threshold=0.20,
            device="cpu"
        )

        if len(boxes) == 0:

            return JSONResponse(
                status_code=404,
                content={
                    "success": False,
                    "error": f"No objects detected for prompt: {prompt}"
                }
            )

        if target_index < 0 or target_index >= len(boxes):

            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": f"Invalid target_index. Detected {len(boxes)} objects."
                }
            )

        result, replace_mask = replace_object(
            image_source,
            boxes,
            replacement_prompt=replacement_prompt,
            target_index=target_index
        )

        print("Replace completed")

        return JSONResponse({
            "success": True,
            "prompt": prompt,
            "replacementPrompt": replacement_prompt,
            "targetIndex": target_index,
            "detectedObjects": len(boxes),
            "image": image_to_base64(result),
            "mask": image_to_base64(replace_mask)
        })

    except Exception as e:

        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )


# ============================================================
# GENERATE
# ============================================================

@app.post("/api/generate")
async def generate_image(
    prompt: str = Form(...),
    negative_prompt: str = Form(
        "blurry, distorted, low quality, artifacts"
    )
):
    try:

        print("\n========== API GENERATE ==========")

        result = generate_pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=30,
            guidance_scale=7.5
        ).images[0]

        print("Generation completed")

        return JSONResponse({
            "success": True,
            "prompt": prompt,
            "image": image_to_base64(result)
        })

    except Exception as e:

        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )


print("========================================")
print("VisionEdit AI FastAPI backend created")
print("========================================")
print("POST /api/detect")
print("POST /api/remove")
print("POST /api/replace")
print("POST /api/generate")
print("========================================")
