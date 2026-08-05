// ABRIR PAGINA SEMPRE NO TOPO

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });

});


// BOTAO TEMA

const botaoTema = document.getElementById("botao-tema");

const temaAtual = localStorage.getItem("tema");

if (temaAtual === "claro") {
    document.body.classList.add("tema-claro");
    botaoTema.textContent = "🌙";
} else {
    botaoTema.textContent = "☀️";
}


botaoTema.addEventListener("click", () => {

    document.body.classList.toggle("tema-claro");

    const temaClaro = document.body.classList.contains("tema-claro");

    if (temaClaro) {

        localStorage.setItem("tema", "claro");
        botaoTema.textContent = "🌙";

    } else {

        localStorage.setItem("tema", "escuro");
        botaoTema.textContent = "☀️";

    }

});