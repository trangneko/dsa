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

class CaroGame {
    private board: number[][];
    private n: number;
    private m: number;
    private player: number;
    private opponent: number;
    private betAmount: number;
    private rl: any;

    constructor(n: number, m: number) {
        this.n = n;
        this.m = m;
        this.board = Array.from({ length: n }, () => Array(m).fill(0));
        this.player = 1;
        this.opponent = 2;
        this.betAmount = 1;
        this.rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    printBoard(): void {
        for (let row of this.board) {
            console.log(row.map((cell) => (cell === 0 ? "-" : cell === 1 ? "X" : "O")).join(" "));
        }
    }

    isMoveValid(x: number, y: number): boolean {
        return x >= 0 && x < this.n && y >= 0 && y < this.m && this.board[x][y] === 0;
    }

    isWin(x: number, y: number): boolean {
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1], // horizontal, vertical, diagonal (\), diagonal (/)
        ];

        for (let dir of directions) {
            let count = 1;

            for (let i = 1; i < 5; i++) {
                const newX = x + i * dir[0];
                const newY = y + i * dir[1];

                if (this.board[newX] && this.board[newX][newY] === this.player) {
                    count++;
                } else {
                    break;
                }
            }

            for (let i = 1; i < 5; i++) {
                const newX = x - i * dir[0];
                const newY = y - i * dir[1];

                if (this.board[newX] && this.board[newX][newY] === this.player) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    tick(x: number, y: number): void {
        this.board[x][y] = this.player;

        if (this.isWin(x, y)) {
            this.handleWin();
        } else if (this.isBoardFull()) {
            this.handleDraw();
        } else {
            this.player = this.player === 1 ? 2 : 1;
            console.log(`Player ${this.player} input move:`);
        }
    }

    requestDraw(): void {
        console.log(`Player ${this.player} is requesting a draw. Do you agree? (Type 'yes' or 'no')`);

        const drawHandler = (input: string) => {
            if (input.toLowerCase() === 'yes') {
                this.handleDraw();
                this.rl.removeListener('line', drawHandler);
                this.rl.removeListener('close', closeHandler);
                this.rl.close();
            } else if (input.toLowerCase() === 'no') {
                console.log(`Player ${this.opponent} does not agree to the draw.`);
                console.log(`Player ${this.player} input move:`);
                this.rl.removeListener('line', drawHandler);
                this.rl.removeListener('close', closeHandler);
            } else {
                console.log('Invalid response. Type "yes" or "no".');
            }
        };

        const closeHandler = () => {
            this.rl.removeListener('line', drawHandler);
            this.rl.removeListener('close', closeHandler);
        };

        this.rl.on('line', drawHandler);
        this.rl.on('close', closeHandler);
    }

    handleDraw(): void {
        console.log("The game is a draw!");
        this.player = 0;
        this.opponent = 0;
        this.printBoard();
        process.exit(0);
    }

    handleWin(): void {
        console.log(`Player ${this.player} wins!`);
        console.log(`Player ${this.opponent} loses ${this.betAmount} bet(s).`);
        console.log(`Player ${this.player} wins ${this.betAmount} bet(s).`);
        process.exit(0);
    }

    isBoardFull(): boolean {
        return this.board.every((row) => row.every((cell) => cell !== 0));
    }

    run(): void {
        this.rl.on('line', (input: string) => {
            if (input.toLowerCase() === 'draw') {
                this.requestDraw();
            } else {
                const [x, y] = input.split(' ').map(Number);

                if (this.isMoveValid(x, y)) {
                    this.tick(x, y);
                    this.printBoard();
                } else {
                    console.log('Invalid move');
                }
            }
        });

        console.log("Welcome to Caro Game!");
        console.log("Make moves by entering the coordinates (row column). For example: '0 0', '1 3', '4 2'.");
        console.log("Type 'draw' to propose a draw to your opponent.");
        console.log("Let's start the game!");
        this.printBoard();
        console.log(`Player ${this.player} input move:`);
    }
}

const caroGame = new CaroGame(10, 10);
caroGame.run();
