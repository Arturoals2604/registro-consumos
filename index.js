// index.js

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,      // usualmente 'localhost'
  user: process.env.DB_USER,      // tu usuario, por ejemplo 'root'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,  // en tu caso 'registro_consumos'
  port: process.env.DB_PORT || 3000 // puerto por defecto de MySQL
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err);
  } else {
    console.log('✅ Conexión exitosa a MySQL');
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Bienvenido a la API de Registro de Consumos');
});

// Ruta para registrar consumos
app.post('/api/consumos', (req, res) => {
  const { fecha, quien, monto, categoria, subcategoria, comentario } = req.body;

  const sql = `INSERT INTO consumos_personales 
    (fecha, quien, monto, categoria, subcategoria, comentario) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [fecha, quien, monto, categoria, subcategoria, comentario], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar:', err);
      res.status(500).json({ mensaje: 'Error al registrar el consumo' });
    } else {
      console.log('✅ Registro insertado correctamente');
      res.json({ mensaje: '✅ Consumo registrado correctamente', id: result.insertId });
    }
  });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
  