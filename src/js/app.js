
(() => {
    class Player {
        constructor(name) {
            this.name = name;
            this.rolls = [];
        }
    }

    class Game {
        constructor() {
            this.players = [];
        }

        join (playerName) {
            var player = new Player(playerName);
            this.players.push(player);
        }
    }

    class GameService {

        constructor() {
            this.name = '';
        }

        add(name) {

        }
    }

    class MainController {

        constructor($scope, GameService) {
            this.$scope = $scope;
            this.gameService = GameService;
        }

        app () {
            alert('Add');
        }

        clear () {
            alert('Add');
        }

        start () {
            alert('Start');
        }
    }

    angular
        .module('app', [])
        .service('GameService', GameService)
        .controller('MainController', MainController);
 })();