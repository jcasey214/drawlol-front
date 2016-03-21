module.exports = angular.module('drawlol').factory('UsernameFactory', function(){
  return {
    username: null,
    setUsername: function(username){
      this.username = username;
    },
    getUsername: function(){
      return this.username;
    }
  }
}).factory('beforeUnload', function ($rootScope, $window) {
    $window.onbeforeunload = function (e) {
        var confirmation = {};
        var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
        if (event.defaultPrevented) {
            return confirmation.message;
        }
    };

    $window.onunload = function () {
        $rootScope.$broadcast('onUnload');
    };
    return {};
})
.run(function (beforeUnload) {
});
