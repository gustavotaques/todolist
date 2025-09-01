// routes/index.js
const express = require('express');
const router = express.Router();
const logger = require('../logger');

logger.info('Arquivo de rotas foi carregado.');

let tasks = [
  { id: 1, text: 'Configurar o projeto', done: true },
  { id: 2, text: 'Enviar logs para o Datadog', done: false }
];
let nextTaskId = 3;

router.get('/', function(req, res, next) {
  logger.info('Página principal carregada com sucesso.');
  res.render('index', { title: 'To-Do List', tasks: tasks });
});

router.post('/add', function(req, res, next) {
  const { text } = req.body;
  if (text) {
    const newTask = { id: nextTaskId++, text: text, done: false };
    tasks.push(newTask);
    logger.warn(`Nova tarefa adicionada: { id: ${newTask.id}, text: "${newTask.text}" }`);
  }
  res.redirect('/');
});

router.get('/delete/:id', function(req, res, next) {
  const { id } = req.params;
  const taskToDelete = tasks.find(task => task.id == id);
  tasks = tasks.filter(task => task.id != id);
  if (taskToDelete) {
    logger.error(`Tarefa deletada: { id: ${id}, text: "${taskToDelete.text}" }`);
  }
  res.redirect('/');
});

// Apenas um exemplo para testar CodeQL

module.exports = router;