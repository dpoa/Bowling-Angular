
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
            this._players = [];
            this._isStarted = false;
        }

        static get FrameCount() {
            return 10;
        }

        get isStarted() {
            return this._isStarted;
        }

        get players() {
            return this._players;
        }

        start() {
            this._isStarted = true;
        }

        finish() {
            this._isStarted = false;
        }

        join (playerName) {
            var player = new Player(playerName, this._players.length + 1);
            this._players.push(player);
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

        start () {
            this.$scope.game.start();
        }

        finish () {
            this.$scope.game.finish();
        }

        add () {
            alert('Add');
        }

        throw () {
            alert('Throw');
        }
    }

    angular
        .module('app', [])
        .service('BowlingService', BowlingService)
        .controller('MainController', MainController);
 })();