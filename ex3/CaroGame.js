// Trò chơi cờ caro
// Luật chơi
//   - Trên bàn cờ 10x10 ô vuông. Một người đi 1, một người đi 2.
//   - Khi đến lượt mình, người chơi phải tích vào một ô trên bàn cờ. Người chơi phải tìm cách tích đủ 5 ô theo chiều dọc hoặc chiều ngang hoặc đường chéo thì sẽ thắng.
// Luật hòa
//   - Trong quá trình chơi, khi một chời chơi xin hòa và đối phương đồng ý.
//   - Khi đã đi hết bàn cờ mà chưa phân thắng bại thì cũng coi như hòa.
// Kết quả
//   - Người thắng sẽ được nhận 1 cược từ người thua
//   - Người thua bị mất số tiền cược ban đầu ván chơi
//   - 2 người hòa nhau, mỗi người sẽ nhận về đúng số tiền mình cược ban đầu.
var CaroGame = /** @class */ (function () {
    function CaroGame(n, m) {
        this.n = n;
        this.m = m;
        this.board = Array.from({ length: n }, function () { return Array(m).fill(0); });
        this.player = 1;
        this.opponent = 2;
        this.betAmount = 1;
    }
    CaroGame.prototype.printBoard = function () {
        //implement this
        for (var _i = 0, _a = this.board; _i < _a.length; _i++) {
            var row = _a[_i];
            console.log(row.map(function (cell) { return (cell === 0 ? "-" : cell === 1 ? "X" : "O"); }).join(" "));
        }
    };
    CaroGame.prototype.isMoveValid = function (x, y) {
        //implement this
        return (x >= 0 && x < this.n && y >= 0 && y < this.m && this.board[x][y] === 0);
    };
    CaroGame.prototype.isWin = function (x, y) {
        //implement this
        var directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1], // horizontal, vertical, diagonal (\), diagonal (/)
        ];
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var dir = directions_1[_i];
            var count = 1; // count for the current direction
            for (var i = 1; i < 5; i++) {
                var newX = x + i * dir[0];
                var newY = y + i * dir[1];
                if (this.board[newX] && this.board[newX][newY] === this.player) {
                    count++;
                }
                else {
                    break;
                }
            }
            for (var i = 1; i < 5; i++) {
                var newX = x - i * dir[0];
                var newY = y - i * dir[1];
                if (this.board[newX] && this.board[newX][newY] === this.player) {
                    count++;
                }
                else {
                    break;
                }
            }
            if (count >= 5) {
                return true; // Player wins
            }
        }
        return false;
    };
    CaroGame.prototype.tick = function (x, y) {
        //implement this
        this.board[x][y] = this.player;
        if (this.isWin(x, y)) {
            this.handleWin();
        }
        else if (this.isBoardFull()) {
            this.handleDraw();
        }
        else {
            this.player = this.player === 1 ? 2 : 1; // switch player
            console.log("Player ".concat(this.player, " input move:"));
        }
    };
    CaroGame.prototype.requestDraw = function () {
        var _this = this;
        console.log("Player ".concat(this.player, " is requesting a draw. Do you agree? (Type 'yes' or 'no')"));
        var readline = require("readline");
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.on("line", function (input) {
            if (input.toLowerCase() === "yes") {
                _this.handleDraw();
            }
            else if (input.toLowerCase() === "no") {
                console.log("Player ".concat(_this.opponent, " does not agree to the draw."));
                rl.close();
            }
            else {
                console.log('Invalid response. Type "yes" or "no".');
            }
        });
    };
    CaroGame.prototype.handleDraw = function () {
        console.log("The game is a draw!");
        this.player = 0;
        this.opponent = 0;
        this.printBoard();
        process.exit(0);
    };
    CaroGame.prototype.handleWin = function () {
        console.log("Player ".concat(this.player, " wins!"));
        console.log("Player ".concat(this.opponent, " loses ").concat(this.betAmount, " bet(s)."));
        console.log("Player ".concat(this.player, " wins ").concat(this.betAmount, " bet(s)."));
        process.exit(0);
    };
    CaroGame.prototype.isBoardFull = function () {
        return this.board.every(function (row) { return row.every(function (cell) { return cell !== 0; }); });
    };
    CaroGame.prototype.run = function () {
        var _this = this;
        var readline = require("readline");
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.on('line', function (input) {
            if (input.toLowerCase() === 'draw') {
                _this.requestDraw();
            }
            else {
                var _a = input.split(' ').map(Number), x = _a[0], y = _a[1];
                if (_this.isMoveValid(x, y)) {
                    _this.tick(x, y);
                    var isEndGame = _this.isWin(x, y) || _this.isBoardFull();
                    if (isEndGame) {
                        _this.printBoard();
                        rl.close();
                    }
                    else {
                        console.log("Player ".concat(_this.player, " input move:"));
                    }
                }
                else {
                    console.log('Invalid move');
                }
            }
        });
        console.log("Welcome to Caro Game!");
        console.log("Make moves by entering the coordinates (row column). For example: '0 0', '1 3', '4 2'.");
        console.log("Type 'draw' to propose a draw to your opponent.");
        console.log("Let's start the game!");
        this.printBoard();
        console.log("Player ".concat(this.player, " input move:"));
    };
    return CaroGame;
}());
var caroGame = new CaroGame(10, 10);
caroGame.run();
