// 1. Seleccionamos los elementos del formulario y el área de resultado
const formulario = document.getElementById("formulario-temperatura");
const entradaValor = document.getElementById("valor-temperatura");
const selectOrigen = document.getElementById("unidad-origen");
const selectDestino = document.getElementById("unidad-destino");
const botonConvertir = document.getElementById("boton-convertir");
const cajaResultado = document.getElementById("resultado-conversion");

// 2. Verifica si los 3 campos tienen datos válidos para habilitar o deshabilitar el botón
function actualizarEstadoBoton() {
  const valorTexto = entradaValor.value.trim();
  const tieneValorValido =
    valorTexto !== "" && !Number.isNaN(Number(valorTexto));
  const tieneOrigen = selectOrigen.value !== "";
  const tieneDestino = selectDestino.value !== "";

  // El botón solo se habilita si los 3 campos están completos
  botonConvertir.disabled = !(tieneValorValido && tieneOrigen && tieneDestino);
}

// 3. Convierte cualquier temperatura a Celsius como paso intermedio sencillo
function aCelsius(valor, unidadOrigen) {
  if (unidadOrigen === "celsius") return valor;
  if (unidadOrigen === "fahrenheit") return (valor - 32) * (5 / 9);
  if (unidadOrigen === "kelvin") return valor - 273.15;
  return valor;
}

// 4. Convierte desde Celsius a la unidad destino elegida
function desdeCelsius(valorCelsius, unidadDestino) {
  if (unidadDestino === "celsius") return valorCelsius;
  if (unidadDestino === "fahrenheit") return (valorCelsius * 9) / 5 + 32;
  if (unidadDestino === "kelvin") return valorCelsius + 273.15;
  return valorCelsius;
}

// Formatea números sin ceros innecesarios (ej. 93.2 o 34)
function formatearNumero(numero) {
  return Number(numero.toFixed(2)).toString();
}

// Nombre legible para mostrar en el mensaje final
function obtenerNombreUnidad(unidad) {
  if (unidad === "celsius") return "Celsius";
  if (unidad === "fahrenheit") return "Fahrenheit";
  if (unidad === "kelvin") return "Kelvin";
  return unidad;
}

// Escuchamos cambios en los 3 campos para validar en tiempo real
entradaValor.addEventListener("input", actualizarEstadoBoton);
selectOrigen.addEventListener("change", actualizarEstadoBoton);
selectDestino.addEventListener("change", actualizarEstadoBoton);

// 5. Al enviar el formulario, calculamos y mostramos el resultado debajo
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const valorOriginal = Number(entradaValor.value);
  const origen = selectOrigen.value;
  const destino = selectDestino.value;

  // Evitamos temperaturas Kelvin por debajo del cero absoluto (0 K)
  if (origen === "kelvin" && valorOriginal < 0) {
    cajaResultado.textContent =
      "La temperatura en Kelvin no puede ser menor que 0.";
    cajaResultado.className = "resultado-conversion aviso";
    return;
  }

  const tempEnCelsius = aCelsius(valorOriginal, origen);
  const tempConvertida = desdeCelsius(tempEnCelsius, destino);

  const textoOrigen = obtenerNombreUnidad(origen);
  const textoDestino = obtenerNombreUnidad(destino);

  cajaResultado.textContent = `${formatearNumero(valorOriginal)} ${textoOrigen} es ${formatearNumero(tempConvertida)} ${textoDestino}`;
  cajaResultado.className = "resultado-conversion";
});

// Aseguramos que el botón inicie deshabilitado al cargar la página
actualizarEstadoBoton();
