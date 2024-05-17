import pyautogui
from piece import Piece
import pyscreeze
from heap import MinHeap
import copy
from settings import X, Y, W, Z


class Agente:
    pieza: Piece
    # 0 si no hay nada y 1 si hay algo
    heap: MinHeap
    estado_tablero: list

    def __init__(self):
        # iniciar el heap en 0 junto con el índice horizontal
        self.heap = MinHeap(10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        self.altura_tablero = [0] * 10
        self.estado_tablero = [([0]*10) for i in range(25)]
        # revisa que la altura sea la correcta para no dejar huecos

    def eliminar_lineas(self):
        i = 0
        while i < 20:
            if 0 in self.estado_tablero[i]:
                i += 1
                continue
            for j in range(10):
                self.altura_tablero[j] -= 1
                self.heap.heap[j][0] -= 1
                if (self.altura_tablero[j] != i):
                    continue
                a = 1
                while (i-a >= 0 and self.estado_tablero[i-a][j] == 0):
                    a += 1
                    # print("CAMBIANDO PRIORIDADES "
                    # +str(i-a) +": " +str(self.altura_tablero[j]))
                    self.altura_tablero[j] -= 1
                    self.heap.changePriority(self.heap.getIndex(j),
                                             self.altura_tablero[j])

            del self.estado_tablero[i]
            self.estado_tablero.append([0] * 10)

    def is_move_possible(self, altitud):
        idx = 0

        # las coordenadas estan en formato de array[array[tuplas]]
        for x in self.pieza.arr_coordenadas:
            terminado = True
            coord = {}
            for i in x:
                # si deja huecos marca como falso y deja de mirar ahí
                # altitud [0] es la relativa de donde pondrá la pieza,
                # altitud[1] es el índice horizontal
                # i[0] es lo que ocupa la pieza en horizontal
                # i[1] es lo que ocupa en vertical
                try:
                    if i[0] in coord.keys():
                        coord[i[0]] += 1
                        continue
                    coord.update({i[0]: 1})
                    if (altitud[1] + i[0] < 0):
                        raise IndexError
                    if (altitud[0] + i[1] < 0):
                        raise IndexError
                    if (altitud[0] + i[1]
                            != self.altura_tablero[altitud[1] + i[0]]):
                        terminado = False
                        break
                    # añade las coordenadas

                except IndexError:
                    terminado = False
                    break
                # except:
                #    break
            if terminado:
                # cuenta las coordenadas y frecuencia
                for i in x:
                    self.estado_tablero[altitud[0]+i[1]][altitud[1]+i[0]] = 1
                for k in coord.keys():
                    # actualiza el tablero y el heap
                    self.altura_tablero[altitud[1] + k] += coord[k]
                    self.heap.changePriority(
                        self.heap.getIndex(altitud[1] + k),
                        self.altura_tablero[altitud[1] + k])
                # check por si hay que disminuir las alturas
                # por cosas de la rotación hay un index que anota cuantos giros
                # a su vez prioriza los estados horizontales
                # hace las rotaciones

                self.eliminar_lineas()
                # for i in range (20):
                #    print(self.estado_tablero[19-i])
                # print("alturas: " + str(self.altura_tablero))
                # print("cola prioridad: ")
                # self.heap.display()
                pyautogui.press(
                    'up', self.pieza.n_rotations[idx])  # , interval=0.1)
                return True
            # lleva la cuenta de las rotaciones
            idx += 1
        return False

    def ultima_baza(self, altitud):
        idx = 0
        for x in self.pieza.arr_coordenadas:
            messirve = True
            coord = {}
            for i in x:
                # debe tomar las alturas para saber desde done la va a poner
                if i[0] in coord.keys():
                    coord[i[0]] += 1
                    continue
                coord.update({i[0]: altitud[1]+1})
                if (altitud[1] + i[0] < 0):
                    messirve = False
                    break
                if (altitud[0] + i[1] < 0):
                    messirve = False
                    break
                coord.update({i[0]: altitud[1] + i[1]})
                try:
                    if (self.estado_tablero[altitud[0]+i[1]][altitud[1]+i[0]]
                            == 1):
                        messirve = False
                        break
                except (IndexError):
                    messirve = False
                    break
            if not messirve:
                idx += 1
                continue
            for i in x:
                self.estado_tablero[altitud[1]+i[0]][altitud[0]+i[1]] = 1
            for k in coord.keys():
                # actualiza el tablero y el heap
                # print ("k: "+ str(k) +" c: "+ str(c[k]))
                # print("indice 1+k: " + str(altitud[1]+k))
                self.altura_tablero[altitud[1] + k] = coord[k] + 1
                self.heap.changePriority(self.heap.getIndex(altitud[1] + k),
                                         self.altura_tablero[altitud[1] + k])
            self.eliminar_lineas()
            pyautogui.press('up', self.pieza.n_rotations[idx])
            # pyautogui.press('up', self.pieza.n_rotations[0])
            return True
        return False

    def determinar_move(self):
        move = False
        # para recorrer el heap
        index = 0
        heap_copy = copy.deepcopy(self.heap)
        while not move:
            # buff es el índice a donde se movería la pieza

            buff = heap_copy.extractMin()
            # print(buff)
            move = self.is_move_possible(buff)
            if (index < 9):
                index += 1
            else:
                # si no encuentra movimiento posible guarda la pieza
                # Camilo: 709, 370
                (x, y, z) = pyscreeze.pixel(W, Z)  # 720, 337)
                # print("pixel w, z: " + str(pyscreeze.pixel(W, Z)))
                if (x in range(10, 50) and y in range(10, 50) and
                        z in range(10, 50)):
                    heap_copy2 = copy.deepcopy(self.heap)
                    for i in range(10):
                        buff = heap_copy2.extractMin()
                        # print(buff)
                        if self.ultima_baza(buff):
                            break
                    break
                else:
                    return pyautogui.press('c')
        # envia la pieza a donde la quiere ubicar
        # todas las piezas las tomo como si estuvieran en el punto 4 horizontal
        horizontal_mv = 4 - buff[1]
        if horizontal_mv > 0:
            pyautogui.press('left', presses=horizontal_mv)  # , interval=0.1)

        else:
            pyautogui.press(
                'right', presses=(-1 * horizontal_mv))  # , interval=0.1)

        # la baja rápido
        return pyautogui.press('space')

    def determinar_pieza(self):
        color = pyscreeze.pixel(X, Y)

        if color in ((116, 255, 235), (80, 240, 185), (0, 255, 182)):
            # print("pixel W, Z: " + str(pyscreeze.pixel(W, Z)))
            # (x, y, z) = pyscreeze.pixel(W, Z)
            # if (x in range(10, 50) and y in range(10, 50) and
            #        z in range(10, 50)):
            return Piece('I')
            # pyautogui.press('c')
            # return self.determinar_pieza()

        elif color in ((237, 255, 116), (181, 240, 78), (140, 255, 79)):
            return Piece('S')
        elif color in ((255, 119, 130), (229, 72, 80), (255, 0, 73)):
            return Piece('Z')
        elif color in ((255, 189, 118), (232, 134, 74), (255, 125, 67)):
            return Piece('L')
        elif color in ((153, 127, 255), (92, 71, 190), (129, 0, 220)):
            return Piece('J')
        elif color in ((255, 128, 255), (195, 74, 182), (250, 0, 204)):
            return Piece('T')
        elif color in ((255, 255, 118), (236, 206, 76), (247, 231, 75)):
            return Piece('O')
        else:
            # print("nuevo color: " + str(color))
            # file = open("colores.txt", "r+")
            # content = file.read()
            # if (str(color)+'\n') not in content:
            # file.write(str(color)+'\n')
            # file.close()
            return self.determinar_pieza()

    def compute(self):
        self.pieza = self.determinar_pieza()
        print(self.pieza.nombre)
        self.determinar_move()
