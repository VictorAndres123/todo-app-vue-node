<template>
  <div class="todo-app">
    <h1>Lista de Tareas</h1>
    <p v-if="tasks.length > 0" class="task-counter">
      Tienes {{ incompleteTasksCount }} tarea(s) pendiente(s).
    </p>

    <form @submit.prevent="addTask" class="task-form">
      <input v-model="newTaskText" type="text" placeholder="¿Qué necesitas hacer?" required />
      <button type="submit">Agregar Tarea</button>
    </form>

    <!-- Controles de Filtro -->
    <div v-if="!isLoading && tasks.length > 0" class="filter-controls">
      <button @click="filter = 'all'" :class="{ active: filter === 'all' }">Todas</button>
      <button @click="filter = 'active'" :class="{ active: filter === 'active' }">Activas</button>
      <button @click="filter = 'completed'" :class="{ active: filter === 'completed' }">Completadas</button>
    </div>

    <div v-if="isLoading" class="loading">Cargando tareas...</div>

    <div v-else-if="tasks.length === 0" class="empty-state">
      <p>¡Felicidades! No tienes tareas pendientes.</p>
      <span>Añade tu primera tarea para empezar.</span>
    </div>

    <!-- Lista de Tareas -->
    <ul v-else class="task-list">
      <li v-for="task in filteredTasks" :key="task._id" :class="{ completed: task.completed }">
        
        <div v-if="editingTaskId !== task._id" class="task-view">
          <div class="task-content">
            <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)" />
            <span>{{ task.text }}</span>
          </div>
          <div class="task-actions">
            <button @click="startEditing(task)" class="edit-btn">Editar</button>
            <button @click="deleteTask(task._id)" class="delete-btn">Eliminar</button>
          </div>
        </div>

        <div v-else class="task-edit">
          <input v-model="editingTaskText" @keyup.enter="saveEdit(task)" @keyup.esc="cancelEditing" type="text" class="edit-input"/>
          <div class="task-actions">
            <button @click="saveEdit(task)" class="save-btn">Guardar</button>
            <button @click="cancelEditing" class="cancel-btn">Cancelar</button>
          </div>
        </div>

      </li>
    </ul>

    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import api from '../services/api'

const tasks = ref([])
const newTaskText = ref('')
const isLoading = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })
const editingTaskId = ref(null)
const editingTaskText = ref('')
const filter = ref('all') // 'all', 'active', 'completed'

let notificationTimer = null

const incompleteTasksCount = computed(() => {
  return tasks.value.filter(task => !task.completed).length
})

const filteredTasks = computed(() => {
  switch (filter.value) {
    case 'active':
      return tasks.value.filter(task => !task.completed)
    case 'completed':
      return tasks.value.filter(task => task.completed)
    default:
      return tasks.value
  }
})

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  if (notificationTimer) clearTimeout(notificationTimer)
  notificationTimer = setTimeout(() => { notification.value.show = false }, 3000)
}

const fetchTasks = async () => {
  isLoading.value = true
  try {
    const response = await api.getTasks()
    tasks.value = response.data
  } catch (error) {
    showNotification('Error al cargar las tareas', 'error')
  } finally {
    isLoading.value = false
  }
}

const addTask = async () => {
  if (newTaskText.value.trim() === '') return
  try {
    await api.createTask({ text: newTaskText.value })
    newTaskText.value = ''
    showNotification('Tarea creada exitosamente')
    await fetchTasks()
  } catch (error) {
    showNotification('Error al crear la tarea', 'error')
  }
}

const toggleTaskCompletion = async (task) => {
  cancelEditing()
  try {
    await api.updateTask(task._id, { completed: !task.completed })
    task.completed = !task.completed
    showNotification('Tarea actualizada')
  } catch (error) {
    showNotification('Error al actualizar la tarea', 'error')
  }
}

const deleteTask = async (id) => {
  cancelEditing()
  try {
    await api.deleteTask(id)
    showNotification('Tarea eliminada')
    await fetchTasks()
  } catch (error) {
    showNotification('Error al eliminar la tarea', 'error')
  }
}

const startEditing = async (task) => {
  editingTaskId.value = task._id
  editingTaskText.value = task.text
  await nextTick()
  const input = document.querySelector('.edit-input')
  if (input) input.focus()
}

const cancelEditing = () => {
  editingTaskId.value = null
  editingTaskText.value = ''
}

const saveEdit = async (task) => {
  if (editingTaskText.value.trim() === '') {
    showNotification('El texto no puede estar vacío', 'error')
    return
  }
  try {
    await api.updateTask(task._id, { text: editingTaskText.value })
    task.text = editingTaskText.value
    showNotification('Tarea guardada')
    cancelEditing()
  } catch (error) {
    showNotification('Error al guardar la tarea', 'error')
  }
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.todo-app { max-width: 500px; margin: 0 auto; padding: 20px; position: relative; }
h1 { text-align: center; color: #2c3e50; margin-bottom: 0.5em; }
.task-counter { text-align: center; color: #777; margin-top: 0; margin-bottom: 1.5em; }
.task-form { display: flex; margin-bottom: 20px; }
.task-form input { flex-grow: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px 0 0 4px; }
.task-form button { padding: 10px 15px; border: none; background-color: #42b983; color: white; border-radius: 0 4px 4px 0; cursor: pointer; }
.filter-controls { display: flex; justify-content: center; margin-bottom: 20px; gap: 10px; }
.filter-controls button { padding: 8px 12px; border: 1px solid #ccc; background-color: white; border-radius: 6px; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
.filter-controls button.active { background-color: #42b983; color: white; border-color: #42b983; }
.task-list { list-style: none; padding: 0; }
.task-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f9f9f9; border-bottom: 1px solid #eee; }
.task-list li.completed .task-content span { text-decoration: line-through; color: #999; }
.task-view, .task-edit { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.task-content { display: flex; align-items: center; flex-grow: 1; }
.task-content input[type='checkbox'] { margin-right: 10px; }
.task-actions button { margin-left: 8px; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; color: white; }
.edit-btn { background-color: #3498db; }
.delete-btn { background-color: #e74c3c; }
.save-btn { background-color: #2ecc71; }
.cancel-btn { background-color: #95a5a6; }
.edit-input { flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.loading, .empty-state { text-align: center; padding: 40px 20px; color: #777; }
.empty-state p { margin: 0; font-size: 1.2em; }
.empty-state span { font-size: 0.9em; color: #999; }
.notification { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 6px; color: white; font-weight: bold; box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: opacity 0.5s ease; }
.notification.success { background-color: #42b983; }
.notification.error { background-color: #e74c3c; }
</style>
