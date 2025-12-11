import base64
import cv2
import numpy as np

def decode_base64_to_image(b64):
    try:
        arr = np.frombuffer(base64.b64decode(b64), np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)
    except:
        return None

def encode_image_to_base64(img):
    ok, buf = cv2.imencode(".png", img)
    return base64.b64encode(buf).decode("utf-8") if ok else None