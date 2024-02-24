import pyautogui
import pyscreeze

#36, 39, 58
class Agente:
    X :int = 0
    Y :int = 0
    #0 si no hay nada y 1 si hay algo 
    estado_tablero = [0] * 200
    def __init__(self, X :int, Y :int ):
        self.X=X
        self.Y=Y
    def determinar_pieza(self):
        print( "X:{} Y: {} Pixel: {}".format(self.X, self.Y, pyscreeze.pixel(self.X , self.Y)))
    def move(self):
        self.determinar_pieza()
    def compute(self):
        self.move()
        print("computando")
    