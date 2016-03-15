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
})
