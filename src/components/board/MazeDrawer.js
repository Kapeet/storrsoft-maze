class MazeDrawer {
    constructor(canvas, maze, logo, currentCell, goal = null, prizes = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.maze = maze;
        this.logo = logo;
        this.currentCell = currentCell;
        this.goal = goal;
        this.prizes = prizes;
        
        this.cellWidth = Math.floor(canvas.width / maze.cols);
        this.cellHeight = Math.floor(canvas.height / maze.rows);
        this.xOffset = Math.floor((canvas.width - maze.cols * this.cellWidth) / 2);
    }

    calculateCellRect({row, col}) {
        return new DOMRect(this.cellWidth * col + this.xOffset, this.cellHeight * row, this.cellWidth, this.cellHeight);
    }

    draw() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawWalls();

        this.drawLogo();

        this.drawGoal();

        this.drawPrizes();
    }

    drawWalls() {
        this.ctx.strokeStyle = 'white';

        for (let row = 0; row < this.maze.rows; row++) {
            for (let col = 0; col < this.maze.cols; col++) {
                const cellRect = this.calculateCellRect({row, col});
                const walls = this.maze.getWalls(row, col);
                if (row === 0 && walls['north']) {
                    this.drawLine(cellRect.left, cellRect.top, cellRect.width, 0);
                }
                if (walls['east']) {
                    this.drawLine(cellRect.right, cellRect.top, 0, cellRect.height);
                }
                if (walls['south']) {
                    this.drawLine(cellRect.left, cellRect.bottom, cellRect.width, 0);
                }
                if (col === 0 && walls['west']) {
                    this.drawLine(cellRect.left, cellRect.top, 0, cellRect.height);
                }
            }
        }
    }

    drawLogo() {
        if (!this.logo) {
            return;
        }
        const logoSize = Math.min(this.cellWidth, this.cellHeight) * 0.75;
        const rect = this.calculateCellRect(this.currentCell);
        this.ctx.drawImage(this.logo, rect.left + (rect.width - logoSize) / 2, rect.top + (rect.height - logoSize) / 2, logoSize, logoSize);
    }

    drawPrizes() {
        console.log(this.prizes);
        if (!this.prizes) {
            console.log('prizes are null!');
            return;
        }
        // let prizeSize, rect;
        this.prizes.coords.map((coordinates, index) => {
            const prizeSize = Math.min(this.cellWidth, this.cellHeight) * 0.75;
            const rect = this.calculateCellRect(coordinates);
            if (index % 2 == 0)
            {
                this.ctx.drawImage(this.prizes.img[0],  rect.left + (rect.width - prizeSize) / 2, rect.top + (rect.height - prizeSize) / 2, prizeSize, prizeSize);
            }
            else
            {
                this.ctx.drawImage(this.prizes.img[1],  rect.left + (rect.width - prizeSize) / 2, rect.top + (rect.height - prizeSize) / 2, prizeSize, prizeSize);
            }
        })
        
    }

    drawLine(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.stroke();
    }

    drawGoal() {
        if (!this.goal) {
            return;
        }

        const rect = this.calculateCellRect(this.goal);
        this.ctx.font = `${rect.height * 0.75}px "Joystix"`;
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'yellow';
        const textWidth = Math.min(this.ctx.measureText('G').width, rect.width * 0.75);
        this.ctx.fillText('G', rect.left + (rect.width - textWidth) / 2, rect.top + rect.height * 0.125, textWidth);
    }
}

export default MazeDrawer;
