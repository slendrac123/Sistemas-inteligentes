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
        self.altura_tablero = [0] * 10
        self.estado_tablero = [[0]*10] * 20
        # revisa que la altura sea la correcta para no dejar huecos

    def is_move_possible(self, altitud):
        idx = 0

        # las coordenadas estan en formato de array[array[tuplas]]
        for x in self.pieza.arr_coordenadas:
            terminado = True
            coord = {}
            # print("x : "+str(x))
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
                    # print("i: "+str(i))
                    # print("alt: " + str(altitud[0] + i[1]) +
                    #       " index: " + str(altitud[1] + i[0]))
                    # print("altura necesaria: "+str(altitud[0] + i[1]))
                    # print("altura real: " +
                    #       str(self.estado_tablero[altitud[1] + i[0]]))
                    if (altitud[1] + i[0] < 0):
                        raise IndexError
                    if (altitud[0] + i[1]
                            != self.altura_tablero[altitud[1] + i[0]]):
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
                for i in x:
                    self.estado_tablero[altitud[1]+i[0]][altitud[0]+i[1]] = 1
                for k in coord.keys():
                    # actualiza el tablero y el heap
                    # print ("k: "+ str(k) +" c: "+ str(c[k]))
                    # print("indice 1+k: " + str(altitud[1]+k))
                    self.altura_tablero[altitud[1] + k] += coord[k]
                    self.heap.changePriority(
                        self.heap.getIndex(altitud[1] + k),
                        self.altura_tablero[altitud[1] + k])
                # check por si hay que disminuir las alturas
                for i in self.estado_tablero:
                    if 0 in i:
                        continue
                    self.estado_tablero.remove(i)
                    self.estado_tablero.append([0] * 10)
                    for j in self.heap.heap:
                        j[0] -= 1
                # por cosas de la rotación hay un index que anota cuantos giros
                # a su vez prioriza los estados horizontales
                # hace las rotaciones
                print(self.estado_tablero)
                pyautogui.press('up', self.pieza.n_rotations[idx])
                return True
            # lleva la cuenta de las rotaciones
            idx += 1
        return False

    def ultima_baza(self, altitud):
        print("Ultima Baza!!")
        coord = {}
        for i in self.pieza.arr_coordenadas[-1]:
            if i[0] in coord.keys():
                coord[i[0]] += 1
                continue
            coord.update({i[0]: 1})
        for k in coord.keys():
            # actualiza el tablero y el heap
            # print ("k: "+ str(k) +" c: "+ str(c[k]))
            # print("indice 1+k: " + str(altitud[1]+k))
            self.estado_tablero[altitud[1] + k] = coord[k]
            self.heap.changePriority(self.heap.getIndex(altitud[1] + k),
                                     self.estado_tablero[altitud[1] + k])
        # por cosas de la rotación hay un index que anota cuantos giros
        # a su vez prioriza los estados horizontales
        # hace las rotaciones
        print(self.estado_tablero)
        pyautogui.press('up', self.pieza.n_rotations[-1])
        return True

    def determinar_move(self):
        move = False
        # para recorrer el heap
        index = 0
        buff = []
        while not move:
            # buff es el índice a donde se movería la pieza
            buff = self.heap.heap[index]
            # print(buff)
            move = self.is_move_possible(buff)
            if (index < 9):
                index += 1
            else:
                # si no encuentra movimiento posible guarda la pieza
                (x, y, z) = pyscreeze.pixel(720, 337)
                print("pixel 720, 337" + str(pyscreeze.pixel(731, 298)))
                (x, y, z) = pyscreeze.pixel(720, 337)
                if (x in range(11, 52) and y in range(10, 52) and
                        z in range(10, 52)):
                    self.ultima_baza(self.heap.heap[0])
                else:
                    pyautogui.press(['c'])
                    return
        # envia la pieza a donde la quiere ubicar
        # todas las piezas las tomo como si estuvieran en el punto 4 horizontal
        horizontal_mv = 4 - buff[1]
        if horizontal_mv > 0:
            pyautogui.press('left', presses=horizontal_mv)
        else:
            pyautogui.press('right', presses=(-1 * horizontal_mv))
        # la baja rápido
        pyautogui.press('space')

    def determinar_pieza(self):
        # print( "X:{} Y: {} Pixel: {}"
        # .format(self.X, self.Y, pyscreeze.pixel(self.X , self.Y)))
        (r, g, b) = pyscreeze.pixel(self.X, self.Y)
        if (r in range(76, 117) and g in range(240, 256) and
                b in range(185, 236)):
            print("pixel 720, 337" + str(pyscreeze.pixel(720, 337)))
            (x, y, z) = pyscreeze.pixel(720, 337)
            if (x in range(8, 51) and y in range(8, 51) and
                    z in range(8, 51)):
                return Piece('I')
            pyautogui.press('c')
            return self.determinar_pieza()

        elif (r in range(181, 238) and g in range(240, 256) and
                b in range(75, 117)):
            return Piece('S')
        elif (r in range(229, 256) and g in range(71, 256) and
                b in range(80, 131)):
            return Piece('Z')
        elif (r in range(232, 256) and g in range(134, 190) and
                b in range(72, 119)):
            return Piece('L')
        elif (r in range(92, 154) and g in range(71, 128) and
                b in range(190, 256)):
            return Piece('J')
        elif (r in range(195, 256) and g in range(74, 129) and
                b in range(182, 256)):
            return Piece('T')
        elif (r in range(236, 256) and g in range(206, 256) and
                b in range(74, 119)):
            return Piece('O')
        else:
            # print("nuevo color: " + str(color))
            return self.determinar_pieza()

    def move(self):
        self.pieza = self.determinar_pieza()
        print(self.pieza.nombre)
        self.determinar_move()

    def compute(self):
        self.move()
