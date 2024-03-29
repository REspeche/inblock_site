angular.module('mainApp').controller('activeAccountController', ['$scope', 'actionSvc', 'mainSvc', '$timeout', 'authenticationSvc', 'alertSvc',
    function ($scope, actionSvc, mainSvc, $timeout, authenticationSvc, alertSvc) {
      $scope.formData = {
        email: '',
        hash: ''
      };
      $scope.error = false;
      $scope._forceProfile = false;
      $scope.timeRefresh = 12;

      $scope.loadActiveAccount = function() {
        $scope.formData.email = getQueryStringValue('email','');
        $scope.formData.hash = getQueryStringValue('hash','');

        mainSvc.callService({
            url: 'auth/activeaccount',
            params: {
               'email': $scope.formData.email,
               'hash': $scope.formData.hash,
               'isSite': 0
            },
            secured: false
        }).then(function (response) {
          if (response.token) {
            authenticationSvc.saveLogin({
              id      : response.id,
              email   : response.email,
              token   : response.token,
              type    : response.type,
              name    : response.name,
              forceProfile : response.forceProfile,
              role    : response.role,
              avatar  : response.avatar
            });
            $scope._forceProfile = response.forceProfile;
            $scope.error = false;
          }
          else {
            $scope.error = true;
            alertSvc.showAlertByCode(310);
          };
        }).catch(function (e) {
          $scope.error = true;
        });
        //counter
        var updateCounter = function() {
          if ($scope.timeRefresh>0) {
            $scope.timeRefresh--;
            $timeout(updateCounter, 1000);
          }
          else {
            $scope.goToHome();
          }
        };
        updateCounter();
      }

      $scope.goToHome = function() {
        if ($scope.error) actionSvc.goToExternal(2); //login
        else {
  				if ($scope._forceProfile) actionSvc.goToExternal(6); //profile
          else actionSvc.goToExternal(1); //home
        }
      }
    }]);
