class MainController {

    constructor($scope) {
        this.$scope = $scope;    
    }

    start () {
        alert('Start');
    }
}

angular
    .module('app', [])
    .controller('MainController', MainController);