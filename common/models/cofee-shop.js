'use strict';

module.exports = function(CofeeShop) {
  CofeeShop.status = function(cb) {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var OPEN_HOUR = 6;
    var CLOSE_HOUR = 20;
    console.log('Current hour is %d', currentHour);
    var response;
    if (currentHour >= OPEN_HOUR && currentHour < CLOSE_HOUR) {
      response = 'Estamos abiertos para negocios.';
    } else {
      response = 'Lo sentimos, tenemos cerrado. Abrimos de 6am a 8pm.';
    }
    cb(null, response);
  };
  CofeeShop.getName = function(shopId, cb) {
    CofeeShop.findById(shopId, function(err, instance) {
      var response = 'El nombre del cafe es ' + instance.name;
      cb(null, response);
      console.log(response);
    });
  };
  CofeeShop.remoteMethod(
    'status', {
      http: {
        path: '/status',
        verb: 'get',
      },
      returns: {
        arg: 'status',
        type: 'string',
      },
    }
  );
  CofeeShop.remoteMethod(
    'getName', {
      http: {path: '/getname', verb: 'get'},
      accepts: {arg: 'id', type: 'number', http: {source: 'query'}},
      returns: {arg: 'name', type: 'string'},
    }
  );
};
