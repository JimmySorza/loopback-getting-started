'use strict';
var async = require('async');
module.exports = function(app) {
  // data sources
  var mongoDs = app.dataSources.mongoDs; // find in datasource.json
  var mysqlDs = app.dataSources.mysqlDs;
  // creacion de todos los modelos
  async.parallel({
    reviewers: async.apply(createReviewers),
    coffeeShops: async.apply(createCofeeShops),
  }, function (err, results) {
      if (err) throw err;
      createReviewers(results.reviewers, results.cofeeShops, function (err) {
        console.log('> Modelos creados exitosamente');
      });
  });
  //create reviewers
  function createReviewers(cb) {
    mongoDs.automigrate('Reviewer', function(err) {
      if (err) return cb(err);
      var Reviewer = app.models.Reviewer;
      Reviewer.create([{
        email: 'foo@bar.com',
        password: 'foobar',
      }, {
        email: 'jimmy@sorza.com',
        password: 'jimmy',
      }, {
        email: 'juan@perez.com',
        password: 'juan',
      }], cb);
    });
  }
  // create coffee shops
  function createCofeeShops(cb) {
    mysqlDs.automigrate('CofeeShop', function(err){
      if (err) throw cb(err);
      var CofeeShop = app.models.CofeeShops;
      CofeeShop.create([{
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
  }
  // create reviews
  function createReviews(reviewers, cofeeShops, cb) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([{
        date: Date.now() - (DAY_IN_MILLISECONDS * 4),
        ratings: 5,
        comments: 'Un una muy buena tienda de cafe',
        publisherId: reviewers[0].id,
        cofeeShopId: cofeeShops[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 3),
        ratings: 5,
        comments: 'Un lugar tranquilo',
        publisherId: reviewers[1].id,
        cofeeShopId: cofeeShops[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 2),
        ratings: 4,
        comments: 'Estuvo bien',
        publisherId: reviewers[1].id,
        cofeeShopId: cofeeShops[1].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS),
        ratings: 4,
        comments: 'Espectacular',
        publisherId: reviewers[2].id,
        cofeeShopId: cofeeShops[2].id,
      }], cb);
    });
  }
};
