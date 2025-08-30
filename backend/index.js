const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// --- Configuración de MongoDB ---
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'todo-app';
let db;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Conexión a la Base de Datos y Arranque del Servidor ---
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Conectado a la base de datos MongoDB');
    db = client.db(dbName);
    
    // Iniciar el servidor solo después de una conexión exitosa
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('No se pudo conectar a MongoDB', error);
    process.exit(1);
  });


// --- Rutas de la API ---

// GET /tasks -> Listar todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.collection('tasks').find({}).toArray();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// POST /tasks -> Crear una nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'El campo text es obligatorio' });
    }

    const newTask = {
      text: text,
      completed: false,
      createdAt: new Date(),
    };

    const result = await db.collection('tasks').insertOne(newTask);

    const createdTask = {
      _id: result.insertedId,
      ...newTask
    };

    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// PUT /tasks/:id -> Actualizar una tarea (texto y/o estado)
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const updateFields = {};

    if (text !== undefined) {
      if (typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'El campo text no puede estar vacío' });
      }
      updateFields.text = text.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'El campo completed debe ser un booleano' });
      }
      updateFields.completed = completed;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'No se encontró la tarea' });
    }

    res.status(200).json({ message: 'Tarea actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// DELETE /tasks/:id -> Eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No se encontró la tarea' });
    }

    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});