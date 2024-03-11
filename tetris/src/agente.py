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
        # iniciar el heap en 0 junto con el índice horizontal
        self.heap = MinHeap(10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

        # revisa que la altura sea la correcta para no dejar huecos
    def is_move_possible(self, altitud, index):
        print("deberia hacer algo pero no se como xd")
        idx = 0
        # las coordenadas estan en formato de array[array[tuplas]]
        for x in self.pieza.arr_coordenadas:
            terminado = True
            coord = []
            for i in x:
                # si deja huecos marca como falso y deja de mirar ahí
                # altitud [0] es la relativa de donde pondrá la pieza,
                # altitud[1] es el índice horizontal
                # i[0] es lo que ocupa la pieza en horizontal
                # i[1] es lo que ocupa en vertical
                if altitud[0] + i[1] != self.estado_tablero[altitud[1]+i[0]]:
                    terminado = False
                    break
                # añade las coordenadas
                coord.append(i[0])
            if terminado:
                # cuenta las coordenadas
                c = Counter(coord)
                for k in c.keys():
                    # actualiza el tablero y el heap
                    self.estado_tablero[altitud[1]+k] += c[k]
                    self.heap.changePriority(self.heap.getIndex(
                        altitud[1]+k), self.estado_tablero[altitud[1]+k])
                # por cosas de la rotación hay un index que anota cuantos giros
                # a su vez prioriza los estados horizontales
                for n in range(self.pieza.n_rotations[idx]):
                    # hace las rotaciones
                    pyautogui.press(['up'])
                return True
            # leva la cuenta de las rotaciones
            idx += 1
        return False

    def determinar_move(self):
        move = False
        # para recorrer el heap
        index = 0
        buff = 0
        # todas las piezas las tomo como si estuvieran en el punto 4 horizontal
        horizontal_mv = 4
        while not move:
            # buff es el índice a donde se movería la pieza
            buff = self.heap.heap[index]
            move = self.is_move_possible(min, index)
            if (index < 9):
                index += 1
            else:
                # si no encuentra movimiento posible guarda la pieza
                pyautogui.press(['c'])
                return
        # envia la pieza a donde la quiere ubicar
        while (horizontal_mv != buff[1]):
            if (horizontal_mv > buff[1]):
                pyautogui.press(['left'])
                horizontal_mv -= 1
            else:
                pyautogui.press(['right'])
                horizontal_mv += 1
        # la baja rápido
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

    def compute(self):
        self.move()
