$(window).click(function() {
  window.requestAnimationFrame(draw)
})

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

var leftPressed = false
var rightPressed = false

var ball = {
  x: canvas.width/2,
  y: canvas.height - 60,
  xVelocity: 3,
  yVelocity: -3,
  radius: 5
}

var paddle = {
  height: 10,
  width: 75,
  x: (canvas.width - 75)/2,
  y: canvas.height - 40
}

var block = {
  rowSize: 3,
  colSize: 5,
  width: 75,
  height: 20,
  padding: 10,
  spacingTop: 30,
  spacingLeft: 30
}

var blocks = []
for (i = 0; i < block.colSize; i ++) {
  blocks[i] = []
  for(j = 0; j < block.rowSize; j ++) {
    blocks[i][j] = {
      x: 0,
      y: 0,
      visible: 1
    }
  }
}

$(window).keydown(function(e) {
  if (e.keyCode == 37) {
    leftPressed = true
  } else if (e.keyCode == 39){
    rightPressed = true
  }
});

$(window).keyup(function(e) {
  if (e.keyCode == 37) {
    leftPressed = false
  } else if (e.keyCode == 39){
    rightPressed = false
  }
});

function drawBall() {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI)
  ctx.fillStyle = "blue"
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  roundRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

function drawblocks() {
  for (i = 0; i < block.colSize; i ++) {
    for (j = 0; j < block.rowSize; j ++) {
      if (blocks[i][j].visible == 1) {
        var newX = i*(block.width + block.padding) + block.spacingLeft
        var newY = j*(block.height + block.padding) + block.spacingTop

        blocks[i][j].x = newX
        blocks[i][j].y = newY

        ctx.beginPath()
        ctx.rect(newX, newY, block.width, block.height)
        ctx.fillStyle = "brown"
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function blockHit() {
  for (i = 0; i < block.colSize; i ++) {
    for ( j = 0; j < block.rowSize; j ++) {
      var cur = blocks[i][j]
      if (cur.visible == 1) {
        if (ball.x > cur.x && ball.x < cur.x + block.width &&
        ball.y > cur.y + ball.radius && ball.y < cur.y + ball.radius + block.height) {
          ball.yVelocity = -ball.yVelocity
          cur.visible = 0
        }
      }
    }
  }
}

function paddleHit() {
  if (ball.x > paddle.x && ball.x < paddle.x + paddle.width &&
  ball.y > paddle.y - ball.radius && ball.y < (paddle.y - ball.radius + paddle.height)) {

    sectionSize = paddle.width/7

    var a = Math.pow(ball.xVelocity, 2)
    //speed up  the ball by 0.5 in y direction every paddle hit
    var b = Math.pow(ball.yVelocity + 0.5, 2)
    var totalSpeed = Math.sqrt(a + b)

    if (ball.x < paddle.x + sectionSize) {
      //35 degree angle left
      ball.xVelocity = -totalSpeed*Math.cos(Math.PI/5.14)
      ball.yVelocity = -totalSpeed*Math.sin(Math.PI/5.14)
    } else if (ball.x < paddle.x + 2*sectionSize) {
      //45 degree angle left
      ball.xVelocity = -totalSpeed*Math.cos(Math.PI/4)
      ball.yVelocity = -totalSpeed*Math.sin(Math.PI/4)
    } else if (ball.x < paddle.x + 3*sectionSize) {
      //60 degree angle left
      ball.xVelocity = -totalSpeed*Math.cos(Math.PI/2.77)
      ball.yVelocity = -totalSpeed*Math.sin(Math.PI/2.77)
    } else if (ball.x < paddle.x + 4*sectionSize) {
      //bounce straight up (90 degree angle)
      ball.yVelocity = -totalSpeed
      ball.xVelocity = 0
    } else if (ball.x < paddle.x + 5*sectionSize) {
      //60 degree angle right
      ball.xVelocity = totalSpeed*Math.cos(Math.PI/2.77)
      ball.yVelocity = -totalSpeed*Math.sin(Math.PI/2.77)
    } else if (ball.x < paddle.x + 6*sectionSize) {
      //45 degree angle right
      ball.xVelocity = totalSpeed*Math.cos(Math.PI/4)
      ball.yVelocity = -totalSpeed*Math.sin(Math.PI/4)
    } else {
      //35 degree angle right
      ball.xVelocity = totalSpeed*Math.cos(Math.PI/5.14)
      ball.yVelocity = -totalSpeed*Math.sin(Math.PI/5.14)
    }
  }
}

function draw() {
  $(window).click(function() {
    document.location.reload()
  })

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawblocks()
  drawBall()
  drawPaddle()
  blockHit()
  paddleHit()

  //hits a wall on the left or right
  if (ball.x + ball.xVelocity > canvas.width - ball.radius ||
  ball.x + ball.xVelocity < ball.radius) {
    ball.xVelocity = -ball.xVelocity
  }

  //hits a wall on the top or bottom
  if (ball.y + ball.yVelocity < ball.radius) {
    ball.yVelocity = -ball.yVelocity
  } else if (ball.y + ball.yVelocity > canvas.height - ball.radius) {
    //game over
    alert("GAME OVER!")
    document.location.reload()
  }

  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7
  }

  ball.x += ball.xVelocity
  ball.y += ball.yVelocity
  requestAnimationFrame(draw)
}

/**
  Adapted from http://js-bits.blogspot.ca/2010/07/canvas-rounded-corner-rectangles.html
 */
function roundRect(x, y, width, height, radius = 5) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "orange"
  ctx.fill();
}
