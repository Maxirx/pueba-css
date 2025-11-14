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
    return `${dia}/${mes}/${y}`;
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
    document.getElementById("inputInicioVigencia").value = "2025-08-31";
    document.getElementById("inputFinVigencia").value = "2026-02-28";
    document.getElementById("inputFinLibreDeuda").value = "2025-11-28";

    // Primera actualización
    actualizarCarta();

    // Botón
    document.getElementById("btnActualizar").addEventListener("click", actualizarCarta);

    // También actualizar al cambiar cualquier campo
    ["inputFechaCarta", "inputPoliza", "inputInicioVigencia", "inputFinVigencia", "inputFinLibreDeuda"]
        .forEach(id => {
            document.getElementById(id).addEventListener("change", actualizarCarta);
        });
});
