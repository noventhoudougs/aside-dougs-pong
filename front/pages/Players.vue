<template>
  <main class="container players">
    <img src="~/assets/frame 1.svg" alt="">
    <h1>Défiez vos collègues !</h1>
    <h5>Lequel mérite une défaite cuisante ?</h5>
    <article>
      <ul>
        <li v-for="(player, index) in players" :key="player.email">
          <div class="index">#{{ index + 1 }}</div>
          <div class="player">
            <div class="name">{{ player.firstname }} {{ player.lastname }}</div>
            <div class="score">{{ player.score }}</div>
          </div>
          <button class="fight" @click="challengePlayer(player)">Fight 👊</button>
        </li>
      </ul>
    </article>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async created() {
    const players: any[] = (await this.$axios.get('/users')).data.results;
    this.players = players.filter((player, index, array) => array.findIndex(item => item.firstname === player.firstname) === index);
  },
  data() {
    return {
      players: [] as any[],
      loggedInUser: 'savinien.richter@dougs.fr'
    }
  },
  methods: {
    async challengePlayer() {
      const response = await this.$axios.get('/newGame');
      console.log(response.data)
      await this.$router.push({
        path: '/pong',

        params: {socketId: response.data}
      });
    },
  }
  })
</script>
<style>
main.container.players {
  margin-top: 25px;
  max-width: 500px;
}

h1, h5 {
  color: white;
  text-align: center;
}

h1 {
  font-size: 36px;
  margin-bottom: 8px;
  font-weight: normal;
}

h5 {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 20px;
}

article {
  border-radius: 8px;
  background-color: #131128;
  padding: 20px;
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
}

img {
  display: block;
  width: 150px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

ul {
  padding: 0
}

li {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin: 0;
  border-bottom: 1px solid #39346a;
}

div.player {
  color: white;
  flex: 8;
  margin: 0 16px;
  font-size: 16px;
}

div.index {
  color: white;
  opacity: 50%;
  font-size: 12px;
}

div.score {
  opacity: 50%;
  font-size: 14px;
}

button.fight {
  flex: 2;
  margin: 0;
  padding: 8px 16px;
  background-color: #131128;
  border-color: #FC228F;
}
</style>
