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
        
        #print( "X:{} Y: {} Pixel: {}".format(self.X, self.Y, pyscreeze.pixel(self.X , self.Y)))
        color = pyscreeze.pixel(self.X , self.Y)
        
        if color == (116, 255, 236):
            return "I"
        elif color == (236, 255, 116):
            return "S"
        elif color == (255, 118, 128):
            return "Z"
        elif color == (255, 188, 118):
            return "L"
        elif color == (154, 127, 255):
            return "J"
        elif color == (255, 128, 255):
            return "T"
        elif color == (255, 255, 117):
            return "O"
        
    def move(self):
        self.determinar_pieza()
    def compute(self):
        self.move()
        #print("computando")
    