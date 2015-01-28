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
            if (typeof val !== 'number' || Math.floor(val) !== val || val < 0 || val > BOARD_SIZE) {
                throw 'Value must be an integer between 0 and ' + BOARD_SIZE + ': ' + val;
            }
        }
        var _isGiven = !!val;
        var _val = val;

        function isGiven() {
            return _isGiven;
        }

        function getVal() {
            return _val;
        }

        function setVal(val) {
            if (isGiven()) throw 'Cannot set value on given square';
            this.val = val;
        }

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

    return {
        //TODO continue here
        board: board
    }

}