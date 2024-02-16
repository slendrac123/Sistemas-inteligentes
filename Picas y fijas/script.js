//datos
let numeroReal;
let numerosposibles = [];
let numeroComputado;
let fijas = 0;
let picas = 0;
let intento = 0;

//elementos del html
let numero = document.getElementById("numero");
let esconder = document.getElementById("escoger");
let numeroreal = document.getElementById("numeroreal");
let mostrar = document.getElementById("mostrar");
let boton = document.getElementById("computar");
let numeroadivinado = document.getElementById("numeroadivinado");
let estadojuego = document.getElementById("estadojuego");
let gameover = document.getElementById("juegoterminado");
let intentos = document.getElementById("intentos");
let loginForm = document.getElementById("numberForm");

//hice una manera diferente de calcular esto en remover posibles
function calcularPicas(numeroReal, numeroComputado) {
  picas = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i == j) {
        continue;
      }
      if (numeroReal[i] == numeroComputado[j]) {
        picas++;
      }
    }
  }
}

function calcularFijas(numeroReal, numeroComputado) {
  fijas = 0;
  for (let i = 0; i < 4; i++) {
    if (numeroReal[i] == numeroComputado[i]) {
      fijas++;
    }
  }
}

function llenarPosibles() {
  //todos los numeros posibles en un array
  for (let i = 0; i <= 9; i++) {
    for (let j = 0; j <= 9; j++) {
      if (i == j) {
        continue;
      }
      for (let k = 0; k <= 9; k++) {
        if (i == k || k == j) {
          continue;
        }
        for (let l = 0; l <= 9; l++) {
          if (i == l || l == j || l == k) {
            continue;
          }
          numerosposibles.push(`${i}${j}${k}${l}`);
        }
      }
    }
  }
}

function removerPosibles() {
  //al revés para que no hayan problemas al borrar elementos en la iteración
  for (let n = numerosposibles.length - 1; n >= 0; n--) {
    let fijaslocales = 0;
    let picaslocales = 0;
    for (i = 0; i < 4; i++) {
      //calcula fijas
      if (numerosposibles[n][i] == numeroComputado[i]) {
        fijaslocales++;
        //calcula picas
      } else if (numerosposibles[n].includes(numeroComputado[i])) {
        picaslocales++;
      }
    }
    if (picaslocales != picas || fijaslocales != fijas) {
      try {
        //eliminar los que no tengan el mismo número de picas y fijas
        numerosposibles.splice(n, 1);
      } catch {
        console.log("trampa detectada");
      }
    }
  }
}
//lo que hace al oprimir el boton de ingresar número
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //desaparece lo anterior
  esconder.style.display = "none";
  //el valor ingresado
  numeroReal = numero.value;
  //inicializa el array
  llenarPosibles();
  computar();
  //llena de texto
  numeroreal.textContent = `Número escogido: ${numeroReal}`;
  //aparece lo nuevo
  mostrar.style.display = "block";
  boton.style.display = "block";
});

function computar() {
  //numero aleatorio
  numeroComputado =
    numerosposibles[Math.floor(Math.random() * numerosposibles.length)];
  calcularFijas(numeroReal, numeroComputado);
  calcularPicas(numeroReal, numeroComputado);
  removerPosibles();
  //llena el texto de la UI
  numeroadivinado.textContent = `El número es ${numeroComputado}?, intento: ${++intento}`;
  estadojuego.textContent = `Picas: ${picas}; Fijas: ${fijas}`;
  //juego terminado
  if (fijas == "4") {
    //esconde lo anterior
    mostrar.style.display = "none";
    boton.style.display = "none";
    //añade lo nuevo
    gameover.style.display = "block";
    intentos.textContent = `El número es ${numeroComputado}, intentos realizados: ${intento}`;
    intentos.style.display = "block";
  }
}
