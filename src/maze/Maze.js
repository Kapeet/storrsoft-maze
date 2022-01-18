import {mazeGenerator} from "@miketmoore/maze-generator";
import {coordFactory} from "@miketmoore/maze-generator/dist/coord";

function getRandomCoordinate(max) {
    return Math.floor((Math.random() * max));
}

const NUMBER_OF_PRIZES = parseInt(process.env.REACT_APP_PRIZES);
class Maze {
    constructor(rows, columns) {
        this.grid = mazeGenerator({rows, columns});
        this.grid.carveCellWall(coordFactory(0, 0), 'west');
        this.grid.carveCellWall(coordFactory(rows - 1, columns - 1), 'east');
            
        this._rows = rows;
        this._cols = columns;
        this._start = coordFactory(0, 0);
        this._goal = coordFactory(rows - 1, columns - 1);
        this._prizes = [coordFactory(getRandomCoordinate(rows),getRandomCoordinate(columns))];
        // this._prizes = [1];
        // for (let i = 0; i < NUMBER_OF_PRIZES; i++)
        // {
        //     _prizes.push(coordFactory(getRandomCoordinate(rows),getRandomCoordinate(columns)));

        // }

    }

    get rows() {
        return this._rows;
    }

    get cols() {
        return this._cols;
    }

    get start() {
        return this._start;
    }

    get prizes() {
        return this._prizes;
    }

    get goal() {
        return this._goal;
    }

    getWalls(row, col) {
        return this.grid.getCell(coordFactory(row, col)).getWalls();
    }

    tryMove({row, col}, direction) {
        const [dy, dx] = {
            'north': [-1, 0],
            'east': [0, 1],
            'south': [1, 0],
            'west': [0, -1]
        }[direction];
        const walls = this.grid.getCell(coordFactory(row, col)).getWalls();
        if (walls[direction]) {
            return null;
        }
        const newRow = row + dy;
        const newCol = col + dx;
        if (newRow < 0 || newRow >= this.rows || newCol < 0 || newCol >= this.cols) {
            return null;
        }
        return coordFactory(newRow, newCol);
    }
}

export default Maze;
