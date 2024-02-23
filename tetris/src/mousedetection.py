import pyautogui

file = open("settings.py","w")

#Detecta la posición del mouse
x,y = pyautogui.position()

#la escribe a un archivo settings.py
file.write("X = " + str(x) + "\nY = " +str(y))
