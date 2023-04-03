<template>
  <main class="container">
    <div>
      <h1>Liste des joueurs</h1>
      <ul>
        <li v-for="player in players" :key="player.email">
          {{ player.firstname }} {{player.lastname}}
          <button @click="challengePlayer(player)">Défier</button>
        </li>

      </ul>
    </div>
  </main>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async created() {
    const players = (await this.$axios.get('/users')).data.results;
    this.players = players;
  },
  data() {
    return {
      players: [],
      loggedInUser: 'savinien.richter@dougs.fr'
    }
  },
  methods: {
    async challengePlayer(player: any) {
      const currentUser = this.loggedInUser;// récupérer le joueur connecté, par exemple depuis le store Vuex
      const response = await this.$axios.post('/newGame', {
        challenger: this.loggedInUser,
        challenged: player.email,
      });
      const gameId = response.data.id
      this.$router.push({path: `/game`})
    },
  }
})
</script>
