class Piece:
    nombre: str
    rotation_id: list
    arr_coordenadas: list

    def __init__(self, nombre):
        self.nombre = nombre
        if (nombre == 'O'):
            self.arr_coordenadas = [
                #  00
                #  00
                [(0, 0), (0, 1), (1, 0), (1, 1)]
            ]
            self.n_rotations = [0]
            return
        if (nombre == 'I'):
            self.arr_coordenadas = [
                # 0000
                [(-1, 0), (0, 0), (1, 0), (2, 0)],
                #  0
                #  0
                #  0
                #  0
                [(0, 0), (0, 1), (0, 2), (0, 3)]
            ]
            self.n_rotations = [0, 3]
            return
        if (nombre == 'S'):
            self.arr_coordenadas = [
                #   00
                #  00
                [(-1, 0), (0, 0), (0, 1), (1, 1)],
                # 0
                # 00
                #  0
                [(-1, 1), (-1, 2), (0, 0), (0, 1)]
            ]
            self.n_rotations = [0, 3]
            return
        if (nombre == 'Z'):
            self.arr_coordenadas = [
                # 00
                #  00
                [(-1, 1), (0, 0), (0, 1), (1, 0)],
                #   0
                #  00
                #  0
                [(0, 0), (0, 1), (1, 1), (1, 2)]
            ]
            self.n_rotations = [0, 1]
            return
        if (nombre == 'L'):
            self.arr_coordenadas = [
                #   0
                # 000
                [(-1, 0), (0, 0), (1, 0), (1, 1)],
                # esta nunca se usaria
                # 000
                # 0
                [(-1, -1), (-1, 0), (0, 0), (1, 0)],
                #  0
                #  0
                #  00
                [(0, 0), (0, 1), (0, 2), (1, 0)],
                # 00
                #  0
                #  0
                [(-1, 2), (0, 0), (0, 1), (0, 2)],
            ]
            self.n_rotations = [0, 2, 1, 3]
            return
        if (nombre == 'J'):
            self.arr_coordenadas = [
                # 0
                # 000
                [(-1, 0), (-1, 1), (0, 0), (1, 0)],
                # esta nunca se usaria
                # 000
                #   0
                [(-1, 0), (0, 0), (1, -1), (1, 0)],
                #  00
                #  0
                #  0
                [(0, 0), (0, 1), (0, 2), (1, 2)],
                #  0
                #  0
                # 00
                [(-1, 0), (0, 0), (0, 1), (0, 2)],
            ]
            self.n_rotations = [0, 2, 1, 3]
            return
        if (nombre == 'T'):
            self.arr_coordenadas = [
                #  0
                # 000
                [(-1, 0), (0, 0), (0, 1), (1, 0)],
                # 000
                #  0
                [(-1, 1), (0, 0), (0, 1), (1, 1)],
                #  0
                #  00
                #  0
                [(0, 0), (0, 1), (0, 2), (1, 1)],
                #  0
                # 00
                #  0
                [(-1, 1), (0, 0), (0, 1), (0, 2)],
            ]
            self.n_rotations = [0, 2, 1, 3]
            return
