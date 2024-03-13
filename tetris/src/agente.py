import pyautogui
from piece import Piece
import pyscreeze
from heap import MinHeap


class Agente:
    X: int = 0
    Y: int = 0
    pieza: Piece
    # 0 si no hay nada y 1 si hay algo
    heap: MinHeap
    estado_tablero: list

    def __init__(self, X: int, Y: int):
        self.X = X
        self.Y = Y
        # iniciar el heap en 0 junto con el índice horizontal
        self.heap = MinHeap(10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        self.estado_tablero = [0] * 10
        # revisa que la altura sea la correcta para no dejar huecos

    def is_move_possible(self, altitud):
        idx = 0
        # las coordenadas estan en formato de array[array[tuplas]]
        for x in self.pieza.arr_coordenadas:
            terminado = True
            coord = []
            # print("x : "+str(x))
            for i in x:
                # si deja huecos marca como falso y deja de mirar ahí
                # altitud [0] es la relativa de donde pondrá la pieza,
                # altitud[1] es el índice horizontal
                # i[0] es lo que ocupa la pieza en horizontal
                # i[1] es lo que ocupa en vertical
                try:
                    if i[0] in coord:
                        coord[1] += 1
                        continue
                    coord.append([i[0], 1])
                    # print("i: "+str(i))
                    # print("alt: " + str(altitud[0] + i[1]) +
                    #       " index: " + str(altitud[1] + i[0]))
                    # print("altura necesaria: "+str(altitud[0] + i[1]))
                    # print("altura real: " +
                    #       str(self.estado_tablero[altitud[1] + i[0]]))
                    if (altitud[1]+i[0] < 0):
                        raise IndexError
                    if (altitud[0] + i[1] != self.estado_tablero[altitud[1]+i[0]]):
                        terminado = False
                        break
                    # añade las coordenadas

                except IndexError:
                    # print("error")
                    terminado = False
                    break
                # except:
                #    break
            if terminado:
                # cuenta las coordenadas y frecuencia
                for k, j in coord:
                    # actualiza el tablero y el heap
                    # print ("k: "+ str(k) +" c: "+ str(c[k]))
                    # print("indice 1+k: " + str(altitud[1]+k))
                    self.estado_tablero[altitud[1]+k] += j
                    self.heap.changePriority(self.heap.getIndex(altitud[1]+k), self.estado_tablero[altitud[1]+k])
                # por cosas de la rotación hay un index que anota cuantos giros
                # a su vez prioriza los estados horizontales
                # hace las rotaciones
                print(self.estado_tablero)
                pyautogui.press('up', self.pieza.n_rotations[idx])
                return True
            # lleva la cuenta de las rotaciones
            idx += 1
        return False

    def determinar_move(self):
        move = False
        # para recorrer el heap
        index = 0
        buff = 0
        while not move:
            # buff es el índice a donde se movería la pieza
            buff = self.heap.heap[index]
            # print(buff)
            move = self.is_move_possible(buff)
            #print(move)
            if (index < 9):
                index += 1
            else:
                # si no encuentra movimiento posible guarda la pieza
                pyautogui.press(['c'])
                return
        # envia la pieza a donde la quiere ubicar
        # todas las piezas las tomo como si estuvieran en el punto 4 horizontal
        print("Aquí empieza el movement")
        horizontal_mv = 4-buff[1]
        if horizontal_mv > 0:
            pyautogui.press('left', presses=horizontal_mv)
        else:
            pyautogui.press('right', presses=(-1*horizontal_mv))
        # la baja rápido
        pyautogui.press('space')

    def determinar_pieza(self):
        # print( "X:{} Y: {} Pixel: {}"
        # .format(self.X, self.Y, pyscreeze.pixel(self.X , self.Y)))
        color = pyscreeze.pixel(self.X, self.Y)

        if color in ((116, 255, 235), (80, 240, 185), (76,253,192)):
            if pyscreeze.pixel(720, 337) in ((48, 48, 48), (49,49,49), (51,51,51), (37,37,37)):
                return Piece('I')
            pyautogui.press('c')
            return self.determinar_pieza()

        elif color in ((237, 255, 116), (181, 240, 78), (188,252,75)):
            return Piece('S')
        elif color in ((255, 119, 130), (229, 72, 80), (247,71,80)):
            return Piece('Z')
        elif color in ((255, 189, 118), (232, 134, 74), (247,140,72)):
            return Piece('L')
        elif color in ((153, 127, 255), (92, 71, 190), (103,79,217)):
            return Piece('J')
        elif color in ((255, 128, 255), (195, 74, 182), (219,80,205)):
            return Piece('T')
        elif color in ((255, 255, 118), (236, 206, 76), (250,220,74)):
            return Piece('O')
        else:
            print("nuevo color: " + str(color))
            return self.determinar_pieza()

    def move(self):
        self.pieza = self.determinar_pieza()
        print(self.pieza.nombre)
        self.determinar_move()

    def compute(self):
        self.move()
