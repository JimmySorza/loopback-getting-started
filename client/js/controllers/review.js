// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('AllReviewsController', ['$scope', 'Review', function($scope,
      Review) {
    $scope.reviews = Review.find({
      filter: {
        include: [
          'cofeeShop',
          'reviewer'
        ]
      }
    });
  }])
  .controller('AddReviewController', ['$scope', 'CofeeShop', 'Review',
      '$state', function($scope, CofeeShop, Review, $state) {
    $scope.action = 'Add';
    $scope.cofeeShops = [];
    $scope.selectedShop;
    $scope.review = {};
    $scope.isDisabled = false;

    CofeeShop
      .find()
      .$promise
      .then(function(cofeeShops) {
        $scope.cofeeShops = cofeeShops;
        $scope.selectedShop = $scope.selectedShop || cofeeShops[0];
      });

    $scope.submitForm = function() {
      Review
        .create({
          rating: $scope.review.rating,
          comments: $scope.review.comments,
          cofeeShopId: $scope.selectedShop.id
        })
        .$promise
        .then(function() {
          $state.go('all-reviews');
        });
    };
  }])
  .controller('DeleteReviewController', ['$scope', 'Review', '$state',
      '$stateParams', function($scope, Review, $state, $stateParams) {
    Review
      .deleteById({ id: $stateParams.id })
      .$promise
      .then(function() {
        $state.go('my-reviews');
      });
  }])
  .controller('EditReviewController', ['$scope', '$q', 'CofeeShop', 'Review',
      '$stateParams', '$state', function($scope, $q, CofeeShop, Review,
      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.cofeeShops = [];
    $scope.selectedShop;
    $scope.review = {};
    $scope.isDisabled = true;

    $q
      .all([
        CofeeShop.find().$promise,
        Review.findById({ id: $stateParams.id }).$promise
      ])
      .then(function(data) {
        var cofeeShops = $scope.cofeeShops = data[0];
        $scope.review = data[1];
        $scope.selectedShop;

        var selectedShopIndex = cofeeShops
          .map(function(cofeeShop) {
            return cofeeShop.id;
          })
          .indexOf($scope.review.cofeeShopId);
        $scope.selectedShop = cofeeShops[selectedShopIndex];
      });

    $scope.submitForm = function() {
      $scope.review.cofeeShopId = $scope.selectedShop.id;
      $scope.review
        .$save()
        .then(function(review) {
          $state.go('all-reviews');
        });
    };
  }])
  .controller('MyReviewsController', ['$scope', 'Review',
      function($scope, Review) {
        // after a refresh, the currenUser is not immediately on the scope
        // So, we're watching it on the scope and load my reviews only then.
        $scope.$watch('currentUser.id', function(value) {
          if (!value) {
            return;
          }
          $scope.reviews = Review.find({
            filter: {
              where: {
                publisherId: $scope.currentUser.id
              },
              include: [
                'cofeeShop',
                'reviewer'
              ]
            }
          });
        });
  }]);
