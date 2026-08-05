
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