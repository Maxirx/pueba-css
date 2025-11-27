function parseYMD(ymd) {
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-").map(Number);
    if (!y || !m || !d) return null;
    return { y, m, d };
}

function formatearFechaDDMMYYYY(valor) {
    const partes = parseYMD(valor);
    if (!partes) return "";
    const { y, m, d } = partes;
    const dia = String(d).padStart(2, "0");
    const mes = String(m).padStart(2, "0");
    // Mostrar con guiones DD-MM-YYYY según solicitud
    return `${dia}-${mes}-${y}`;
}

function formatearFechaCarta(valor) {
    const partes = parseYMD(valor);
    if (!partes) return "";
    const { y, m, d } = partes;

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const mesNombre = meses[m - 1];

    return `Buenos Aires, ${d} de ${mesNombre} de ${y}`;
}

function actualizarCarta() {
    const fechaCartaInput = document.getElementById("inputFechaCarta").value;
    const poliza = document.getElementById("inputPoliza").value || "__________";
    const destinatario = document.getElementById("inputDestinatario") ? document.getElementById("inputDestinatario").value.toUpperCase() : "Karlos SRL";
    const inicioVigenciaInput = document.getElementById("inputInicioVigencia").value;
    const finVigenciaInput = document.getElementById("inputFinVigencia").value;
    const finLibreDeudaInput = document.getElementById("inputFinLibreDeuda").value;

    // Fecha carta
    const fechaCartaTexto = formatearFechaCarta(fechaCartaInput);
    document.getElementById("fechaCarta").textContent =
        fechaCartaTexto || "Buenos Aires, ___ de __________ de ____";

    // Número de póliza (dos lugares: referencia y primer párrafo)
    document.getElementById("polizaNumeroRef").textContent = poliza;
    document.getElementById("polizaNumeroTexto").textContent = poliza;

    // Destinatario dinámico
    const destElem = document.getElementById("destinatarioNombre");
    if (destElem) destElem.textContent = destinatario || "KOMPAS SRL";

    // Fechas de vigencia y libre deuda
    document.getElementById("fechaInicioVigenciaTexto").textContent =
        formatearFechaDDMMYYYY(inicioVigenciaInput) || "__/__/____";

    document.getElementById("fechaFinVigenciaTexto").textContent =
        formatearFechaDDMMYYYY(finVigenciaInput) || "__/__/____";

    document.getElementById("fechaFinLibreDeudaTexto").textContent =
        formatearFechaDDMMYYYY(finLibreDeudaInput) || "__/__/____";
}

window.addEventListener("DOMContentLoaded", () => {
    // Valores por defecto (los de tu ejemplo)
    document.getElementById("inputFechaCarta").value = "2025-10-27";
    document.getElementById("inputPoliza").value = "5160027337603";
    // Valor por defecto para destinatario
    if (document.getElementById("inputDestinatario")) document.getElementById("inputDestinatario").value = "KOMPAS SRL";
    document.getElementById("inputInicioVigencia").value = "2025-08-31";
    document.getElementById("inputFinVigencia").value = "2026-02-28";
    document.getElementById("inputFinLibreDeuda").value = "2025-11-28";

    // Primera actualización
    actualizarCarta();

    // Botón
    document.getElementById("btnActualizar").addEventListener("click", actualizarCarta);

    // También actualizar al cambiar cualquier campo
    ["inputFechaCarta", "inputPoliza", "inputDestinatario", "inputInicioVigencia", "inputFinVigencia", "inputFinLibreDeuda"]
        .forEach(id => {
            document.getElementById(id).addEventListener("change", actualizarCarta);
        });
});

function imprimirContenido() {
    const fechaCartaInput = document.getElementById("inputFechaCarta").value;
    const poliza = document.getElementById("inputPoliza").value
    const nombreArchivo = `Kompas_libreDeuda_${poliza} V.${fechaCartaInput}`; // Este es el nombre del archivo que quieres imprimir
    console.log("Nombre de archivo para imprimir:", nombreArchivo);
    console.log("Título actual de la página:", document.title);
    document.title = nombreArchivo; // Cambia el título de la página para que se use como nombre de archivo al imprimir


    window.print(); // Abre el cuadro de diálogo de impresión
}

// Imprimir usando window.print() y ajustar el título para que el diálogo use el nombre deseado
function imprimirConNombre() {
    const poliza = document.getElementById("inputPoliza").value || "sin_poliza";
    const finLibreDeudaInput = document.getElementById("inputFinLibreDeuda").value || "sin_fecha";
    // formatear fecha a DD-MM-YYYY (ya lo hace formatearFechaDDMMYYYY)
    const fechaFormateada = formatearFechaDDMMYYYY(finLibreDeudaInput);
    // Incluir destinatario en el nombre del archivo, sanitizado
    const destinatarioRaw = document.getElementById("inputDestinatario") ? document.getElementById("inputDestinatario").value : "KOMPAS SRL";
    // Sanitizar: trim, reemplazar espacios por guiones bajos, eliminar caracteres no alfanuméricos excepto guion bajo y guion
    const destinatarioSanitizado = destinatarioRaw.trim().replace(/\s+/g, '_').replace(/[^\w\-]/g, '').substring(0, 60).toUpperCase();
    const nombreArchivo = `${destinatarioSanitizado}_libreDeuda_${poliza}_ V.${fechaFormateada}`;

    // Guardar título original y cambiarlo temporalmente
    const tituloOriginal = document.title;
    document.title = nombreArchivo;

    // Llamar al diálogo de impresión del navegador
    window.print();

    // Restaurar título original después de un pequeño delay
    setTimeout(() => {
        document.title = tituloOriginal;
    }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnImprimir");
    if (btn) btn.addEventListener('click', imprimirConNombre);
});
