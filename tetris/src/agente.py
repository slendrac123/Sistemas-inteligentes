import pyautogui
import pyscreeze


# 36, 39, 58
class Agente:
    X: int = 0
    Y: int = 0
    pieza: str
    # 0 si no hay nada y 1 si hay algo
    estado_tablero = [0] * 200

    def __init__(self, X: int, Y: int):
        self.X = X
        self.Y = Y

    def determinar_pieza(self):
        # print( "X:{} Y: {} Pixel: {}"
        # .format(self.X, self.Y, pyscreeze.pixel(self.X , self.Y)))
        color = pyscreeze.pixel(self.X, self.Y)

        if color in ((116, 255, 235), (80, 240, 185)):
            return "I"
        elif color in ((237, 255, 116), (181, 240, 78)):
            return "S"
        elif color in ((255, 119, 130), (229, 72, 80)):
            return "Z"
        elif color in ((255, 189, 118), (232, 134, 74)):
            return "L"
        elif color in ((153, 127, 255), (92, 71, 190)):
            return "J"
        elif color in ((255, 128, 255), (195, 74, 182)):
            return "T"
        elif color in ((255, 255, 118), (236, 206, 76)):
            return "O"
        else:
            return self.determinar_pieza()

    def move(self):
        self.pieza = self.determinar_pieza()
        print(self.pieza)

    def compute(self):
        self.move()
