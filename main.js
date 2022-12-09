var canvas = document.getElementById("gridCanvas");
var ctx = canvas.getContext("2d");

var canvasGrid = document.getElementById("gridCanvas2");
var ctxg = canvas.getContext("2d");

var canvasGrid = document.getElementById("gridCanvas3");
var ctxf = canvas.getContext("2d");

var mainCanvas = document.getElementById("playCanvas");
var pctx = mainCanvas.getContext("2d");


var canvasWidth = 500;
var canvasHeight = canvasWidth;
var canvasGeometry = canvasWidth;

var gridWidth = canvasWidth;
var gridHeight = gridWidth;
var gridGeometry = gridWidth;

var flagWidth = canvasWidth;
var flagHeight = flagWidth;
var flagGeometry = flagWidth;

var mainWidth = canvasWidth;
var mainHeight = flagWidth;
var mainGeometry = flagWidth;


var xStartPos = null, yStartPos = null;
var xEndPos = null, yEndPos = null;
var limit = false;

var cCell = 0;

 
canvas.width = canvasWidth; 
canvas.height = canvasHeight;

mainCanvas.width = canvasWidth; 
mainCanvas.height = canvasHeight;




var playerPos = [];
var cPlayer = [];

var flags = [];
var node = [];
var openNode = [];
var borderNode = [];
var lineNode = [];
var wallCount = []
var wallValue = [];
var thread = [];


var moves = [];

var collision = [];
var randomizer = 0;

var lockMech = false;
var savedX = null, savedY = null;

var pPosX = null;
var pPosY = null;

var distanceBetweenNodes = 50;
var nodeID = 0;


var valueNode = ((canvasGeometry / distanceBetweenNodes) + 1) * ((canvasGeometry / distanceBetweenNodes) + 1);
function assignBorder() {
  for(let x = 0; x < canvasWidth+1; x = distanceBetweenNodes + x) {
    for(let y = 0; y < canvasHeight+1; y = distanceBetweenNodes + y) {
      if(x !== 0 && x !== canvasWidth) {
        if(y !== 0 && y !== canvasHeight) {
          lineNode.push('open');
          node.push([nodeID, [y, x, 'open', 0]]);
          openNode.push([nodeID, [y, x, 'open', 0]]);
          
          ctx.beginPath();
          ctx.lineWidth = 4;
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fill();
          
          nodeID++;
        } else {
          lineNode.push('border');
          node.push([nodeID, [y, x, 'border', 0, 'none']]);
          borderNode.push([nodeID, [y, x, 'border', 0, 'none']]);
          nodeID++;
        }
      } else {
        lineNode.push('border');
        node.push([nodeID, [y, x, 'border', 0, 'none']]);
        borderNode.push([nodeID, [y, x, 'border', 0, 'none']]);
        nodeID++;
      }
    }
  }
}
assignBorder();


function sortDirArray() {
  for(let spots = 0; spots < 4; spots++) {
    switch(spots) {
      case 0:
        thread.push([spots+1, 0, 'right', []]);
        break;
      case 1:
        thread.push([spots+1, 0, 'left', []]);
        break;
      case 2:
        thread.push([spots+1, 0, 'down', []]);
        break;
      case 3:
        thread.push([spots+1, 0, 'top', []]);
        break;
    }
  }
  for(let spots = 0; spots < 3; spots++) {
    switch(spots) {
      case 0:
        flags.push(['start', 0, 0]);
        break;
      case 1:
        flags.push(['end', canvasWidth, canvasHeight]);
        break;
      case 2:
        flags.push(['position', distanceBetweenNodes / 2, distanceBetweenNodes / 2]);
        break;
    }
  }
}
sortDirArray();


function drawNodeBorders(input) {
  let inter = null;
  for(let i = 0; i < node.length-1; i++) {
    randomizer = Math.floor(Math.random() * 200);
    xInter = node[i][1][1];
    yInter = node[i][1][0];
    if(node[i][1][2] !== 'border') {
      ctx.beginPath();
      ctx.moveTo(node[i][1][1], node[i][1][0]);
      if(randomizer < 201 && randomizer > 140) {
        thread[0][3].push(i);
        savedX = node[i][1][1] + distanceBetweenNodes;
        savedY = node[i][1][0];
        node[i][1][3] = node[i][1][3] + 1;
        ctx.lineTo(node[i][1][1] + distanceBetweenNodes, node[i][1][0]);
        collision.push(['side', [xInter, yInter], [savedX, savedY]]);
        wallCount.push([i, node[i][1][1], node[i][1][0], 'right']);
        node[i][1].push('right');
        lockmech = true;
        find(savedX, savedY);
        thread[0][1]++
      } else if(randomizer < 141 && randomizer > 95) {
        thread[1][3].push(i);
        savedX = node[i][1][1];
        savedY = node[i][1][0] + distanceBetweenNodes;
        node[i][1][3] = node[i][1][3] + 1;
        ctx.lineTo(node[i][1][1], node[i][1][0] + distanceBetweenNodes);
        collision.push(['straight', [xInter, yInter], [savedX, savedY]]);
        wallCount.push([i, node[i][1][1], node[i][1][0], 'down']);
        node[i][1].push('down');
        lockmech = true;
        find(savedX, savedY);
        thread[1][1]++
      } else if(randomizer < 96 && randomizer > 50) {
        savedX = node[i][1][1] - distanceBetweenNodes;
        savedY = node[i][1][0];
        node[i][1][3] = node[i][1][3] + 1;
        thread[2][3].push(i);
        ctx.lineTo(node[i][1][1] - distanceBetweenNodes, node[i][1][0]);
        collision.push(['side', [xInter, yInter], [savedX, savedY]]);
        wallCount.push([i, node[i][1][1], node[i][1][0], 'left']);
        node[i][1].push('left');
        lockmech = true;
        find(savedX, savedY);
        thread[2][1]++
      } else {
        savedX = node[i][1][1];
        savedY = node[i][1][0] - distanceBetweenNodes;
        node[i][1][3] = node[i][1][3] + 1;
        thread[3][3].push(i);
        ctx.lineTo(node[i][1][1], node[i][1][0] - distanceBetweenNodes);
        collision.push(['straight', [xInter, yInter], [savedX, savedY]]);
        wallCount.push([i, node[i][1][1], node[i][1][0], 'up']);
        node[i][1].push('up');
        lockmech = true;
        find(savedX, savedY);
        thread[3][1]++
      }
      ctx.stroke();
    }
  }
}
drawNodeBorders();


function find(x, y) {
  if(lockmech == true) {
    let funct = 0
    while(funct < node.length - 1) {
      if(x == node[funct][1][1] && y == node[funct][1][0]) {
        node[funct][1][3] = node[funct][1][3] + 1;
        lockmech = false;
        break;
      } else {
        funct++
      }
    }
  }
}


function grid() {
  ctxg.beginPath();
  ctxg.globalAlpha = 0.2;
  ctxg.lineWidth = 0.1;
  ctxf.beginPath();
  for(let grid = 0; grid < canvasWidth; grid = grid + distanceBetweenNodes) {
    for(let grid2 = 0; grid2 < canvasHeight; grid2 = grid2 + distanceBetweenNodes) {
      if(grid !== canvasWidth) {
        ctxg.moveTo(grid, 0);
        ctxg.lineTo(grid, canvasWidth);
        if(grid2 !== canvasHeight) {
          ctxg.moveTo(0, grid2);
          ctxg.lineTo(canvasHeight, grid2);
        }
      }
      if(grid == flags[0][1] && grid2 == flags[0][2]) {
        ctxf.fillStyle = '#fc120a';
        xStartPos = grid + (distanceBetweenNodes / 2);
        yStartPos = grid2 + (distanceBetweenNodes / 2);
        ctxf.fillRect(grid, grid2, distanceBetweenNodes, distanceBetweenNodes);
      }
      if(grid == flags[1][1]-distanceBetweenNodes && grid2 == flags[1][2]-distanceBetweenNodes) {
        ctxf.fillStyle = '#0d7d00';
        xEndPos = grid;
        yEndPos = grid2;
        ctxf.fillRect(grid, grid2, distanceBetweenNodes, distanceBetweenNodes);
      }
    }
  }
  ctxg.stroke();

}
grid();


function assertCells(){
  let cells = 0
  let initial = 0;
  let equ1 = (canvasGeometry / distanceBetweenNodes * canvasGeometry / distanceBetweenNodes);
  for(; cells < equ1+initial;){
    let xStart = node[cells][1][1]+(distanceBetweenNodes / 2);
    let yStart = node[cells][1][0]+(distanceBetweenNodes / 2);
    if(cells == 0) {
      moves.push([cells,[xStart, yStart]]);
      cells++
    } else {
      if(node[cells][1][1]+(distanceBetweenNodes/2)<canvasGeometry) {
        if(node[cells][1][0]+(distanceBetweenNodes/2)<canvasGeometry) {
          moves.push([cells-initial,[xStart,yStart]]);
          cells++
        } else {
          cells++;
          initial++
        }
      } else {
        cells++;
        initial++
      }
    }
  }
}
assertCells();


function character(x, y) {
  pctx.clearRect(0, 0, playCanvas.width, playCanvas.height);

  pctx.beginPath();
  pctx.fillStyle = '#323328';
  pctx.globalAlpha = 1;
  pctx.arc(x, y, distanceBetweenNodes*0.23, 0, 2 * Math.PI);
  pctx.fill();

  pctx.beginPath();
  pctx.fillStyle = '#6e5b27';
  pctx.globalAlpha = 1;
  pctx.arc(x, y, distanceBetweenNodes*0.36, 0, 2 * Math.PI);
  pctx.fill();
}

function collisionCheck() {
  for(let check = 0; check < collision.length-1; check++) {

  }
}


var directions = {
  right: function() {
    if(limit == true) {
      cCell = cCell + canvasGeometry / distanceBetweenNodes;
      for(let search = 0; search < moves.length; search++) {
         if(cCell == search) {
          /*if(moves[search][1][0]>flags[1][1]|| moves[search][1][1]>flags[1][2]||moves[search][1][0]<0||moves[search][1][1]<0) {*/
            character(moves[search][1][0], moves[search][1][1]);
            break;
          /*} else {
            cCell = cCell - canvasGeometry / distanceBetweenNodes;
            return;
          }*/
        }
      }
    }
  },

  down: function() {
    if(limit == true) {
      cCell++;
      for(let search = 0; search < moves.length; search++) {
        if(cCell == search) {
          /*if(moves[search][1][0]>flags[1][1]|| moves[search][1][1]>flags[1][2]||moves[search][1][0]<0||moves[search][1][1]<0) {*/
            character(moves[search][1][0], moves[search][1][1]);
            break;
          /*} else {
            cCell--;
            return;
          }*/
        }
      }
    }
  },

  left: function() {
    if(limit == true) {
        cCell = cCell - canvasGeometry / distanceBetweenNodes;
        for(let search = 0; search < moves.length; search++) {
          if(cCell == search) {
            /*
          if(moves[search][1][0]>flags[1][1]||moves[search][1][1]>flags[1][2]||moves[search][1][0]<0||moves[search][1][1]<0) {*/
            character(moves[search][1][0], moves[search][1][1]);
            break;
          /*} else {
            cCell--;
            return;
          }*/
        }
      }
    }
  },

  up: function() {
    if(limit == true) {
      cCell--;
      for(let search = 0; search < moves.length; search++) {
        if(cCell == search) {
          /*if(moves[search][1][0]>flags[1][1]|| moves[search][1][1]>flags[1][2]||moves[search][1][0]<0||moves[search][1][1]<0) {*/
            character(moves[search][1][0], moves[search][1][1]);
            break;
          /*} else {
            cCell--;
            return;
          }*/
        }
      }
    }
  }
}


const player = {
  sPosX: xStartPos,
  sPosY: yStartPos,

  ePosX: xEndPos,
  ePosY: yEndPos,

  sCell: 0, 
  eCell: (canvasGeometry / distanceBetweenNodes * canvasGeometry / distanceBetweenNodes)-1,
  //cCell: 0,

  movement: function(ctrols) {
    switch(ctrols) {
      case 'spawn':
        if(limit == false) {
          character(xStartPos, yStartPos);
          limit = true;
          break;
        }

      case 'right':
        directions.right();
        break;

      case 'down':
        directions.down();
        break;

      case 'left':
        directions.left();
        break;

      case 'up':
        directions.up();
        break;

    }
  }
}


function characterMovements() {
  window.addEventListener("keydown", function (event) {
    switch(event.keyCode) {
      case 68:
        player.movement('right');
        break;
      
      case 83:
        player.movement('down');
        break;

      case 65:
        player.movement('left');
        break;

      case 87:
        player.movement('up');
        break;
      
      case 13:
        if(limit == false) {
          player.movement('spawn')
          break;
        }

      case 8:

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pctx.clearRect(0, 0, playCanvas.width, playCanvas.height);
        ctxg.clearRect(0, 0, canvas.width, canvas.height);
        ctxf.clearRect(0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 1;
        ctxg.globalAlpha = 1;
        ctxf.globalAlpha = 1;

        xStartPos = null, yStartPos = null;
        xEndPos = null, yEndPos = null;
        limit = false;
        cCell = 0;
        cPlayer = [];
        flags = [];
        node = [];
        openNode = [];
        borderNode = [];
        lineNode = [];
        wallCount = []
        wallValue = [];
        thread = [];


        moves = [];

        collision = [];
        randomizer = 0;

        lockMech = false;
        savedX = null, savedY = null;

        pPosX = null;
        pPosY = null;
        nodeID = 0;

          assignBorder();
          sortDirArray();
          drawNodeBorders();
          grid();
          assertCells();
        break;
    }
  });
}
characterMovements();
