import pyautogui
import pyscreeze

#36, 39, 58
class Agente:
    X :int = 0
    Y :int = 0
    self.pieza : str
    #0 si no hay nada y 1 si hay algo 
    estado_tablero = [0] * 200

    def __init__(self, X :int, Y :int ):
        self.X=X
        self.Y=Y

    def determinar_pieza(self):
        
        #print( "X:{} Y: {} Pixel: {}".format(self.X, self.Y, pyscreeze.pixel(self.X , self.Y)))
        color = pyscreeze.pixel(self.X , self.Y)
        #creo que esto sería más óptimo, pero tal vez el compilador óptimize más lo de abajo 
        #if color[0] == 255:
        #    if color[1] > 128:
        #        if color[2] == 117:
        #            return "O"
        #        return "L"
        #    elif color[2] == 255:
        #        return "T"
        #    return "Z"
        #elif color[1] == 255:
        #    if color[2] == 236:
        #        return "I"
        #    return "S"
        #return "J"
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
        else:
            return self.determinar_pieza()
        
    def move(self):
        self.pieza = self.determinar_pieza()

    def compute(self):
        self.move()
    