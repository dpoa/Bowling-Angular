
(() => {
    /*
     * The player
     */
    class Player {
        constructor(name, position) {
            const frameCount = 10;

            this._position = position || 0;
            this._name = name;
            this._frames = [];
            
            for (var i = 0; i < frameCount; i++) {
                var frame = new Frame(i + 1, i == frameCount - 1);
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
        constructor(position, isLast) {
            this._position = position;
            this._rolls = [ null, null ];

            if (isLast) {
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

        get isFinished() {
            return this._rolls.find(i => i == null).length == 0;
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
            if (!this.hasPlayers) {
                throw new Error('There are no players!');
            }

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

        constructor(config) {
            this._config = config;
        }

        throwBall(knocked) {
            let max = config.pinCount - knocked;
            let result = Math.floor(Math.random() * max) + 1;
            return result;
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
            try {
                this.$scope.game.start();
            }
            catch(e) {
                alert(e.message);
            }
        }

        finish () {
            try {
                this.$scope.game.finish();
            }
            catch(e) {
                alert(e.message);
            }
        }

        join () {
            try {
                this.$scope.game.join(this.$scope.newPlayer);
                this.$scope.newPlayer = '';
            }
            catch(e) {
                alert(e.message);
            }
        }

        leave (name) {
            try {
                this.$scope.game.leave(name);
            }
            catch(e) {
                alert(e.message);
            }
        }

        throw () {
            try {
                let result = this.bowlingService.throwBall(0);
            }
            catch(e) {
                alert(e.message);
            }
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

    // Application constants
    var config = {
        frameCount: 10,
        pinCount: 10
    };

    // Application bootstrap
    angular
        .module('app', [])
        .constant('config', config)
        .directive('ngEnter', () => new EnterDirective)
        .service('BowlingService', BowlingService)
        .controller('MainController', MainController);
 })();