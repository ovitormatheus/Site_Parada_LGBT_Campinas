// =========================================================
// PÁGINA "GALERIA"
// 1. Clicar em um álbum abre a "pasta" com as fotos
// 2. Clicar em uma foto abre ela grande (com setas para passar)
// 3. Teclado: Esc fecha, setas ← → trocam de foto
// =========================================================

// ---------- Pegando os elementos da página ----------
const cartoesDeAlbum = document.querySelectorAll(".album-cartao");

const pasta = document.getElementById("pasta");
const pastaTitulo = document.getElementById("pasta-titulo");
const pastaContagem = document.getElementById("pasta-contagem");
const pastaVoltar = document.getElementById("pasta-voltar");
const pastaCaixa = document.querySelector(".pasta-caixa");
const conteudosDasPastas = document.querySelectorAll(".pasta-conteudo");

const visualizador = document.getElementById("visualizador");
const visualizadorImagem = document.getElementById("visualizador-imagem");
const visualizadorLegenda = document.getElementById("visualizador-legenda");
const botaoFechar = document.getElementById("visualizador-fechar");
const botaoAnterior = document.getElementById("visualizador-anterior");
const botaoProximo = document.getElementById("visualizador-proximo");

// Guardam o que está aberto no momento
let fotosDaPastaAberta = [];   // lista de fotos da pasta escolhida
let fotoAtual = 0;             // posição da foto que está grande
let cartaoQueAbriu = null;     // para devolver o foco ao fechar


// ---------- 1. Abrir e fechar a pasta ----------
function abrirPasta(idDaPasta, cartao) {
  const conteudo = document.getElementById("pasta-" + idDaPasta);

  // Mostra só a grade da pasta escolhida e esconde as outras
  conteudosDasPastas.forEach(function (item) {
    item.hidden = (item !== conteudo);
  });

  fotosDaPastaAberta = Array.from(conteudo.querySelectorAll(".pasta-foto"));
  pastaTitulo.textContent = conteudo.dataset.titulo;
  pastaContagem.textContent = fotosDaPastaAberta.length + " fotos";

  cartaoQueAbriu = cartao;
  pasta.hidden = false;
  document.body.classList.add("sem-rolagem");
  pastaCaixa.scrollTop = 0;
  pastaVoltar.focus();
}

function fecharPasta() {
  pasta.hidden = true;
  document.body.classList.remove("sem-rolagem");
  if (cartaoQueAbriu) {
    cartaoQueAbriu.focus();
  }
}

cartoesDeAlbum.forEach(function (cartao) {
  cartao.addEventListener("click", function () {
    abrirPasta(cartao.dataset.pasta, cartao);
  });
});

pastaVoltar.addEventListener("click", fecharPasta);

// Clicar no fundo escuro (fora da caixa rosa) também fecha
pasta.addEventListener("click", function (evento) {
  if (evento.target === pasta) {
    fecharPasta();
  }
});


// ---------- 2. Foto grande (visualizador) ----------
function mostrarFoto(posicao) {
  // Dá a volta: depois da última vem a primeira, antes da primeira vem a última
  if (posicao < 0) {
    posicao = fotosDaPastaAberta.length - 1;
  }
  if (posicao >= fotosDaPastaAberta.length) {
    posicao = 0;
  }
  fotoAtual = posicao;

  // Copia o endereço da foto do botão pequeno para a imagem grande
  const endereco = fotosDaPastaAberta[fotoAtual].style.getPropertyValue("--foto");
  visualizadorImagem.style.setProperty("--foto", endereco);
  visualizadorImagem.setAttribute("aria-label", fotosDaPastaAberta[fotoAtual].getAttribute("aria-label"));

  visualizadorLegenda.textContent =
    pastaTitulo.textContent + " — foto " + (fotoAtual + 1) + " de " + fotosDaPastaAberta.length;
}

function abrirVisualizador(posicao) {
  mostrarFoto(posicao);
  visualizador.hidden = false;
  botaoFechar.focus();
}

function fecharVisualizador() {
  visualizador.hidden = true;
  fotosDaPastaAberta[fotoAtual].focus();   // devolve o foco para a miniatura
}

// Clicar em qualquer miniatura abre a foto grande
document.querySelectorAll(".pasta-foto").forEach(function (miniatura) {
  miniatura.addEventListener("click", function () {
    abrirVisualizador(fotosDaPastaAberta.indexOf(miniatura));
  });
});

botaoFechar.addEventListener("click", fecharVisualizador);
botaoAnterior.addEventListener("click", function () { mostrarFoto(fotoAtual - 1); });
botaoProximo.addEventListener("click", function () { mostrarFoto(fotoAtual + 1); });

// Clicar no fundo escuro do visualizador fecha a foto
visualizador.addEventListener("click", function (evento) {
  if (evento.target === visualizador) {
    fecharVisualizador();
  }
});


// ---------- 3. Teclado ----------
document.addEventListener("keydown", function (evento) {
  if (!visualizador.hidden) {
    // foto grande aberta
    if (evento.key === "Escape")     { fecharVisualizador(); }
    if (evento.key === "ArrowLeft")  { mostrarFoto(fotoAtual - 1); }
    if (evento.key === "ArrowRight") { mostrarFoto(fotoAtual + 1); }
  } else if (!pasta.hidden && evento.key === "Escape") {
    // só a pasta aberta
    fecharPasta();
  }
});
