import cv2
import numpy as np
from PIL import Image
import os
from typing import Optional, Tuple
from pathlib import Path


class HandwritingPreprocessor:
    def __init__(
        self,
        target_max_dim: int = 1024,
        enhance_contrast: bool = True,
        denoise: bool = True,
        sharpen: bool = True,
        binarize: bool = False,
    ):
        self.target_max_dim = target_max_dim
        self.enhance_contrast = enhance_contrast
        self.denoise = denoise
        self.sharpen = sharpen
        self.binarize = binarize

    def load_image(self, image_path: str) -> np.ndarray:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not load image: {image_path}")
        return img

    def save_image(self, img: np.ndarray, output_path: str):
        cv2.imwrite(output_path, img)

    def resize_if_needed(self, img: np.ndarray) -> np.ndarray:
        h, w = img.shape[:2]
        max_dim = max(h, w)
        if max_dim <= self.target_max_dim:
            return img
        scale = self.target_max_dim / max_dim
        new_w, new_h = int(w * scale), int(h * scale)
        return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    def enhance_contrast_clahe(self, img: np.ndarray) -> np.ndarray:
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        lab = cv2.merge([l, a, b])
        return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    def denoise_image(self, img: np.ndarray) -> np.ndarray:
        return cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)

    def sharpen_image(self, img: np.ndarray) -> np.ndarray:
        kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        return cv2.filter2D(img, -1, kernel)

    def binarize_image(self, img: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return cv2.cvtColor(binary, cv2.COLOR_GRAY2BGR)

    def deskew(self, img: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        coords = np.column_stack(np.where(gray > 0))
        if len(coords) < 100:
            return img
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = 90 + angle
        if abs(angle) > 0.5:
            h, w = img.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            img = cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return img

    def remove_shadows(self, img: np.ndarray) -> np.ndarray:
        rgb_planes = cv2.split(img)
        result_planes = []
        for plane in rgb_planes:
            dilated = cv2.dilate(plane, np.ones((7, 7), np.uint8))
            bg = cv2.medianBlur(dilated, 21)
            diff = 255 - cv2.absdiff(plane, bg)
            norm = cv2.normalize(diff, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
            result_planes.append(norm)
        return cv2.merge(result_planes)

    def preprocess(self, image_path: str, output_path: Optional[str] = None) -> np.ndarray:
        img = self.load_image(image_path)
        img = self.resize_if_needed(img)

        if self.enhance_contrast:
            img = self.enhance_contrast_clahe(img)

        if self.denoise:
            img = self.denoise_image(img)

        if self.sharpen:
            img = self.sharpen_image(img)

        if self.binarize:
            img = self.binarize_image(img)

        img = self.remove_shadows(img)
        img = self.deskew(img)

        if output_path:
            self.save_image(img, output_path)

        return img

    def preprocess_pil(self, image_path: str, output_path: Optional[str] = None) -> Image.Image:
        processed = self.preprocess(image_path, output_path)
        rgb = cv2.cvtColor(processed, cv2.COLOR_BGR2RGB)
        return Image.fromarray(rgb)


def preprocess_handwriting(
    image_path: str,
    output_dir: str = "images/preprocessed",
    **kwargs,
) -> str:
    os.makedirs(output_dir, exist_ok=True)
    preprocessor = HandwritingPreprocessor(**kwargs)
    filename = Path(image_path).stem
    output_path = os.path.join(output_dir, f"{filename}_preprocessed.jpg")
    preprocessor.preprocess(image_path, output_path)
    return output_path