$(document).click(function() {
  var canvas = document.getElementById("canvas")
  var ctx = canvas.getContext("2d")

  var leftPressed = false
  var rightPressed = false

  var ball = {
    x: canvas.width/2,
    y: canvas.height - 50,
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

  function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI)
    ctx.fillStyle = "blue"
    ctx.fill()
    ctx.closePath()
  }

  function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()
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

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawblocks()
    drawBall()
    drawPaddle()
    blockHit()
    paddleHit()

    if (ball.x + ball.xVelocity > canvas.width - ball.radius ||
    ball.x + ball.xVelocity < ball.radius) {
      ball.xVelocity = -ball.xVelocity
    }

    if (ball.y + ball.yVelocity < ball.radius) {
      ball.yVelocity = -ball.yVelocity
    } else if (ball.y + ball.yVelocity > canvas.height - ball.radius) {
      document.location.reload()
    }

    if (rightPressed && paddle.x < canvas.width - paddle.width) {
      paddle.x += 7
    }
    else if (leftPressed && paddle.x > 0) {
      paddle.x -= 7
    }

    ball.x += ball.xVelocity
    ball.y += ball.yVelocity
    requestAnimationFrame(draw)
  }

  $(document).keydown(function(e) {
    if (e.keyCode == 37) {
      leftPressed = true
    } else if (e.keyCode == 39){
      rightPressed = true
    }
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 37) {
      leftPressed = false
    } else if (e.keyCode == 39){
      rightPressed = false
    }
  });

  function blockHit() {
    for (i = 0; i < block.colSize; i ++) {
      for ( j = 0; j < block.rowSize; j ++) {
        var cur = blocks[i][j]
        if (cur.visible == 1) {
          if (ball.x > cur.x && ball.x < cur.x + block.width &&
          ball.y > cur.y && ball.y < cur.y + block.height) {
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
      ball.yVelocity = -ball.yVelocity

      //speed the ball up every time it hits the paddle
      ball.yVelocity = ball.yVelocity - 0.5

      sectionSize = paddle.width/5

      var a = Math.pow(ball.xVelocity, 2)
      var b = Math.pow(ball.yVelocity, 2)
      var totalSpeed = Math.sqrt(a + b)

      if (ball.x < paddle.x + sectionSize) {
        //22.5 degree angle
        ball.xVelocity = -totalSpeed*Math.cos(Math.PI/8)
        ball.yVelocity = -totalSpeed*Math.sin(Math.PI/8)
      } else if (ball.x < paddle.x + 2*sectionSize) {
        //45 degree angle
        ball.xVelocity = -totalSpeed*Math.cos(Math.PI/4)
        ball.yVelocity = -totalSpeed*Math.sin(Math.PI/4)
      } else if (ball.x < paddle.x + 3*sectionSize) {
        //bounce straight up (0 degree angle)
        if (ball.xVelocity != 0) {
          ball.yVelocity = -totalSpeed
        }
        ball.xVelocity = 0
      } else if (ball.x < paddle.x + 4*sectionSize) {
        //45 degree angle
        ball.xVelocity = totalSpeed*Math.cos(Math.PI/4)
        ball.yVelocity = -totalSpeed*Math.sin(Math.PI/4)
      } else if (ball.x < paddle.x + 5*sectionSize) {
        //22.5 degree angle
        ball.xVelocity = totalSpeed*Math.cos(Math.PI/8)
        ball.yVelocity = -totalSpeed*Math.sin(Math.PI/8)
      }
    }
  }

  requestAnimationFrame(draw)
})
