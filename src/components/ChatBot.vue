<template>
    <div class="flex flex-col h-screen bg-gray-200">
      <div class="chat-window bg-white w-full max-w-md flex flex-col h-full">
        <!-- Encabezado del chat -->
        <div class="chat-header bg-blue-600 text-white">
          <div class="header-content flex items-center justify-between p-4">
            <h1 class="text-lg font-semibold">ChatBot de Anthony</h1>
          </div>
        </div>
  
        <!-- Cuerpo del chat donde se mostrarán los mensajes -->
        <div class="chat-body flex-1 p-4 overflow-y-auto">
          <div v-if="loading" class="text-center text-gray-500">
            Cargando...
          </div>
  
          <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender === 'user' ? 'user-message' : 'bot-message']">
            <div v-if="message.sender === 'bot'" class="bot-message-content">
              <p v-if="message.text" class="message-text">{{ message.text }}</p>
              <img v-if="message.gif" :src="message.gif" alt="Respuesta GIF" class="message-gif"/>
            </div>
            <p v-if="message.sender === 'user'" class="message-text user-text">{{ message.text }}</p>
          </div>
        </div>
  
        <!-- Input para el mensaje del usuario -->
        <div class="chat-footer bg-gray-100 border-t border-gray-300 flex items-center p-2">
          <input 
            v-model="userMessage" 
            @keyup.enter="sendMessage" 
            placeholder="Escribe un mensaje" 
            type="text"
            class="flex-1 p-2 border rounded-full bg-blue-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button @click="sendMessage" class="ml-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const userMessage = ref(''); // mensaje del usuario
  const messages = ref<{ gif: string | null; text: string; sender: 'user' | 'bot' }[]>([]); // Lista de mensajes
  const loading = ref(false); // Estado de carga
  
  const sendMessage = async () => {
    if (userMessage.value.trim() === '') {
      alert('Escribe algo antes de enviar');
      return;
    }
  
    messages.value.push({ gif: null, text: userMessage.value, sender: 'user' });
    userMessage.value = '';
    loading.value = true;
  
    try {
      const res = await fetch('https://yesno.wtf/api');
      const data = await res.json();
      messages.value.push({ gif: data.image, text: data.answer === 'yes' ? 'Sí' : 'No', sender: 'bot' });
    } catch (error) {
      console.error('Error fetching the API', error);
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .chat-window {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Ocupa toda la altura de la ventana del navegador */
  }
  
  .chat-body {
    flex: 1; /* Ocupa el espacio disponible entre el encabezado y el pie del chat */
    padding: 1rem;
    overflow-y: auto;
  }
  
  .chat-footer {
    background-color: #f1f1f1;
    border-top: 1px solid #ddd;
    position: relative; /* Cambiado de sticky a relative para evitar problemas */
    bottom: 0;
    display: flex;
    align-items: center;
  }
  
  .chat-footer input {
    flex: 1; /* Asegura que el campo de texto ocupe el espacio disponible */
    margin-right: 0.5rem; /* Espacio entre el campo de texto y el botón */
    padding: 0.5rem 1rem; /* Ajusta el relleno del campo de texto */
    border-radius: 9999px; /* Redondeo completo del borde */
  }
  
  .chat-footer button {
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
  
  .chat-footer button:hover {
    background-color: #10B981; /* Verde más oscuro al pasar el ratón */
  }
  
  .message {
    margin-bottom: 1rem;
    display: flex;
    align-items: flex-end;
  }
  
  .user-message {
    align-self: flex-end;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .bot-message {
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
  
  .bot-message-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 12px; /* Bordes redondeados para el contenedor del mensaje del bot */
    background-color: #f0f0f0; /* Fondo gris claro para el mensaje del bot */
    padding: 0.5rem;
  }
  
  .message-text {
    font-family: 'Roboto', sans-serif; /* Cambia la fuente del texto */
    text-align: left; /* Alinea el texto a la izquierda para las burbujas del bot */
    padding: 0.5rem;
    border-radius: 12px; /* Bordes redondeados para el texto */
    background-color: inherit; /* Asegura que el texto herede el fondo del contenedor */
  }
  
  .user-text {
    background-color: #e0f7fa; /* Celeste para el usuario */
    border-radius: 12px; /* Bordes redondeados para la burbuja del usuario */
    padding: 0.5rem;
    max-width: 70%; /* Limita el ancho máximo de la burbuja */
    word-wrap: break-word; /* Permite que el texto largo se ajuste dentro de la burbuja */
  }
  
  .message-gif {
    width: 100%; /* Ajusta el ancho del GIF */
    max-width: 200px; /* Limita el ancho máximo del GIF */
    height: auto; /* Mantiene la relación de aspecto */
    border-radius: 12px; /* Bordes redondeados para el GIF */
  }
  
  /* Estilo para la barra azul del encabezado */
  .chat-header {
    background-color: #4f7cf7; /* Azul para el encabezado */
    width: 100%; /* Asegura que el encabezado ocupe todo el ancho */
    border-bottom: 1px solid #ddd; /* Línea de borde inferior */
 

  }
  
  .header-content {

    color: rgb(255, 255, 255); /* Color del texto en blanco */
    text-align: center;
  }
  </style>
  