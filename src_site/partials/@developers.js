angular.module('mainApp').controller('developersController', ['$scope', 'alertSvc', 'mainSvc', '$translate', 'CONSTANTS',
    function ($scope, alertSvc, mainSvc, $translate, CONSTANTS) {
      $scope.formIAmDeveloper = {
          name: '',
          email: '',
          phone: '',
          message: ''
      };
      $scope.recaptchaSecretClient = CONSTANTS.recaptcha;

      $scope.loadDevelopers = function() {

      };

      $scope.toIAmDeveloper = function () {
          if ($scope.formIAmDeveloper.name != '' && $scope.formIAmDeveloper.email != '' && $scope.formIAmDeveloper.phone != '') {
              $scope.isBusy = true;
              alertSvc.showAlert().notifyInfo($translate.instant('MSG_BUSSY'));
              grecaptcha.execute($scope.recaptchaSecretClient, { action: 'contactPage' })
                  .then(function (token) {
                      // Verify the token on the server.
                      mainSvc.callService({
                        url: 'mail/VerifyCaptcha',
                        params: {
                            token: token
                        },
                        secured: false
                      }).then(function (response) {
                        if (response.code === 0 && response.success) {
                          mainSvc.callService({
              							url: 'mail/iamdeveloper',
              							params: $scope.formIAmDeveloper,
              							secured: false
              						}).then(function (response) {
              							if (response.code === 0) {
              									$scope.formIAmDeveloper = {
              											name: '',
              											email: '',
              											phone: '',
              											message: ''
              									};
              									alertSvc.showAlert().notifySuccess($translate.instant('MSG_SUCCESS_DEVELOPER'));
              							}
              							else {
              									alertSvc.showAlert().notifyError($translate.instant('MSG_ERROR_PROCESS'));
              							}
              						});
                        }
                        else {
                          alertSvc.showAlert().notifyError($translate.instant('MSG_ERROR_CAPTCHA'));
                        }
                      });
                  });
              return false;
          }
          else alertSvc.showAlert().notifyWarning($translate.instant('MSG_REQUEST_FIELD'));
      }

    }]);
