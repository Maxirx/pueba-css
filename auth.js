let auth0Client = null;

// Detectar ambiente dinámicamente
const getRedirectUri = () => {
    return window.location.origin;
};

async function initAuth0() {
    const auth0Config = {
        domain: "dev-pjzj6vk78rt6brrh.us.auth0.com",
        client_id: "zjWCYwyGS2c5aXg7VNZxQp8AIb8hhOFo",
        cacheLocation: "localstorage",
        redirect_uri: getRedirectUri()
    };

    console.log("[Auth0] Configurando con:", {
        domain: auth0Config.domain,
        redirect_uri: auth0Config.redirect_uri
    });

    auth0Client = await createAuth0Client(auth0Config);

    // Manejo del redirect después de login
    if (location.search.includes("code=") && location.search.includes("state=")) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }

    const isLoggedIn = await auth0Client.isAuthenticated();

    if (isLoggedIn) {
        mostrarApp();
    } else {
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
    await auth0Client.loginWithRedirect({
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    });
}

async function logout() {
    await auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    });
}

window.onload = initAuth0;
