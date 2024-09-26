const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configuração do CORS
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'seu_banco_de_dados',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

// Rota para registrar o jogador
app.post('/register', (req, res) => {
  const { name, score } = req.body;
  const query = 'INSERT INTO ranking (name, score) VALUES (?, ?)';
  db.query(query, [name, score], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ id: result.insertId, name, score });
  });
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});