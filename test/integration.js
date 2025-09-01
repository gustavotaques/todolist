// test/integration.js
const request = require('supertest');
const app = require('../app');
const assert = require('assert');
const { resetTasks } = require('../routes/index'); // Importamos a função de reset

describe('Integration Tests for To-Do List', function() {
  
  // Hook do Mocha: Roda ANTES de CADA teste ('it' block)
  beforeEach(function() {
    resetTasks();
  });

  it('should display the main page with tasks', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        assert.ok(res.text.includes('Aprender Node.js'));
        done();
      });
  });

  it('should add a new task and redirect', function(done) {
    request(app)
      .post('/add')
      .send({ text: 'Nova Tarefa de Teste' })
      .expect(302)
      .end(function(err, res) {
        if (err) return done(err);
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
    request(app)
      .get('/delete/1')
      .expect(302)
      .end(function(err, res) {
        if (err) return done(err);
        request(app)
          .get('/')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            assert.strictEqual(res.text.includes('Aprender Node.js'), false, 'A tarefa não foi deletada');
            done();
          });
      });
  });
});