/**
    This is the model for a Sudoku board

    rawBoard - the intial board the user should solve, represented as a 2D array
*/
function SudokuModel(rawBoard) {

    /* TODO make good global constant object that's shared between client and server */
    var SQUARE_SIZE = 3;
    var NUM_SQUARES = 3;
    var BOARD_SIZE = SQUARE_SIZE * NUM_SQUARES;

    /**
        Model of each individual square. Each square keeps track of
        whether it is given, and the value set on it
    */
    function SudokuSquare(val) {

        if (val) {
            if (typeof val !== 'number' || Math.floor(val) !== val || val < 1 || val > BOARD_SIZE) {
                throw 'Value must be an integer between 0 and ' + BOARD_SIZE + ': ' + val;
            }
        }
        var _isGiven = !!val;
        var _val = val || 0; //undefined and null become 0

        /* Was this square given in the intial board? */
        function isGiven() {
            return _isGiven;
        }

        /* Get the value currently set on this square */
        function getVal() {
            return _val;
        }

        /* Set a value on this square, only if it is not given */
        function setVal(val) {
            if (isGiven()) {
                throw 'Cannot set values on given square';
            }
            _val = val;
        }

        /* Is there a value set on this square? */
        function hasVal() {
            return !!getVal(); //null, undefined, or 0 can all be non-values
        }

        return {
            isGiven: isGiven,
            getVal: getVal,
            setVal: setVal,
            hasVal: hasVal
        }
    }
    /* End SudokuSquare model */

    var board = rawBoard.map(function(rawRow) {
        return rawRow.map(function(rawVal) {
            return new SudokuSquare(rawVal);
        });
    });

    /* Private helper to get a square at the given index */
    function _getSquare(row, col) {
        return board[row][col];
    }

    /* Sets a value on a square */
    function setVal(row, col, val) {
        var sq = _getSquare(row, col);
        sq.setVal(val);
        sq.setIsValid(_validate(row, col));
        return sq.isValid();
    }

    /* Gets the value of a square */
    function getVal(row, col) {
        return _getSquare(row, col).getVal();
    }

    /* Determines if the square has a value */
    function hasVal(row, col) {
        return _getSquare(row, col).hasVal();
    }

    /* Was the square given in the initial board? */
    function isGiven(row, col) {
        return _getSquare(row, col).isGiven();
    }

    /*
        On-demand validation of a single square
        It doesn't check against the solution, just checks that there are no
            repeats in the row, column or sub-square

        We don't cache these values on the square because every value
        added/removed could affect the validity of other squares in its row,
        column and square. So we just validate whenever the user wants it
    */
    function isValid(row, col) {
        if (!hasVal(row, col)) {
            return false;
        }
        var val = getVal(row, col);

        //check col for repeats
        for (var iRow = 0; iRow < BOARD_SIZE; iRow++) {
            if (hasVal(iRow, col) && getVal(iRow, col) === val) {
                return false; //found a duplicate in the column
            }
        }

        //check row for repeats
        for (var iCol = 0; iCol < BOARD_SIZE; iCol++) {
            if (hasVal(row, iCol) && getVal(row, iCol) === val) {
                return false; //found a duplicate in the row
            }
        }

        //check the sub-square for repeats
        var subSquareRow = Math.floor(row / NUM_SQUARES);
        var subSquareCol = Math.floor(col / NUM_SQUARES);
        for (var iRow = subSquareRow; iRow < (subSquareRow + SQUARE_SIZE); iRow++) {
            for (var iCol = subSquareCol; iCol < (subSquareCol + SQUARE_SIZE); iCol++) {
                if (hasVal(iRow, iCol) && getVal(iRow, iCol) === val) {
                    return false;
                }
            }
        }

        return true; //no repeats found
    }

    /* Is the whole board valid? */
    function isBoardValid() {
        //TODO cache this value?

    }

    /* Is the whole board filled out? */
    function isBoardCompleted() {
        //TODO cache this value?

    }

    /*
        Helper for printing this out to the console
        Not really worried about this function's performance since it's just for dev help
    */
    function toString() {
        var str = "";

        for (var iRow = 0; iRow < BOARD_SIZE; iRow++) {
            if (!(iRow % SQUARE_SIZE)) {
                str += '------------------\n'; //print line before every third row
            }

            for (var iCol = 0; iCol < BOARD_SIZE; iCol++) {
                if (!(iCol % SQUARE_SIZE)) {
                    str += '|'; //print line every before third column
                } else {
                    str += ' ';
                }

                str += getVal(iRow, iCol);
            }
            str += '\n';
        }

        return str;
    }

    return {
        setVal: setVal,
        getVal: getVal,
        hasVal: hasVal,
        isValid: isValid,
        isGiven: isGiven,
        isBoardValid: isBoardValid,
        isBoardCompleted: isBoardCompleted,
        toString: toString
    }

}