let auth0Client = null;

// Configuración de Auth0
const AUTH0_CONFIG = {
    domain: "dev-pjzj6vk78rt6brrh.us.auth0.com",
    client_id: "IOCwAan7H4Pzb0nEteh8MKCZNF87PqS2",
    redirect_uri: window.location.origin
};

// Detectar ambiente dinámicamente
const getRedirectUri = () => {
    return window.location.origin;
};

async function initAuth0() {
    try {
        // Detectar la función createAuth0Client en varias formas
        const createClientFn = (typeof createAuth0Client !== 'undefined')
            ? createAuth0Client
            : (window.createAuth0Client)
                ? window.createAuth0Client
                : (window.auth0 && window.auth0.createAuth0Client)
                    ? window.auth0.createAuth0Client
                    : null;

        if (!createClientFn) {
            throw new Error("SDK de Auth0 no disponible (createAuth0Client no encontrado)");
        }

        console.log("[Auth0] createAuth0Client detectado:", createClientFn);
        console.log("[Auth0] Configuración a usar:", AUTH0_CONFIG);

        const config = {
            domain: AUTH0_CONFIG.domain,
            client_id: AUTH0_CONFIG.client_id,
            cacheLocation: "localstorage"
        };

        console.log("[Auth0] Inicializando con:", { domain: config.domain, client_id: config.client_id });

        auth0Client = await createClientFn(config);
        console.log("[Auth0] Cliente Auth0 inicializado correctamente");

        // Manejo del redirect después de login
        if (location.search.includes("code=") && location.search.includes("state=")) {
            console.log("[Auth0] Procesando callback de Auth0...");
            console.log("[Auth0] URL actual:", window.location.href);
            console.log("[Auth0] Parámetros detectados:", {
                code: new URLSearchParams(location.search).get('code'),
                state: new URLSearchParams(location.search).get('state')
            });
            try {
                const result = await auth0Client.handleRedirectCallback();
                console.log("[Auth0] handleRedirectCallback completado:", result);
            } catch (callbackError) {
                console.error("[Auth0] Error en handleRedirectCallback (token exchange):", callbackError);
                console.error("[Auth0] Detalles del error:", {
                    name: callbackError.name,
                    message: callbackError.message,
                    error: callbackError.error,
                    error_description: callbackError.error_description,
                    status: callbackError.status,
                    statusText: callbackError.statusText
                });
                throw callbackError;
            }
            window.history.replaceState({}, document.title, "/");
        } else {
            console.log("[Auth0] No hay parámetros de callback en la URL");
        }

        const isLoggedIn = await auth0Client.isAuthenticated();
        console.log("[Auth0] Usuario autenticado:", isLoggedIn);

        // Log adicional: obtener usuario si está autenticado
        if (isLoggedIn) {
            try {
                const user = await auth0Client.getUser();
                console.log("[Auth0] Usuario obtenido:", user);
            } catch (e) {
                console.error("[Auth0] Error obteniendo usuario:", e);
            }
        }

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
        console.log('[Auth0] loginWithRedirect: redirect_uri=', getRedirectUri(), 'client_id=', AUTH0_CONFIG.client_id);
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: getRedirectUri(),
                client_id: AUTH0_CONFIG.client_id
            }
        });
    } catch (loginError) {
        console.error("[Auth0] Error en loginWithRedirect:", loginError);
        console.error("[Auth0] Detalles del error:", {
            name: loginError.name,
            message: loginError.message,
            error: loginError.error,
            error_description: loginError.error_description
        });
        alert("Error al iniciar sesión: " + loginError.message);
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
