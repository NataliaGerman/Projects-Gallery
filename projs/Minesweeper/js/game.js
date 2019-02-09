var gBoard;
var gLevel = { size: 4, mine: 2 }
var EMPTY = '';
var MINE = '💣';
var gEmpty = []; //used for opening range of cells
var FLAG = '🚩'
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0
}
var timer;
var gHintMode = false;
var gHintCount = 0;
var gScore = gLevel.mine;


function updateLevel(size, mine) {
  gLevel = { size: size, mine: mine };
  init(gLevel)
}

function init(gLevel) {
  renderBoard(gBoard);
  var elscore = document.querySelector('.score span');
  elscore.innerText = gScore;
}


function buildBoard(initI, initJ) {
  var board = [];
  for (var i = 0; i < gLevel.size; i++) {
    board.push([]);
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
      }
    }
  }
  for (var z = 0; z < gLevel.mine; z++) {
    var x = Math.floor(Math.random() * gLevel.size);
    var y = Math.floor(Math.random() * gLevel.size);
    if (board[x][y].isMine === false && (x !== initI && y !== initJ)) {
      board[x][y].isMine = true;
    } else {
      z--
    }
  }
  setMinesNegsCount(board);
  return board;
}


function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];
      if (cell.isMine === true) continue;
      var count = 0;
      for (var ii = i - 1; ii <= i + 1; ii++) {
        if (ii < 0 || ii >= board.length) continue;
        for (var jj = j - 1; jj <= j + 1; jj++) {
          if (jj < 0 || jj >= board.length) continue;
          if (ii === cell.i && jj === cell.j) continue;
          if (board[ii][jj].isMine === true) count++
        }
      }
      if (count !== 0) {
        board[i][j].minesAroundCount = count;
      }

    }
  }
}


function renderBoard() {
  var strHTML = '<table border="1"><tbody>'
  for (var i = 0; i < gLevel.size; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < gLevel.size; j++) {
      var className = `cell cell${i}-${j}`
      strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})" onmousedown="cellMarked(event,this,${i},${j})"> </td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
}



function cellClicked(elcell, i, j) {
  if (gGame.isOn === false && gGame.secsPassed !== 0) {
    return
  } else {
    if (gGame.isOn === false) {
      gGame.isOn = true;
      gBoard = buildBoard(i, j);
      var startTime = new Date();
      timer = setInterval(startTimer, 100, startTime)
    }
    if (gHintMode) {
      for (var ii = i - 1; ii <= i + 1; ii++) {
        if (ii < 0 || ii >= gBoard.length) continue;
        for (var jj = j - 1; jj <= j + 1; jj++) {
          if (jj < 0 || jj >= gBoard.length) continue;
          if (gBoard[ii][jj].isShown) continue;
          var elcellManually = document.querySelector(`.cell${ii}-${jj}`)
          renderCell({ i: ii, j: jj }, elcellManually)
        }
      }
      setTimeout(function () {
        gHintMode = false;
        var elmodal = document.querySelector('.modal');
        elmodal.style.display = 'none';
        var elbutton = document.querySelector(`.hint${gHintCount}`);
        elbutton.style.display = 'none';
        for (var ii = i - 1; ii <= i + 1; ii++) {
          if (ii < 0 || ii >= gBoard.length) continue;
          for (var jj = j - 1; jj <= j + 1; jj++) {
            if (jj < 0 || jj >= gBoard.length) continue;
            if (gBoard[ii][jj].isShown) continue;
            var elcellManually = document.querySelector(`.cell${ii}-${jj}`)
            elcellManually.innerHTML = EMPTY;
            elcellManually.style.backgroundColor = 'grey'
          }
        }
      }, 1000)
      return
    }

    if (gBoard[i][j].isMine === true) {
      for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
          if (gBoard[i][j].isMine === true) {
            var elcellManually = document.querySelector(`.cell${i}-${j}`)
            renderCell({ i: i, j: j }, elcellManually)
          }
        }
      }
      gameOver();
      var elimg = document.querySelector('.smiley');
      elimg.innerHTML = '<img src="img/sad.png">';
      return;
    }
    if ((gBoard[i][j].minesAroundCount === 0) && (gBoard[i][j].isMine === false)) {
      gEmpty.push({ i: i, j: j })
      openRengeOfCells(gEmpty)
    }
    renderCell({ i: i, j: j }, elcell)
    gBoard[i][j].isShown=true;
    if (checkGameOver()) {
      //console.log('check')
      var elimg = document.querySelector('.smiley');
      elimg.innerHTML ='<img src="img/happy.jpg">'
      gameOver()
    }
  }
}

function renderCell(location, elcell) {
  if (gBoard[location.i][location.j].isMine) var value = MINE;
  if (gBoard[location.i][location.j].isMine === false && gBoard[location.i][location.j].minesAroundCount === 0) var value = EMPTY;
  if (gBoard[location.i][location.j].isMine === false && gBoard[location.i][location.j].minesAroundCount !== 0) var value = gBoard[location.i][location.j].minesAroundCount;
   elcell.innerHTML = value;
  elcell.style.backgroundColor = 'white';
}

function cellMarked(ev, elcell, i, j) {
  if (ev.button === 2) {
    if (gBoard[i][j].isMarked === false && gScore > 0) {
      gBoard[i][j].isMarked = true;
      gScore--;
      var elscore = document.querySelector('.score span')
      elscore.innerText = gScore;
      elcell.innerHTML = FLAG;
      if (gBoard[i][j].isMine === true) {
        gGame.markedCount++
      }
      if (checkGameOver()) {
        gameOver()
      }
    } else if (gBoard[i][j].isMarked) {
      gBoard[i][j].isMarked = false;
      elcell.innerHTML = EMPTY;
      gScore++
      var elscore = document.querySelector('.score span')
      elscore.innerText = gScore;
      if (gBoard[i][j].isMine === true) {
        gGame.markedCount++
      }
    } else return;
  }
}


function openRengeOfCells(gEmpty) {

  while (gEmpty.length > 0) {

    var i = gEmpty[0].i;
    var j = gEmpty[0].j;
    gBoard[i][j].isShown = true;
    var elcellManually = document.querySelector(`.cell${i}-${j}`)
    renderCell({ i: i, j: j }, elcellManually)

    for (var ii = i - 1; ii <= i + 1; ii++) {
      if (ii < 0 || ii >= gBoard.length) continue;
      for (var jj = j - 1; jj <= j + 1; jj++) {
        if (jj < 0 || jj >= gBoard.length) continue;
        if (gBoard[ii][jj].isShown) continue;
        elcellManually = document.querySelector(`.cell${ii}-${jj}`)
        if (gBoard[ii][jj].minesAroundCount !== 0) {
          renderCell({ i: ii, j: jj }, elcellManually)
          gBoard[ii][jj].isShown = true;
        } else { gEmpty.push({ i: ii, j: jj }) }
      }
    } gEmpty.shift()
  }

}


function gameOver() {
  gGame.isOn = false;
  var elgameOver = document.querySelector('.gameOver');
  elgameOver.style.display = 'block';
  clearInterval(timer);
  timer = undefined;
}

function playAgain() {
  var elgameOver = document.querySelector('.gameOver');
  elgameOver.style.display = 'none';
  for (var i = 0; i < 3; i++) {
    var elbutton = document.querySelector(`.hint${i + 1}`);
    elbutton.style.display = '';
  }
  gHintCount = 0;
  gGame.secsPassed = 0;
  gScore = gLevel.mine;
  init();
  var eltimer = document.querySelector('.timer span')
  eltimer.innerText = '00';
  var elimg = document.querySelector('.smiley');
  elimg.innerHTML = '<img src="img/normal.jpg">'
}

function checkGameOver() {
  for (var i = 0; i < gLevel.size; i++) {
    for (var j = 0; j < gLevel.size; j++) {
      if (gBoard[i][j].isMine === true && gBoard[i][j].isMarked === false) return false;
      if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false) return false;
    }
  }  return true;
}

function startTimer(starTime) {
  var gameDuration = (Date.now() - starTime) / 1000;
  gGame.secsPassed = gameDuration;
  var eltimer = document.querySelector('.timer span')
  var timer = parseFloat(gameDuration).toFixed(2);
  eltimer.innerText = `${timer}`;
}

function hintMode(elbutton) {
  gHintCount++ ,
    gHintMode = true;
  var elmodal = document.querySelector('.modal');
  elmodal.style.display = 'block';
}

document.oncontextmenu = function () {
  return false;
}

