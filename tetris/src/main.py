from agente import Agente
from settings import X, Y
import pyscreeze 

agente = Agente(X,Y)
while True:
    agente.compute()