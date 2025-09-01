const request = require('supertest');
const app = require('../app'); // Importa nossa aplicação Express
const assert = require('assert');

describe('Integration Tests for To-Do List', function() {

  it('should display the main page with tasks', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        // Verifica se o título e uma das tarefas padrão estão presentes
        assert.ok(res.text.includes('To-Do List'));
        assert.ok(res.text.includes('Aprender Node.js'));
        done();
      });
  });

  it('should add a new task and redirect', function(done) {
    request(app)
      .post('/add')
      .send({ text: 'Nova Tarefa de Teste' })
      .expect(302) // Espera um redirecionamento
      .end(function(err, res) {
        if (err) return done(err);
        // Após adicionar, verifica se a nova tarefa está na lista
        request(app)
          .get('/')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            assert.ok(res.text.includes('Nova Tarefa de Teste'));
            done();
          });
      });
  });

  it('should delete a task and redirect', function(done) {
    // Primeiro, vamos deletar a tarefa com id 1 ('Aprender Node.js')
    request(app)
      .get('/delete/1')
      .expect(302) // Espera um redirecionamento
      .end(function(err, res) {
        if (err) return done(err);
        // Após deletar, verifica se a tarefa não está mais na lista
        request(app)
          .get('/')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            assert.ok(!res.text.includes('Aprender Node.js'));
            done();
          });
      });
  });
});