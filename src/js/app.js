
(() => {
    /*
     * The game frame
     */
    class Roll {
        constructor(frame, position, value) {
            this._position = position;
            this._frame = frame;
            this._value = value;
        }

        get position() {
            return this._position;
        }

        get frame() {
            return this._frame;
        }

        get isFinished() {
            return this._value != null;
        }

        get value() {
            return this._value;
        }

        set value(value) {
            return this._value = value;
        }
    }

    /*
     * The game frame
     */
    class Frame {
        constructor(position) {
            const frameCount = 10;

            this._position = position;
            this._sum = 0;
            this._bonus = 0;
            this._score = 0;
            this._rolls = [];

            var rollCount = position < frameCount ? 2 : 3;

            for (var i = 1; i <= rollCount; i++) {
                var roll = new Roll(this, i, null);
                this._rolls.push(roll);
            }
        }

        get position() {
            return this._position;
        }

        get rolls() {
            return this._rolls;
        }

        get previousRoll() {
            var current = this.currentRoll;
            
            if (current != null && current.position > 1) {
                return this._rolls[current.position - 2];
            }

            return null;
        }

        get currentRoll() {
            return this._rolls.find(i => !i.isFinished);
        }

        get isFinished() {
            return this.currentRoll == null;
        }

        get isStrike() {
            return this._rolls[0].value == 10;
        }

        get isSpare() {
            return this._rolls[0].value < 10 && this.isMaxScore;
        }

        get isMaxScore() {
            return this.sum == 10;
        }

        get sum() {
            return this._sum;
        }

        set sum(value) {
            this._sum = value;
        }

        get bonus() {
            return this._bonus;
        }

        set bonus(value) {
            this._bonus = value;
        }

        get score() {
            return this._score;
        }

        set score(value) {
            this._score = value;
        }

        play (knocked) {
            const pinCount = 10;

            var roll = this.currentRoll;
            var sum = 0;
            
            if (roll === undefined || roll == null) {
                return;
            }

            roll.value = knocked;

            // Strike
            if (knocked == pinCount && roll.position == 1) {
                for (let roll of this._rolls) {
                    if (roll.value == null) {
                        roll.value = 0;
                    }
                }
            }

            for (let roll of this._rolls) {
                sum += roll.value || 0;
            }

            this.sum = sum;
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
            this._isStarted = 0;
            this._score = 0;
            
            for (var i = 1; i <= frameCount; i++) {
                var frame = new Frame(i);
                this._frames.push(frame);
            }
        }

        get position() {
            return this._position;
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
            return this._frames.find(f => !f.isFinished);
        }

        get currentRoll() {
            if (!this.currentFrame) {
                return null;
            }

            return this.currentFrame.currentRoll;
        }

        get isFinished() {
            return this.currentFrame == null;
        }

        get score() {
            return this._score;
        }

        set score(value) {
            this._score = value;
        }

        play (knocked) {
            this.currentFrame.play(knocked);
            this.calc();
        }

        calc() {
            var sum = 0;
            var frames = this._frames;

            for (var i = 0; i < frames.length; i++) {
                var bonus = 0;    
                var frame = frames[i];
                
                if (frame.isFinished) {
                    
                    if (frame.isMaxScore) {
                        var firstFrame = frames.find(i => i.position == frame.position + 1);
                        var secondFrame = frames.find(i => i.position == frame.position + 2);
                        
                        var firstValue = 0;
                        var secondValue = 0;

                        if (firstFrame != null) {
                            firstValue = firstFrame.rolls[0].value || 0;
                        
                            if (frame.isStrike) {
                                if (!firstFrame.isStrike) {
                                    secondValue = firstFrame.rolls[1].value || 0;
                                }
                                else if (secondFrame != null) {
                                    secondValue = secondFrame.rolls[0].value || 0;
                                }
                            }
                        }

                        frame.bonus = firstValue + secondValue;
                    }

                    sum += frame.sum + frame.bonus;

                    frame.score = sum;
                }
            }

            this.score = sum;
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

        get currentPlayer() {
            if (!this.hasPlayers) {
                return null;
            }

            return this._players[this._currentTurn];
        }

        get currentFrame() {
            if (!this.currentPlayer) {
                return null;
            }

            return this.currentPlayer.currentFrame;
        }

        get currentRoll() {
            if (!this.currentFrame) {
                return null;
            }

            return this.currentFrame.currentRoll;
        }

        get previousValue() {
            if (!this.currentFrame || !this.currentFrame.previousRoll) {
                return 0;
            }

            return this.currentFrame.previousRoll.value
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

        play (knocked) {
            if (this.isFinished) {
                throw new Error('The game has finished!');   
            }

            this.currentPlayer.play(knocked);
            
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

            if (knocked == config.pinCount) {
                return 0;
            }

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
            $scope.knocked = 0;

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
                let previous = this.$scope.currentGame.previousValue;
                let value = this.bowlingService.throwBall(previous);

                this.$scope.knocked = value;
                this.$scope.currentGame.play(value);
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
     * Filter for roll score formatting
     */
    class RollScoreFilter {
        constructor(input) {
            this._roll = input;
        }

        format() {
            const pinCount = 10;

            var roll = this._roll;
            var value = roll.value;

            if (value === undefined || value == null || value <= 0) {
                return "-";
            }

            if (roll.frame.isStrike) {
                return "X";
            }

            if (roll.position == 2 && roll.frame.isSpare) {
                return "/";
            }
            
            return value;
        }

        static factory(input) {
            let filter = new RollScoreFilter(input);
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
        .filter('rollScore', () => RollScoreFilter.factory)
        .directive('ngEnter', () => new EnterDirective)
        .service('BowlingService', BowlingService)
        .controller('MainController', MainController);
 })();