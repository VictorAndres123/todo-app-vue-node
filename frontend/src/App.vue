<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
/* Estilos globales para la aplicación */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f7f9;
  margin: 0;
}

#app {
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>