const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Substitua pelo seu usuário do MySQL
  password: '', // Substitua pela sua senha do MySQL
  database: 'jogo_pokemon'
});

// Conectar ao banco de dados
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

// Rota para obter as pontuações
app.get('/pontuacoes', (req, res) => {
  db.query('SELECT * FROM pontuacoes ORDER BY acertos DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Rota para adicionar ou atualizar pontuações
app.put('/pontuacoes/:nome', (req, res) => {
  const { acertos, erros } = req.body;
  const nome = req.params.nome;

  db.query(
    'INSERT INTO pontuacoes (nome_jogador, acertos, erros, data_hora) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE acertos = ?, erros = ?',
    [nome, acertos, erros, acertos, erros],
    (err, results) => {
      if (err) {
        console.error('Erro ao atualizar pontuação:', err); // Log de erro
        return res.status(500).json({ error: err });
      }
      res.json({ message: 'Pontuação atualizada com sucesso!', results });
    }
  );
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
