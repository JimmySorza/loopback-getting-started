'use strict';

module.exports = function(app) {
  // Instalando un "/ping" ruta que retorna un "pong".
  app.get('/ping', function(req, res) {
    res.send('pong');
  });
};
