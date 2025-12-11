import cv2

def mean_blur(img, k):
    return cv2.blur(img, (k, k))

def gaussian_blur(img, k):
    return cv2.GaussianBlur(img, (k, k), 0)

def median_blur(img, k):
    return cv2.medianBlur(img, k)