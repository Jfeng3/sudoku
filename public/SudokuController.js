/*
    This is the controller. It connets the model to the UI

    $ - pointer to JQuery
    $board - JQuery object pointing at the root div that contains the sudoku board
    rawBoard - the board data generated by the server
*/
function SudokuController($, $board, rawBoard) {

    /* TODO make good global constant object that's shared between client and server */
    var SQUARE_SIZE = 3;
    var NUM_SQUARES = 3;
    var BOARD_SIZE = SQUARE_SIZE * NUM_SQUARES;

    var model;

    function _to2dArray(arr, splitSize) {
        var array2d = [];
        while (arr.length) {
            array2d.push(arr.splice(0, splitSize));
        }
        return array2d;
    }

    /** Helper that gets the JQuery object pointing at the requested square */
    function _getSquare(row, col) {
        return $board.find('[data-sudo-row="' + row + '"][data-sudo-col="' + col + '"]');
    }

    /** Getter for the model to help with debugging */
    function getModel() {
        return model;
    }

    function start() {
        //set up the model, and subscribe to value change notifications
        model = new SudokuModel(_to2dArray(rawBoard, BOARD_SIZE), function(row, col, val) {
            //on change, update the view
            _getSquare(row, col).val(val);
        });

        //setup listeners for when the value changes in the UI
        $board.find('.square').bind('change', function(e) {
            var square = $(e.target);
            var row = parseInt(square.attr('data-sudo-row'));
            var col = parseInt(square.attr('data-sudo-col'));
            model.setVal(row, col, square.val());
        });

        return this;
    }

    return {
        getModel: getModel,
        start: start
    }
}