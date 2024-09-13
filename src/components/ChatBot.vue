<template>
  <div class="flex flex-col h-screen bg-gray-200">
    <div class="ventana-chat bg-white w-full max-w-md flex flex-col h-full">
      <!-- Encabezado del chat -->
      <div class="encabezado-chat bg-blue-600 text-white">
        <div class="contenido-encabezado flex items-center justify-between p-4">
          <h1 class="text-lg font-semibold">ChatBot de Anthony</h1>
        </div>
      </div>

      <!-- Cuerpo del chat donde se mostrarán los mensajes -->
      <div class="cuerpo-chat flex-1 p-4 overflow-y-auto">
        <div v-if="cargando" class="text-center text-gray-500">
          Cargando...
        </div>

        <div v-for="(mensaje, index) in mensajes" :key="index" :class="['mensaje', mensaje.remitente === 'usuario' ? 'mensaje-usuario' : 'mensaje-bot']">
          <div v-if="mensaje.remitente === 'bot'" class="contenido-mensaje-bot">
            <p v-if="mensaje.texto" class="texto-mensaje">{{ mensaje.texto }}</p>
            <img v-if="mensaje.gif" :src="mensaje.gif" alt="Respuesta GIF" class="gif-mensaje"/>
          </div>
          <p v-if="mensaje.remitente === 'usuario'" class="texto-mensaje texto-usuario">{{ mensaje.texto }}</p>
        </div>
      </div>

      <!-- Input para el mensaje del usuario -->
      <div class="pie-chat bg-gray-100 border-t border-gray-300 flex items-center p-2">
        <input 
          v-model="mensajeUsuario" 
          @keyup.enter="enviarMensaje" 
          placeholder="Escribe un mensaje" 
          type="text"
          class="flex-1 p-2 border rounded-full bg-blue-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button @click="enviarMensaje" class="ml-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
          ENVIAR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const mensajeUsuario = ref(''); // Mensaje del usuario
const mensajes = ref<{ gif: string | null; texto: string; remitente: 'usuario' | 'bot' }[]>([]); // Lista de mensajes
const cargando = ref(false); // Estado de carga

const enviarMensaje = async () => {
  if (mensajeUsuario.value.trim() === '') {
    alert('Escribe algo antes de enviar');
    return;
  }

  mensajes.value.push({ gif: null, texto: mensajeUsuario.value, remitente: 'usuario' });
  mensajeUsuario.value = '';
  cargando.value = true;

  try {
    const res = await fetch('https://yesno.wtf/api');
    const datos = await res.json();
    mensajes.value.push({ gif: datos.image, texto: datos.answer === 'yes' ? 'Sí' : 'No', remitente: 'bot' });
  } catch (error) {
    console.error('Error al obtener la API', error);
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.ventana-chat {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Ocupa toda la altura de la ventana del navegador */
}

.cuerpo-chat {
  flex: 1; /* Ocupa el espacio disponible entre el encabezado y el pie del chat */
  padding: 1rem;
  overflow-y: auto;
}

.pie-chat {
  background-color: #f1f1f1;
  border-top: 1px solid #ddd;
  position: relative; /* Cambiado de sticky a relative para evitar problemas */
  bottom: 0;
  display: flex;
  align-items: center;
}

.pie-chat input {
  flex: 1; /* Asegura que el campo de texto ocupe el espacio disponible */
  margin-right: 0.5rem; /* Espacio entre el campo de texto y el botón */
  padding: 0.5rem 1rem; /* Ajusta el relleno del campo de texto */
  border-radius: 9999px; /* Redondeo completo del borde */
}

.pie-chat button {
  flex-shrink: 0; /* Impide que el botón se reduzca en tamaño */
  padding: 0.5rem 1rem; /* Ajusta el tamaño del botón */
  background-color: #34D399; /* Verde claro */
  color: white; /* Texto blanco */
  border-radius: 9999px; /* Redondeo completo del borde */
  border: none; /* Sin borde por defecto */
  font-weight: bold; /* Texto en negrita */
  font-size: 0.875rem; /* Tamaño del texto */
  cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
}

.pie-chat button:hover {
  background-color: #10B981; /* Verde más oscuro al pasar el ratón */
}

.mensaje {
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-end;
}

.mensaje-usuario {
  align-self: flex-end;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.mensaje-bot {
  background-color: #f0f0f0; /* Gris para el bot */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
  max-width: 80%;
  border-radius: 12px;
  padding: 0.5rem;
  word-wrap: break-word; /* Permite que el texto largo se ajuste dentro de la burbuja */
}

.contenido-mensaje-bot {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px; /* Bordes redondeados para el contenedor del mensaje del bot */
  background-color: #f0f0f0; /* Fondo gris claro para el mensaje del bot */
  padding: 0.5rem;
}

.texto-mensaje {
  font-family: 'Roboto', sans-serif; /* Cambia la fuente del texto */
  text-align: left; /* Alinea el texto a la izquierda para las burbujas del bot */
  padding: 0.5rem;
  border-radius: 12px; /* Bordes redondeados para el texto */
  background-color: inherit; /* Asegura que el texto herede el fondo del contenedor */
}

.texto-usuario {
  background-color: #e0f7fa; /* Celeste para el usuario */
  border-radius: 12px; /* Bordes redondeados para la burbuja del usuario */
  padding: 0.5rem;
  max-width: 70%; /* Limita el ancho máximo de la burbuja */
  word-wrap: break-word; /* Permite que el texto largo se ajuste dentro de la burbuja */
}

.gif-mensaje {
  width: 100%; /* Ajusta el ancho del GIF */
  max-width: 200px; /* Limita el ancho máximo del GIF */
  height: auto; /* Mantiene la relación de aspecto */
  border-radius: 12px; /* Bordes redondeados para el GIF */
}

/* Estilo para el encabezado */
.encabezado-chat {
  background-color: #4f7cf7; /* Azul para el encabezado */
  width: 100%; /* Asegura que el encabezado ocupe todo el ancho */
  border-bottom: 1px solid #ddd; /* Línea de borde inferior */
}

.contenido-encabezado {
  width: 100%; /* Asegura que el contenido del encabezado ocupe todo el ancho */
  color: rgb(255, 255, 255); /* Color del texto en blanco */
  text-align: center;
}
</style>
