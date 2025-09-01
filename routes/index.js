const express = require('express');
const router = express.Router();

// Usaremos um array em memória para simplicidade
let tasks = [
  { id: 1, text: 'Aprender Node.js', done: false },
  { id: 2, text: 'Criar um To-Do List', done: true },
  { id: 3, text: 'Fazer testes de integração', done: false }
];
let nextTaskId = 4;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'To-Do List', tasks: tasks });
});

/* POST para adicionar nova tarefa */
router.post('/add', function(req, res, next) {
  const { text } = req.body;
  if (text) {
    tasks.push({ id: nextTaskId++, text: text, done: false });
  }
  res.redirect('/');
});

/* GET para deletar uma tarefa */
router.get('/delete/:id', function(req, res, next) {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id != id);
  res.redirect('/');
});

module.exports = router;