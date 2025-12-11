from .blur import mean_blur, gaussian_blur, median_blur
from .edges import canny, sobel

FILTERS = {
    "mean_blur": mean_blur,
    "gaussian_blur": gaussian_blur,
    "median_blur": median_blur,
    "canny": canny,
    "sobel": sobel,
}

FILTERS_REQUIRING_KERNEL = {
    "mean_blur",
    "gaussian_blur",
    "median_blur",
}