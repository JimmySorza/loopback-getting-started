'use strict';

module.exports = function(app){
  app.dataSources.mysqlDs.automigrate('CofeeShop', function(err){
    if (err) throw err;

    app.models.CofeeShop.create([{
      name: 'Juan',
      city: 'Cali',
    }, {
      name: 'Pedro',
      city: 'Tunja',
    }, {
      name: 'Jose',
      city: 'Medellín',
    }], function(err, cofeeShops){
      if (err) throw err;

      console.log('Models created: \n', cofeeShops);
    });
  });
};
