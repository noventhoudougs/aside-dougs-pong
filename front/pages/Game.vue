<template>
  <main class="container">
    <article>
     PONG
    </article>
    <div class="container">
      <canvas id="canvas" ref="canvas"></canvas>
    </div>

  </main>

</template>

<script
  src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.js"
  integrity="sha512-9mpsATI0KClwt+xVZfbcf2lJ8IFBAwsubJ6mI3rtULwyM3fBmQFzj0It4tGqxLOGQwGfJdk/G+fANnxfq9/cew=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>

<script>


import Vue from 'vue'
import io from 'socket.io-client'

export default Vue.extend({
  mounted() {
    console.log('ici')
    // Canvas Related
    // const canvas = this.$refs.canvas;
    const context = this.$refs.canvas.getContext('2d');
    const socket = io('http://localhost:8000/pong');
    let isReferee = false;
    let paddleIndex = 0;

    let width = 500;
    let height = 700;

    // Paddle
    let paddleHeight = 10;
    let paddleWidth = 50;
    let paddleDiff = 25;
    let paddleX = [225, 225];
    let trajectoryX = [0, 0];
    let playerMoved = false;

    // Ball
    let ballX = 250;
    let ballY = 350;
    let ballRadius = 5;
    let ballDirection = 1;

    // Speed
    let speedY = 2;
    let speedX = 0;

    // Score for Both Players
    let score = [0, 0];

    // Create Canvas Element
    function createCanvas() {
      canvas.id = 'canvas';
      canvas.width = width;
      canvas.height = height;
      renderCanvas();
    }

    // Wait for Opponents
    function renderIntro() {
      // Canvas Background
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);

      // Intro Text
      context.fillStyle = 'white';
      context.font = '32px Courier New';
      context.fillText(
        'Waiting for opponent...',
        20,
        canvas.height / 2 - 30
      );
    }

    // Render Everything on Canvas
    function renderCanvas() {
      // Canvas Background
      context.fillStyle = 'black';
      context.fillRect(0, 0, width, height);

      // Paddle Color
      context.fillStyle = 'white';

      // Bottom Paddle
      context.fillRect(paddleX[0], height - 20, paddleWidth, paddleHeight);

      // Top Paddle
      context.fillRect(paddleX[1], 10, paddleWidth, paddleHeight);

      // Dashed Center Line
      context.beginPath();
      context.setLineDash([4]);
      context.moveTo(0, 350);
      context.lineTo(500, 350);
      context.strokeStyle = 'grey';
      context.stroke();

      // Ball
      context.beginPath();
      context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
      context.fillStyle = 'white';
      context.fill();

      // Score
      context.font = '32px Courier New';
      context.fillText(score[0], 20, canvas.height / 2 + 50);
      context.fillText(score[1], 20, canvas.height / 2 - 30);
    }

  }
}
)
</script>
