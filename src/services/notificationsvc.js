mainApp.factory('notificationSvc', ['mainSvc', '$rootScope', '$q',
  function (mainSvc, $rootScope, $q) {
      var _defered = $q.defer();
      var _promise = undefined;
      var _publicFunctions = {
        getAlerts: getAlerts,
        resetAlerts: resetAlerts
      };

      var _data = {
        pull: false,
        notifications: 0,
        cart: 0
      };

      function resetAlerts() {
        _data = {
          pull: false,
          notifications: 0,
          cart: 0
        };
        $rootScope.alerts = _data;
      }

      function getAlerts() {
        _promise = _defered.promise;
        if (!_data.pull && $rootScope.userInfo!=undefined) {
          //llama al servicio de alertas
          mainSvc.callService({
            url: 'common/getCountAlerts'
          }).then(function (response) {
            _data = {
              pull: true,
              notifications: response.notifications,
              cart: response.cart
            };
            $rootScope.alerts = _data;
            _defered.resolve(_data);
          }).catch(function(err) {
            _defered.reject(_data);
          });
        }
        else {
          if (_data.pull) _defered.resolve(_data);
        }
        return _promise;
      }

      return _publicFunctions;
  }]);
