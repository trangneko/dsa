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

    constructor(n: number, m: number) {
        this.n = n;
        this.m = m;
        this.board = Array.from({ length: n }, () => Array(m).fill(0));
        this.player = 1;
        this.opponent = 2;
        this.betAmount = 1;
    }

    printBoard(): void {
        //implement this
        for (let row of this.board) {
            console.log(row.map(cell => (cell === 0 ? '-' : cell === 1 ? 'X' : 'O')).join(' '));
        }
    }

    isMoveValid(x: number, y: number): boolean {
        //implement this
        return x >= 0 && x < this.n && y >= 0 && y < this.m && this.board[x][y] === 0;
    }

    isWin(x: number, y: number): boolean {
        //implement this
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal (\), diagonal (/)
        ];

        for (let dir of directions) {
            let count = 1; // count for the current direction

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
                return true; // Player wins
            }
        }

        return false;
    }

    tick(x: number, y: number): void {
        //implement this
        this.board[x][y] = this.player;

        if (this.isWin(x, y)) {
            this.handleWin();
        } else if (this.isBoardFull()) {
            this.handleDraw();
        } else {
            this.player = this.player === 1 ? 2 : 1; // switch player
            console.log(`Player ${this.player} input move:`);
        }
    }

    handleDraw(): void {
        console.log('The game is a draw!');
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
        return this.board.every(row => row.every(cell => cell !== 0));
    }


    run(): void {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', (input: string) => {
            const [x, y] = input.split(' ').map(Number);

            if (this.isMoveValid(x, y)) {
                this.tick(x, y);
                this.printBoard();
            } else {
                console.log('Invalid move');
            }
        });

        this.printBoard();
        console.log(`Player ${this.player} input move:`);
    }
}

const caroGame = new CaroGame(10, 10);
caroGame.run();

