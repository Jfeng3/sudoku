/*
    This is the controller
*/
function SudokuController($, $board, rawBoard) {

    /* TODO make good global constant object that's shared between client and server */
    var SQUARE_SIZE = 3;
    var NUM_SQUARES = 3;
    var BOARD_SIZE = SQUARE_SIZE * NUM_SQUARES;

    var _boardModel = new SudokuModel(_to2dArray(rawBoard, BOARD_SIZE));

    function _to2dArray(arr, splitSize) {
        var array2d = [];
        while (arr.length) {
            array2d.push(arr.splice(0, splitSize));
        }
        return array2d;
    }

    function start() {
        //TODO hook up some data binding stuff with the view
        console.log(_boardModel);
    }

    return {
        //TODO continue here
        start: start
    }
}