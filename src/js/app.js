
(() => {
    class Player {
        constructor(name) {
            this._name = name;
            this._rolls = [];
        }

        get name() {
            return this._name;
        }

        set name(value) {
            this._name = value;
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

    class BowlingService {

        constructor() {
            this._rnd = null;
        }

        play() {
            return 10;
        }
    }

    class MainController {

        constructor($scope, BowlingService) {
            var game = new Game();
            game.join('John');
            game.join('Mary');
            
            this.bowlingService = BowlingService;
            this.$scope = $scope;
            this.$scope.game = game;
        }

        add () {
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
        .service('BowlingService', BowlingService)
        .controller('MainController', MainController);
 })();