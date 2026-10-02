// Contador regressivo até a Parada (27 de junho de 2027, às 00:00)
const dataDaParada = new Date("2027-06-27T00:00:00-03:00");

const campoDias = document.getElementById("contador-dias");
const campoHoras = document.getElementById("contador-horas");
const campoMinutos = document.getElementById("contador-minutos");
const campoSegundos = document.getElementById("contador-segundos");

function doisDigitos(numero) {
  return String(numero).padStart(2, "0");
}

function atualizarContador() {
  const diferenca = dataDaParada - new Date();

  // Se a data já passou, zera tudo
  if (diferenca <= 0) {
    campoDias.textContent = "00";
    campoHoras.textContent = "00";
    campoMinutos.textContent = "00";
    campoSegundos.textContent = "00";
    return;
  }

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
  const segundos = Math.floor((diferenca / 1000) % 60);

  campoDias.textContent = doisDigitos(dias);
  campoHoras.textContent = doisDigitos(horas);
  campoMinutos.textContent = doisDigitos(minutos);
  campoSegundos.textContent = doisDigitos(segundos);
}

atualizarContador();
setInterval(atualizarContador, 1000);
