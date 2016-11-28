var game = {
    data: [],
    score: 0,
    state: 1,
    RUNNING: 1,
    GAME_OVER: 0,
    start: function() {
        this.data = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.score = 0;
        this.state = this.RUNNING;
        var div = document.getElementById("gameOver");
        //修改div的style.display
        div.style.display = "none";
        this.randomNum();
        this.randomNum();
        this.updateView();
    },
    // 是否满了
    isFull: function() {
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (this.data[row][col] == 0) {
                    return false;
                }
            }
        }
        return true;
    },
    // 产生随机数
    randomNum: function() {
        if (this.isFull()) {
            return;
        }
        while (true) {
            var row = Math.floor(Math.random() * 4);
            var col = Math.floor(Math.random() * 4);
            if (this.data[row][col] == 0) {
                this.data[row][col] =
                    Math.random() < 0.5 ? 2 : 4;
                break;
            }
        }
    },
    // 是否可左移
    canLeft: function() {
        //遍历每个元素(最左侧列除外)
        for (var row = 0; row < 4; row++) {
            for (var col = 1; col < 4; col++) {
                //    只要发现任意元素左侧值==0或
                //                 当前值==左侧值
                if (this.data[row][col] != 0) {
                    if (this.data[row][col - 1] == 0 ||
                        this.data[row][col - 1] == this.data[row][col]) {
                        return true;
                    }
                }
            }
        }
        //如果循环正常结束，
        return false;
    },
    moveLeft: function() {
        if (this.canLeft()) { //先判断能否左移
            for (var row = 0; row < 4; row++) {
                this.moveLeftInRow(row);
            }
            this.randomNum();
            this.updateView();
        }
    },
    moveLeftInRow: function(row) {
        for (var col = 0; col <= 2; col++) {
            var nextCol = this.getNextRight(row, col);
            if (nextCol == -1) {
                break;
            } else {
                if (this.data[row][col] == 0) {
                    this.data[row][col] =
                        this.data[row][nextCol];
                    this.data[row][nextCol] = 0;
                    col--;
                } else if (this.data[row][col] == this.data[row][nextCol]) {
                    this.data[row][col] *= 2;
                    this.score += this.data[row][col];
                    this.data[row][nextCol] = 0;
                }
            }
        }
    },
    getNextRight: function(row, col) {
        for (var i = col + 1; i < 4; i++) {
            if (this.data[row][i] != 0) {
                return i;
            }
        }
        return -1;
    },
    /*将游戏数据整体更新到页面上*/
    updateView: function() {
        //Step1：遍历二维数组中每个元素
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                //Step2：找到和当前元素对应的div
                //     拼div的id: c+row+col
                var div = document.getElementById("c" + row + col);
                //Step3：将当前元素的值放入div中
                //    div.innerHTML=?
                //    如果当前值==0，放入""
                //           否则放入当前值
                div.innerHTML = this.data[row][col] == 0 ? "" :
                    this.data[row][col];
                //Step4: 根据当前元素值修改div样式类
                //    div.className="类名";
                //    如果当前值==0,className="cell"
                //    否则className="cell n"+当前值
                div.className = this.data[row][col] == 0 ? "cell" :
                    "cell n" + this.data[row][col];
            }
        }
        /*将分数放入span*/
        var span = document.getElementById("score");
        span.innerHTML = this.score;
        /*判断游戏结束*/
        if (this.isGameOver()) {
            this.state = this.GAME_OVER;
            //显示游戏结束div
            //找到gameOverdiv
            var div = document.getElementById("gameOver");
            var finalScore =
                document.getElementById("finalScore");
            finalScore.innerHTML = this.score;
            //显示div
            div.style.display = "block";
        }
    },
    canRight: function() { /*判断能否右移*/
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 3; col++) {
                if (this.data[row][col] != 0) {
                    if (this.data[row][col + 1] == 0 ||
                        this.data[row][col] == this.data[row][col + 1]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    moveRight: function() { /*向右移动所有行*/
        if (this.canRight()) {
            for (var row = 0; row < 4; row++) {
                this.moveRightInRow(row);
            }
            this.randomNum();
            this.updateView();
        }
    },
    moveRightInRow: function(row) { /*右移当前行*/
        //从右向左遍历检查，(最左边元素除外)
        for (var col = 3; col > 0; col--) {
            var nextCol = this.getNextLeft(row, col);
            if (nextCol == -1) {
                break;
            } else {
                if (this.data[row][col] == 0) {
                    this.data[row][col] = this.data[row][nextCol];
                    this.data[row][nextCol] = 0;
                    col++;
                } else if (this.data[row][col] == this.data[row][nextCol]) {
                    this.data[row][col] *= 2;
                    this.score += this.data[row][col];
                    this.data[row][nextCol] = 0;
                }
            }
        }
    },
    getNextLeft: function(row, col) {
        //从当前位置向左，找下一个不为0的数
        for (var i = col - 1; i >= 0; i--) {
            if (this.data[row][i] != 0) {
                return i;
            }
        }
        return -1;
    },
    canUp: function() {
        for (var row = 1; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (this.data[row][col] != 0) {
                    if (this.data[row - 1][col] == 0 ||
                        this.data[row][col] == this.data[row - 1][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    moveUp: function() {
        if (this.canUp()) {
            for (var col = 0; col < 4; col++) {
                this.moveUpInCol(col);
            }
            this.randomNum();
            this.updateView();
        }
    },
    moveUpInCol: function(col) {
        for (var row = 0; row < 3; row++) {
            var nextRow = this.getNextDown(row, col);
            if (nextRow == -1) {
                break;
            } else {
                if (this.data[row][col] == 0) {
                    this.data[row][col] = this.data[nextRow][col];
                    this.data[nextRow][col] = 0;
                    row--;
                } else if (this.data[row][col] ==
                    this.data[nextRow][col]) {
                    this.data[row][col] *= 2;
                    this.score += this.data[row][col];
                    this.data[nextRow][col] = 0;
                }
            }
        }
    },
    getNextDown: function(row, col) {
        for (var i = row + 1; i < 4; i++) {
            if (this.data[i][col] != 0) {
                return i;
            }
        }
        return -1;
    },
    canDown: function() {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 4; col++) {
                if (this.data[row][col] != 0) {
                    if (this.data[row + 1][col] == 0 ||
                        this.data[row][col] == this.data[row + 1][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    moveDown: function() {
        if (this.canDown()) {
            for (var col = 0; col < 4; col++) {
                this.moveDownInCol(col);
            }
            this.randomNum();
            this.updateView();
        }
    },
    moveDownInCol: function(col) {
        for (var row = 3; row > 0; row--) {
            var nextRow = this.getNextUp(row, col);
            if (nextRow == -1) {
                break;
            } else {
                if (this.data[row][col] == 0) {
                    this.data[row][col] = this.data[nextRow][col];
                    this.data[nextRow][col] = 0;
                    row++;
                } else if (this.data[row][col] ==
                    this.data[nextRow][col]) {
                    this.data[row][col] *= 2;
                    this.score += this.data[row][col];
                    this.data[nextRow][col] = 0
                }
            }
        }
    },
    getNextUp: function(row, col) {
        for (var i = row - 1; i >= 0; i--) {
            if (this.data[i][col] != 0) {
                return i;
            }
        }
        return -1;
    },
    isGameOver: function() { /*判断游戏是否结束*/
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (this.data[row][col] == 0) {
                    return false;
                }
                if (col < 3) { /*检查右侧相邻*/
                    if (this.data[row][col] == this.data[row][col + 1]) {
                        return false;
                    }
                }
                if (row < 3) { /*检查下方相邻*/
                    if (this.data[row][col] == this.data[row + 1][col]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
window.onload = function() {
    game.start();
    document.onkeydown = function() {
        var event = window.event || arguments[0];
        if (game.state == game.RUNNING) {
            if (event.keyCode == 37) {
                game.moveLeft();
            } else if (event.keyCode == 39) {
                game.moveRight();
            } else if (event.keyCode == 38) {
                game.moveUp();
            } else if (event.keyCode == 40) {
                game.moveDown();
            }
        } else if (event.keyCode == 13) {
            game.start();
        }
    }
}
