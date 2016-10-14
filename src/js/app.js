
(() => {
    class Player {
        constructor(name, position) {
            this._position = position || 0;
            this._name = name;
            this._frames = [];
            
            for (var i = 0; i < Game.FrameCount; i++) {
                var frame = new Frame(i + 1);
                this._frames.push(frame);
            }
        }

        get position() {
            return this._position;
        }

        set position(value) {
            this._position = value;
        }

        get name() {
            return this._name;
        }

        set name(value) {
            this._name = value;
        }

        get frames() {
            return this._frames;
        }

        get rolls() {
            var rolls = [];
            for (let frame of this._frames) {
                rolls = rolls.concat(frame.rolls);
            }
            return rolls;
        }
    }

    class Frame {
        constructor(position) {
            this._position = position;
            this._rolls = [ null, null ];

            if (position == Game.FrameCount) {
                this._rolls.push(null);
            }
        }

        get position() {
            return this._position;
        }

        set position(value) {
            this._position = value;
        }

        get rolls() {
            return this._rolls;
        }
    }

    class Game {
        constructor() {
            this.players = [];
        }

        static get FrameCount() {
            return 10;
        }

        join (playerName) {
            var player = new Player(playerName, this.players.length + 1);
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