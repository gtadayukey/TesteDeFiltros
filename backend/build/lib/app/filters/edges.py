import cv2

def canny(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.Canny(gray, 100, 200)

def sobel(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, 3)
    gy = cv2.Sobel(gray, cv2.CV_64F, 0, 1, 3)
    ax = cv2.convertScaleAbs(gx)
    ay = cv2.convertScaleAbs(gy)
    return cv2.addWeighted(ax, 0.5, ay, 0.5, 0)