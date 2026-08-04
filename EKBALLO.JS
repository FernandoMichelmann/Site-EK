/* =========================================================
   IMPede O NAVEGADOR DE RESTAURAR A POSIÇÃO ANTERIOR
   ========================================================= */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}


/* =========================================================
   GARANTE QUE A PÁGINA COMECE NO TOPO
   ========================================================= */

window.addEventListener("load", function () {

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });

});