/**
    This is the model for a Sudoku board

    rawBoard - the intial board the user should solve, represented as a 2D array
    onChange - callback when a value changes, in the form:
                function(model, row, col, val) {}
*/
function SudokuModel(rawBoard, onChange) {

    /* TODO make good global constant object that's shared between client and server */
    var SQUARE_SIZE = 3;
    var NUM_SQUARES = 3;
    var BOARD_SIZE = SQUARE_SIZE * NUM_SQUARES;

    /**
        Model of each individual square. Each square keeps track of
        whether it is given, and the value set on it
    */
    function SudokuSquare(row, col, val) {

        var _val;
        var _isGiven = !!val; //this has to be after the initial setVal()
        _setVal(val, false);

        /* Was this square given in the intial board? */
        function isGiven() {
            return _isGiven;
        }

        /* Get the value currently set on this square */
        function getVal() {
            return _val;
        }

        /* Set a value on this square, only if it is not given. If it is given,
            we call onChange to make sure subscribers know the value hasn't actually changed

            The only validation that happens on inputs is making sure they are numbers
            
            Returns an error message to display, if applicable
        */
        function setVal(val) {
            return _setVal(val, true);
        }
        
        /**
            Same as the public setVal(), but for internal use. It allows skipping the
            check of whether the square is given or not
        */
        function _setVal(val, checkGiven) {
            if (typeof val === 'string') {
                // TODO: also remove zero-width characters. This was a problem with BACKSPACE before it was handled separately
                val = val.trim();
            }
            val = parseInt(val || 0); //convert undefined, null and empty string to 0
            var oldVal = getVal();

            if (isNaN(val)) {
                return 'Value entered must be a number';
            } else if (checkGiven && isGiven()) {
                return 'Cannot change the values of given squares';
            } else {
                _val = val;
            }
        }

        /* Is there a value set on this square? */
        function hasVal() {
            return !!getVal(); //null, undefined, or 0 can all be non-values
        }

        //exported methods
        this.isGiven = isGiven;
        this.getVal = getVal;
        this.setVal = setVal;
        this.hasVal = hasVal;
    }
    /* End SudokuSquare model */

    var numFilled; //the number of squares filled
    var board;
    var validities; //cache of the validity of each square

    function init() {
        var model = this;
        board = rawBoard.map(function(rawRow, row) {
            return rawRow.map(function(rawVal, col) {
                return new SudokuSquare(row, col, rawVal);
            });
        });
        _clearValidities();

        //fire change handlers, calculate how many are filled
        numFilled = 0;
        for (var iRow = 0; iRow < BOARD_SIZE; iRow++) {
            for (var iCol = 0; iCol < BOARD_SIZE; iCol++) {
                if (this.hasVal(iRow, iCol)) {
                    numFilled++;
                }
                onChange(this, null, iRow, iCol, this.getVal(iRow, iCol));
            }
        }
    }
    
    /** Clears the validity cache */
    function _clearValidities() {
        //use the board.map so we know the cache is the same size array
        validities = board.map(function(rawRow, row) {
            return rawRow.map(function(rawVal, col) {
                return null; //clear the whole cache
            });
        });
    }

    /* Private helper to get a square at the given index */
    function _getSquare(row, col) {
        return board[row][col];
    }

    /* Sets a value on a square */
    function setVal(row, col, val) {
        var square = _getSquare(row, col);
        var hadVal = square.hasVal() ? 1 : 0;
        var err = square.setVal(val);
        var hasVal = square.hasVal() ? 1 : 0;
        
        //increment/decrement the number of filled squares
        var filledChange = (hasVal - hadVal);
        numFilled += filledChange;
        
        //clear the validity cache
        //  we could maybe be smarter about this and only do it when the value *actually* changes
        _clearValidities();

        //even if we don't change the value, notify subscribers so they're in sync
        onChange(this, err, row, col, square.getVal());
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
        
        Note about performance:
            This method is not extremely performant, since it iterates through the board so much
            I looked into having a method that iterates through every row/colum/sub-square to find duplicates
            but it ended up being nearly as inefficient because I had to keep track of not only *whether* each
            section has duplictes, but also where those duplicates were. This function is way easier to understand
            
            If the board has N squares total, each row/column/sub-square has sqrt(N) squares. For any particular input
            it will go through one row, column and sub-square. So it is O(sqrt(N)), or in terms of my variables
            O(BOARD_SIZE)
        
        The results of this method are cached, and the cache is cleared for all squares when there is any single change
        to the board
    */
    function isValid(row, col) {
        var cache = validities[row][col];
        
        if (cache === null) { //must do a === for null, since these are booleans
            cache = _isValidNoCache(row,col); //calculate the value and store it
            validities[row][col] = cache;
        }
        
        return cache;
    }
    
    /** The uncached version of isValid(row,col) */
    function _isValidNoCache(row, col) {
        if (!hasVal(row, col)) {
            /*
                Consider empty cells to be "valid", so when the user validates the board
                they don't get a bunch of red cells

                This is important to remember when validating the whole board
            */
            return true;
        }
        var val = getVal(row, col);

        if ((typeof val !== 'number') || val < 0 || val > BOARD_SIZE) {
            return false;
        }

        //check col for repeats
        for (var iRow = 0; iRow < BOARD_SIZE; iRow++) {
            if (iRow !== row && hasVal(iRow, col) && getVal(iRow, col) === val) {
                return false; //found a duplicate in the column
            }
        }

        //check row for repeats
        for (var iCol = 0; iCol < BOARD_SIZE; iCol++) {
            if (iCol !== col && hasVal(row, iCol) && getVal(row, iCol) === val) {
                return false; //found a duplicate in the row
            }
        }

        //check the sub-square for repeats
        var subSquareRow = row - (row % NUM_SQUARES);
        var subSquareCol = col - (col % NUM_SQUARES);
        for (var iRow = subSquareRow; iRow < (subSquareRow + SQUARE_SIZE); iRow++) {
            if (iRow === row) continue;
            for (var iCol = subSquareCol; iCol < (subSquareCol + SQUARE_SIZE); iCol++) {
                if (iCol !== col && hasVal(iRow, iCol) && getVal(iRow, iCol) === val) {
                    return false;
                }
            }
        }

        return true; //no repeats found
    }
    
    /*
        Is the whole board valid?
        
        BE CAUTIOUS using the function... it's not super efficient since it goes through every single square and
        checks validity
        
        If there are N squares in the board, this method calls isValid(row,col) on each one, so this fucntion is
        O(N * sqrt(N)), or in terms of my variables, O(BOARD_SIZE^3). Use it sparingly
        
        The results of each individual square are cached, so subsequent calls to this won't be a huge hit. But any
        change to the board will invalidate the cache
    */
    function isBoardValid() {
        for (var iRow = 0; iRow < BOARD_SIZE; iRow++) {
            for (var iCol = 0; iCol < BOARD_SIZE; iCol++) {
                if (!isValid(iRow, iCol)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    /* Is the whole board filled out? */
    function isBoardCompleted() {
        return (numFilled === (BOARD_SIZE*BOARD_SIZE));
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

    //exports
    this.init = init;
    this.setVal = setVal;
    this.getVal = getVal;
    this.hasVal = hasVal;
    this.isValid = isValid;
    this.isGiven = isGiven;
    this.isBoardValid = isBoardValid;
    this.isBoardCompleted = isBoardCompleted;
    this.toString = toString;

}
