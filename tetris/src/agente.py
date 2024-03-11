import pyautogui
from piece import Piece
import pyscreeze
from heap import MinHeap
from collections import Counter


class Agente:
    X: int = 0
    Y: int = 0
    pieza: Piece
    # 0 si no hay nada y 1 si hay algo
    heap: MinHeap
    estado_tablero: [0] * 10

    def __init__(self, X: int, Y: int):
        self.X = X
        self.Y = Y
        self.heap = MinHeap(10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

        # revisa que la altura sea la correcta para no dejar huecos
    def is_move_possible(self, altitud, index):
        print("deberia hacer algo pero no se como xd")
        idx = 0
        for x in self.pieza.arr_coordenadas:
            terminado = True
            x = []
            for i in x:
                if altitud[0] + i[1] != self.estado_tablero[altitud[1]+i[0]]:
                    terminado = False
                    break
                x.append(i[0])
            if terminado:
                c = Counter(x)
                for k in c.keys():
                    self.estado_tablero[altitud[1]+k] += c[k]
                    self.heap.changePriority(self.heap.getIndex(
                        altitud[1]+k), self.estado_tablero[altitud[1]+k])
                for n in range(self.pieza.n_rotations[idx]):
                    pyautogui.press(['up'])
                return True
            idx += 1
        return False

    def determinar_move(self):
        move = False
        index = 0
        while not move:
            min = self.heap.heap[index]
            move = self.is_move_possible(min, index)
            if (index < 9):
                index += 1
        pyautogui.press(['space'])

    def determinar_pieza(self):
        # print( "X:{} Y: {} Pixel: {}"
        # .format(self.X, self.Y, pyscreeze.pixel(self.X , self.Y)))
        color = pyscreeze.pixel(self.X, self.Y)

        if color in ((116, 255, 235), (80, 240, 185)):
            self.pieza = Piece('I')
        elif color in ((237, 255, 116), (181, 240, 78)):
            self.pieza = Piece('S')
        elif color in ((255, 119, 130), (229, 72, 80)):
            self.pieza = Piece('Z')
        elif color in ((255, 189, 118), (232, 134, 74)):
            self.pieza = Piece('L')
        elif color in ((153, 127, 255), (92, 71, 190)):
            self.pieza = Piece('J')
        elif color in ((255, 128, 255), (195, 74, 182)):
            self.pieza = Piece('T')
        elif color in ((255, 255, 118), (236, 206, 76)):
            self.pieza = Piece('O')
        else:
            return self.determinar_pieza()

    def move(self):
        self.pieza = self.determinar_pieza()
        print(self.pieza)
        pyautogui.press(['left'])

    def compute(self):
        self.move()
