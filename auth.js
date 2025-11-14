// Auth0 completamente desactivado
// Esta versi�n solo contiene funciones auxiliares para la UI
// La funcionalidad de actualizaci�n de carta est� en script.js

// Funciones dummy (por si el HTML las llama)
function login() {
    console.log("[Info] Auth0 desactivado - Formulario disponible p�blicamente");
}

function logout() {
    console.log("[Info] Auth0 desactivado");
}

function mostrarApp() {
    document.getElementById("app").style.display = "block";
}

function mostrarLogin() {
    console.log("[Info] Auth0 desactivado - Mostrando app directamente");
    mostrarApp();
}

console.log("[Info] auth.js cargado (Auth0 desactivado - Modo formulario p�blico)");
