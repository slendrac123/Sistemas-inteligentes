import pyautogui
import pyscreeze

#color (30,30,30)

class Agente:
    X :int = 0
    Y :int = 0
    def __init__(self, X :int, Y :int ):
        self.X=X
        self.Y=Y
    def determinar_pieza(self):
        self.X, self.Y = pyautogui.position()
        print("X: " + str(self.X) + " Y: " +str(self.Y))
        print(pyscreeze.pixel(self.X , self.Y))
    def move(self):
        self.determinar_pieza()
    def compute(self):
        self.move()
        print("computando")