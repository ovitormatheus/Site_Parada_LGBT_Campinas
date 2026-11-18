// =========================================================
// PÁGINA "QUERO PARTICIPAR"
// 1. Formulário de cadastro (validação + mensagem de sucesso)
// 2. Máscara do telefone
// 3. Avaliação por estrelas
// 4. Formulário de feedback
//
// IMPORTANTE: este site ainda não tem servidor (back-end), então os dados
// NÃO são salvos em lugar nenhum: o código só valida e mostra a confirmação.
// Para receber os cadastros de verdade, depois dá para ligar o formulário a um
// serviço como Formspree, Google Forms ou uma API da sua faculdade/empresa.
// =========================================================

// ---------- Pegando os elementos da página ----------
const formularioCadastro = document.getElementById("formulario-cadastro");
const campoFuncao = document.getElementById("campo-funcao");
const campoNome = document.getElementById("campo-nome");
const campoTelefone = document.getElementById("campo-telefone");
const campoEmail = document.getElementById("campo-email");
const sucessoCadastro = document.getElementById("sucesso-cadastro");

const formularioFeedback = document.getElementById("formulario-feedback");
const campoComentario = document.getElementById("campo-comentario");
const estrelas = document.querySelectorAll(".feedback-estrela");
const notaEscolhida = document.getElementById("nota-escolhida");
const sucessoFeedback = document.getElementById("sucesso-feedback");
const erroFeedback = document.getElementById("erro-feedback");


// ---------- Funções de ajuda ----------
function mostrarErro(campo, idDoErro, mensagem) {
  document.getElementById(idDoErro).textContent = mensagem;
  campo.classList.add("com-erro");
}

function limparErro(campo, idDoErro) {
  document.getElementById(idDoErro).textContent = "";
  campo.classList.remove("com-erro");
}


// ---------- 2. Máscara do telefone: (19) 99999-9999 ----------
campoTelefone.addEventListener("input", function () {
  let numeros = campoTelefone.value.replace(/\D/g, "").slice(0, 11);

  if (numeros.length > 6) {
    // celular (11 dígitos) ou fixo (10 dígitos)
    const meio = numeros.length === 11 ? 7 : 6;
    numeros = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2, meio) + "-" + numeros.slice(meio);
  } else if (numeros.length > 2) {
    numeros = "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);
  } else if (numeros.length > 0) {
    numeros = "(" + numeros;
  }

  campoTelefone.value = numeros;
});


// ---------- 1. Cadastro: validar e enviar ----------
formularioCadastro.addEventListener("submit", function (evento) {
  evento.preventDefault();   // impede a página de recarregar

  let tudoCerto = true;
  sucessoCadastro.hidden = true;

  // Função
  if (campoFuncao.value === "") {
    mostrarErro(campoFuncao, "erro-funcao", "Escolha a sua função no evento.");
    tudoCerto = false;
  } else {
    limparErro(campoFuncao, "erro-funcao");
  }

  // Nome e sobrenome (precisa de pelo menos duas palavras)
  const palavrasDoNome = campoNome.value.trim().split(/\s+/);
  if (campoNome.value.trim() === "" || palavrasDoNome.length < 2) {
    mostrarErro(campoNome, "erro-nome", "Digite seu nome e sobrenome.");
    tudoCerto = false;
  } else {
    limparErro(campoNome, "erro-nome");
  }

  // Telefone (10 ou 11 números)
  const numerosDoTelefone = campoTelefone.value.replace(/\D/g, "");
  if (numerosDoTelefone.length < 10) {
    mostrarErro(campoTelefone, "erro-telefone", "Digite um telefone com DDD. Ex: (19) 99999-9999");
    tudoCerto = false;
  } else {
    limparErro(campoTelefone, "erro-telefone");
  }

  // E-mail
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoEmail.value.trim());
  if (!emailValido) {
    mostrarErro(campoEmail, "erro-email", "Digite um e-mail válido. Ex: nome@exemplo.com");
    tudoCerto = false;
  } else {
    limparErro(campoEmail, "erro-email");
  }

  // Se tudo estiver certo, mostra a confirmação e limpa o formulário
  if (tudoCerto) {
    formularioCadastro.reset();
    sucessoCadastro.hidden = false;
    sucessoCadastro.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

// Tira o aviso de erro assim que a pessoa corrige o campo
campoFuncao.addEventListener("change", function () { limparErro(campoFuncao, "erro-funcao"); });
campoNome.addEventListener("input", function () { limparErro(campoNome, "erro-nome"); });
campoTelefone.addEventListener("input", function () { limparErro(campoTelefone, "erro-telefone"); });
campoEmail.addEventListener("input", function () { limparErro(campoEmail, "erro-email"); });


// ---------- 3. Estrelas (0 a 5) ----------
const textosDaNota = ["", "1 — Muito ruim", "2 — Ruim", "3 — Regular", "4 — Bom", "5 — Ótimo"];
let notaAtual = 0;

// Acende as estrelas até o número "ate"
function pintarEstrelas(ate) {
  estrelas.forEach(function (estrela) {
    const valor = Number(estrela.dataset.valor);
    estrela.classList.toggle("acesa", valor <= ate);
  });
}

estrelas.forEach(function (estrela) {
  const valor = Number(estrela.dataset.valor);

  // passar o mouse mostra a prévia
  estrela.addEventListener("mouseenter", function () { pintarEstrelas(valor); });

  // clicar escolhe a nota (clicar de novo na mesma nota volta para 0)
  estrela.addEventListener("click", function () {
    notaAtual = (notaAtual === valor) ? 0 : valor;
    pintarEstrelas(notaAtual);
    notaEscolhida.textContent = textosDaNota[notaAtual];
  });
});

// tirar o mouse volta a mostrar a nota escolhida
document.getElementById("estrelas").addEventListener("mouseleave", function () {
  pintarEstrelas(notaAtual);
});


// ---------- 4. Feedback: enviar ----------
formularioFeedback.addEventListener("submit", function (evento) {
  evento.preventDefault();
  sucessoFeedback.hidden = true;
  erroFeedback.textContent = "";

  // Precisa ter escrito algo OU escolhido uma nota
  if (campoComentario.value.trim() === "" && notaAtual === 0) {
    erroFeedback.textContent = "Escreva um comentário ou escolha uma nota antes de enviar.";
    return;
  }

  formularioFeedback.reset();
  notaAtual = 0;
  pintarEstrelas(0);
  notaEscolhida.textContent = "";
  sucessoFeedback.hidden = false;
});
