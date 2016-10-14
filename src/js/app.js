
(() => {
    /*
     * The player
     */
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

    /*
     * The game frame
     */
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

    /*
     * Handle all information about the game
     */
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

        get hasPlayers() {
            return this._players.length > 0;
        }

        start() {
            this._isStarted = true;
        }

        finish() {
            this._isStarted = false;
        }

        join (playerName) {
            var index = this._players.findIndex(i => i.name == playerName);

            if (playerName === undefined || playerName === '' || playerName.trim() === '') {
                throw new Error('Name cannot be empty!');
            }

            if (index < 0) {
                var player = new Player(playerName, this._players.length + 1);
                this._players.push(player);
            }
            else {
                throw new Error('Player already added!');
            }
        }

        leave (playerName) {
            var index = this._players.findIndex(i => i.name == playerName);

            if (index < 0) {
                throw new Error('Player not found!');
            }
            else {
                this._players.splice(index, 1);
            }
        }
    }

    /*
     * Service responsible for throwing the balls
     */
    class BowlingService {

        constructor() {
            this._rnd = null;
        }

        play() {
            return 10;
        }
    }

    /*
     * The home page controller
     */
    class MainController {

        constructor($scope, BowlingService) {
            $scope.game = new Game();
            $scope.newPlayer = '';

            this.bowlingService = BowlingService;
            this.$scope = $scope;
        }

        start () {
            this.$scope.game.start();
        }

        finish () {
            this.$scope.game.finish();
        }

        join () {
            try {
                this.$scope.game.join(this.$scope.newPlayer);
                this.$scope.newPlayer = '';
            }
            catch(e) {
                alert(e);
            }
        }

        leave (name) {
            this.$scope.game.leave(name);
        }

        throw () {
            alert('Throw');
        }
    }

    /*
     * Directive for detecting enter key
     */
    class EnterDirective {
        constructor() {
        }

        link (scope, element, attrs) {
            element.bind("keydown keypress", event => {
                if(event.which === 13) {
                    scope.$apply(() => scope.$eval(attrs.ngEnter));
                    event.preventDefault();
                }
            });
        }
    }

    // Application bootstrap
    angular
        .module('app', [])
        .directive('ngEnter', () => new EnterDirective)
        .service('BowlingService', BowlingService)
        .controller('MainController', MainController);
 })();