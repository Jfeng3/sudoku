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

        val = val || 0; //convert it to a number
        if (typeof val !== 'number' || Math.floor(val) !== val || val < 1 || val > BOARD_SIZE) {
            throw 'Value must be an integer between 0 and ' + BOARD_SIZE + ': ' + val;
        }
        var _isGiven = !!val;
        var _val = val;
        var _isValid = _isGiven; //assume all given values are valid

        function isValid() {
            return _isValid;
        }

        function isGiven() {
            return _isGiven;
        }

        function getVal() {
            return _val;
        }

        function setVal(val) {
            if (isGiven()) {
                throw 'Cannot set values on given square';
            }
            _val = val;
        }

        function setIsValid(isValid) {
            if (isGiven()) {
                throw 'Cannot set values on given square';
            }
            _isValid = isValid;
        }

        function hasVal() {
            return !!getVal(); //null, undefined, or 0 can all be non-values
        }

        return {
            isValid: isValid,
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

    function _validate(row, col) {
        //TODO validate this square
    }

    function _getSquare(row, col) {
        return board[row][col];
    }

    function setVal(row, col, val) {
        var sq = _getSquare(row, col);
        sq.setVal(val);
        sq.setIsValid(_validate(row, col));
        return sq.isValid();
    }

    function getVal(row, col) {
        return _getSquare(row, col).getVal();
    }

    function isValid(row, col) {
        return _getSquare(row, col).isValid();
    }

    function isGiven(row, col) {
        return _getSquare(row, col).isGiven();
    }

    function isValid() {
        //TODO cache this value?

    }

    function isCompleted() {
        //TODO cache this value?

    }

    return {
        getSquare: getSquare
    }

}