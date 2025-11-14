let auth0Client = null;

// Configuración de Auth0
const AUTH0_CONFIG = {
    domain: "dev-pjzj6vk78rt6brrh.us.auth0.com",
    client_id: "zjWCYwyGS2c5aXg7VNZxQp8AIb8hhOFo",
    redirect_uri: window.location.origin
};

// Detectar ambiente dinámicamente
const getRedirectUri = () => {
    return window.location.origin;
};

async function initAuth0() {
    try {
        // Esperar a que createAuth0Client esté disponible
        if (typeof window.auth0 === 'undefined' || typeof window.auth0.createAuth0Client === 'undefined') {
            throw new Error("SDK de Auth0 no disponible");
        }

        const config = {
            domain: AUTH0_CONFIG.domain,
            client_id: AUTH0_CONFIG.client_id,
            cacheLocation: "localstorage"
        };

        console.log("[Auth0] Inicializando con:", { domain: config.domain });

        auth0Client = await window.auth0.createAuth0Client(config);

        // Manejo del redirect después de login
        if (location.search.includes("code=") && location.search.includes("state=")) {
            console.log("[Auth0] Procesando callback de Auth0...");
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
        }

        const isLoggedIn = await auth0Client.isAuthenticated();
        console.log("[Auth0] Usuario autenticado:", isLoggedIn);

        if (isLoggedIn) {
            mostrarApp();
        } else {
            mostrarLogin();
        }
    } catch (error) {
        console.error("[Auth0] Error durante la inicialización:", error);
        mostrarLogin();
    }
}

function mostrarApp() {
    document.getElementById("loginView").style.display = "none";
    document.getElementById("app").style.display = "block";
}

function mostrarLogin() {
    document.getElementById("loginView").style.display = "block";
    document.getElementById("app").style.display = "none";
}

async function login() {
    if (!auth0Client) {
        console.error("[Auth0] Cliente no inicializado");
        alert("Error: Auth0 no está listo. Recarga la página.");
        return;
    }

    try {
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: getRedirectUri()
            }
        });
    } catch (error) {
        console.error("[Auth0] Error en login:", error);
        alert("Error al iniciar sesión: " + error.message);
    }
}

async function logout() {
    if (!auth0Client) {
        console.error("[Auth0] Cliente no inicializado");
        return;
    }

    try {
        await auth0Client.logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    } catch (error) {
        console.error("[Auth0] Error en logout:", error);
    }
}

// Cargar el SDK de Auth0 dinámicamente antes de inicializar
function loadAuth0SDK() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdn.auth0.com/js/auth0-spa-js/2.5/auth0-spa-js.production.js";
        script.async = true;
        script.onload = () => {
            console.log("[Auth0] SDK cargado exitosamente");
            resolve();
        };
        script.onerror = () => {
            console.error("[Auth0] Error al cargar el SDK");
            reject(new Error("No se pudo cargar el SDK de Auth0"));
        };
        document.head.appendChild(script);
    });
}

// Esperar a que el DOM esté listo y cargar SDK
async function initializeAuth() {
    try {
        await loadAuth0SDK();
        // Dar un pequeño delay para asegurar que window.auth0 esté disponible
        await new Promise(resolve => setTimeout(resolve, 500));
        await initAuth0();
    } catch (error) {
        console.error("[Auth0] Error durante la inicialización:", error);
        mostrarLogin();
    }
}

// Ejecutar cuando DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}
