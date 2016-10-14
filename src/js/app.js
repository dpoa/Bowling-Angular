
(() => {
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

        get currentRoll() {
            return this._rolls.findIndex(i => i == null);
        }

        get isFinished() {
            return this.currentRoll < 0;
        }

        play (knocked) {
            let rollIndex = this.currentRoll;

            if (rollIndex > -1) {
                this._rolls[rollIndex] = knocked;
            }
        }
    }

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

        get currentFrame() {
            return this._frames.find(i => !i.isFinished);
        }

        get currentRoll() {
            console.log(this.isFinished);
            if (this.isFinished) {
                return null;
            }
            return this.currentFrame.currentRoll;
        }

        get isFinished() {
            return !this.currentFrame;
        }

        get score() {
            return 100;
        }
    }

    /*
     * Handle all information about the game
     */
    class Game {
        constructor() {
            this.reset();
        }

        get isStarted() {
            return this._isStarted;
        }

        get isFinished() {
            let pending = this._players.find(i => !i.isFinished);
            return pending == null;
        }

        get players() {
            return this._players;
        }

        get hasPlayers() {
            return this._players.length > 0;
        }

        get currentFrame() {
            return this.currentPlayer.currentFrame;
        }

        get currentPlayer() {
            return this._players[this._currentTurn];
        }

        start() {
            if (!this.hasPlayers) {
                throw new Error('There are no players!');
            }

            this._isStarted = true;
        }

        reset() {
            this._isStarted = false;
            this._players = [];
            this._isStarted = false;
            this._currentTurn = 0;
        }

        play(knocked) {
            if (this.isFinished) {
                throw new Error('The game has finished!');   
            }

            this.currentFrame.play(knocked);
            
            if (this._currentTurn < this._players.length - 1) {
                this._currentTurn++;
            }
            else {
                this._currentTurn = 0;
            }
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
            $scope.currentGame = new Game();
            $scope.newPlayer = '';

            this.bowlingService = BowlingService;
            this.$scope = $scope;
        }

        startGame () {
            try {
                this.$scope.currentGame.start();
            }
            catch(e) {
                alert(e.message);
            }
        }

        finishGame () {
            try {
                this.$scope.currentGame.reset();
            }
            catch(e) {
                alert(e.message);
            }
        }

        joinGame () {
            try {
                this.$scope.currentGame.join(this.$scope.newPlayer);
                this.$scope.newPlayer = '';
            }
            catch(e) {
                alert(e.message);
            }
        }

        leaveGame (name) {
            try {
                this.$scope.currentGame.leave(name);
            }
            catch(e) {
                alert(e.message);
            }
        }

        throwBall () {
            try {
                let knocked = this.bowlingService.throwBall(0);
                this.$scope.currentGame.play(knocked);
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

    /*
     * Filter for game status formatting
     */
    class GameStatusFilter {
        constructor(input) {
            this._isStarted = input;
        }

        format() {
            return this._isStarted ? 'In Progress' : 'Not Started';
        }

        static factory(input) {
            let filter = new GameStatusFilter(input);
            return filter.format();
        }
    }

    /*
     * Filter for array position formatting
     */
    class ArrayPositionFilter {
        constructor(input) {
            this._index = input;
        }

        format() {
            if (this._index === undefined) {
                return null;
            }
            
            return this._index + 1;
        }

        static factory(input) {
            let filter = new ArrayPositionFilter(input);
            return filter.format();
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
        .filter('gameStatus', () => GameStatusFilter.factory)
        .filter('arrayPosition', () => ArrayPositionFilter.factory)
        .directive('ngEnter', () => new EnterDirective)
        .service('BowlingService', BowlingService)
        .controller('MainController', MainController);
 })();