<template>
  <main class="container">
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import * as socketio from 'socket.io';

export default Vue.extend({
  name: 'GameComponent',
  data () {
    return {
      canvas: new HTMLCanvasElement(),
      context: new CanvasRenderingContext2D(),
      socketHttp: null,
      socketIo: null, // io('/pong'),
      isReferee: false,
      paddleIndex: 0,

      width: 500,
      height: 700,

      // Paddle
      paddleHeight: 10,
      paddleWidth: 50,
      paddleDiff: 25,
      paddleX: [ 225, 225 ],
      trajectoryX: [ 0, 0 ],
      playerMoved: false,

      // Ball
      ballX: 250,
      ballY: 350,
      ballRadius: 5,
      ballDirection: 1,

      // Speed
      speedY: 2,
      speedX: 0,

      // Score for Both Players
      score: [ 0, 0 ]
    }
  },

  mounted() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');

    if (ctx) {
      this.context = ctx;
    }

    this.socketIo = socketio.Socket('dos')
    // On Load
    this.loadGame();
  },

  methods: {
    // Create Canvas Element
    createCanvas() {
      this.canvas.id = 'canvas';
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      document.body.appendChild(this.canvas);
      this.renderCanvas();
    },

    // Wait for Opponents
    renderIntro() {
      // Canvas Background
      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, this.width, this.height);

      // Intro Text
      this.context.fillStyle = 'white';
      this.context.font = "32px Courier New";
      this.context.fillText("Waiting for opponent...", 20, (this.canvas.height / 2) - 30);
    },

    // Render Everything on Canvas
    renderCanvas() {
      // Canvas Background
      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, this.width, this.height);

      // Paddle Color
      this.context.fillStyle = 'white';

      // Bottom Paddle
      this.context.fillRect(this.paddleX[0], this.height - 20, this.paddleWidth, this.paddleHeight);

      // Top Paddle
      this.context.fillRect(this.paddleX[1], 10, this.paddleWidth, this.paddleHeight);

      // Dashed Center Line
      this.context.beginPath();
      this.context.setLineDash([4]);
      this.context.moveTo(0, 350);
      this.context.lineTo(500, 350);
      this.context.strokeStyle = 'grey';
      this.context.stroke();

      // Ball
      this.context.beginPath();
      this.context.arc(this.ballX, this.ballY, this.ballRadius, 2 * Math.PI, 0); // to check
      this.context.fillStyle = 'white';
      this.context.fill();

      // Score
      this.context.font = "32px Courier New";
      this.context.fillText(this.score[0].toString(), 20, (this.canvas.height / 2) + 50);
      this.context.fillText(this.score[1].toString(), 20, (this.canvas.height / 2) - 30);
    },

    // Reset Ball to Center
    ballReset() {
      this.ballX = this.width / 2;
      this.ballY = this.height / 2;
      this.speedY = 3;
      this.emit('ballMove', {
        ballX: this.ballX,
        ballY: this.ballY,
        score: this.score,
      });
    },

    // Adjust Ball Movement
    ballMove() {
      // Vertical Speed
      this.ballY += this.speedY * this.ballDirection;
      // Horizontal Speed
      if (this.playerMoved) {
        this.ballX += this.speedX;
      }
      this.emit('ballMove', {
        ballX: this.ballX,
        ballY: this.ballY,
        score: this.score,
      });
    },

    // Determine What Ball Bounces Off, Score Points, Reset Ball
    ballBoundaries() {
      // Bounce off Left Wall
      if (this.ballX < 0 && this.speedX < 0) {
        this.speedX = -this.speedX;
      }
      // Bounce off Right Wall
      if (this.ballX > this.width && this.speedX > 0) {
        this.speedX = -this.speedX;
      }
      // Bounce off player paddle (bottom)
      if (this.ballY > this.height - this.paddleDiff) {
        if (this.ballX >= this.paddleX[0] && this.ballX <= this.paddleX[0] + this.paddleWidth) {
          // Add Speed on Hit
          if (this.playerMoved) {
            this.speedY += 1;
            // Max Speed
            if (this.speedY > 5) {
              this.speedY = 5;
            }
          }
          this.ballDirection = -this.ballDirection;
          this.trajectoryX[0] = this.ballX - (this.paddleX[0] + this.paddleDiff);
          this.speedX = this.trajectoryX[0] * 0.3;
        } else {
          // Reset Ball, add to Computer Score
          this.ballReset();
          this.score[1]++;
        }
      }
      // Bounce off computer paddle (top)
      if (this.ballY < this.paddleDiff) {
        if (this.ballX >= this.paddleX[1] && this.ballX <= this.paddleX[1] + this.paddleWidth) {
          // Add Speed on Hit
          if (this.playerMoved) {
            this.speedY += 1;
            // Max Speed
            if (this.speedY > 5) {
              this.speedY = 5;
            }
          }
          this.ballDirection = -this.ballDirection;
          this.trajectoryX[1] = this.ballX - (this.paddleX[1] + this.paddleDiff);
          this.speedX = this.trajectoryX[1] * 0.3;
        } else {
          this.ballReset();
          this.score[0]++;
        }
      }
    },

    // Called Every Frame
    animate() {
      if (this.isReferee) {
        this.ballMove();
        this.ballBoundaries();
      }
      this.renderCanvas();
      window.requestAnimationFrame(this.animate);
    },

    // Load Game, Reset Everything
    loadGame(): void {
      this.createCanvas();
      this.renderIntro();
      this.emit('ready', {});
    },

    startGame() {
      this.paddleIndex = this.isReferee ? 0 : 1;
      window.requestAnimationFrame(this.animate);
      this.canvas.addEventListener('mousemove', (e) => {
        this.playerMoved = true;
        this.paddleX[this.paddleIndex] = e.offsetX;
        if (this.paddleX[this.paddleIndex] < 0) {
          this.paddleX[this.paddleIndex] = 0;
        }
        if (this.paddleX[this.paddleIndex] > (this.width - this.paddleWidth)) {
          this.paddleX[this.paddleIndex] = this.width - this.paddleWidth;
        }
        this.emit('paddleMove', {
          xPosition: this.paddleX[this.paddleIndex],
        });
        // Hide Cursor
        this.canvas.style.cursor = 'none';
      });
    },

    emit(event: string, data: any) {
      if (this.socketIo) {
        this.socketIo.emit(event, data);
      }
    }

  /* socket.on('connect', () => {
    console.log('Connected as...', socket.id);
  });

  socket.on('startGame', (refereeId) => {
    console.log('Referee is', refereeId);

    isReferee = socket.id === refereeId;
    startGame();
  });

  socket.on('paddleMove', (paddleData) => {
    // Toggle 1 into 0, and 0 into 1
    const opponentPaddleIndex = 1 - paddleIndex;
    paddleX[opponentPaddleIndex] = paddleData.xPosition;
  });

  socket.on('ballMove', (ballData) => {
    ({ ballX, ballY, score } = ballData);
  }); */
  }
})
</script>
