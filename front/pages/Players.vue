<template>
  <main class="container">
    <div>
      <h1>Liste des joueurs</h1>
      <ul>
        <li v-for="player in players" :key="player.email">
          {{ player.firstname }} {{player.lastname}}
          <button @click="fight()">fight</button>
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
    }
  },
  methods: {
    async fight() {
      console.log('fight');
    }
  }
  })
</script>
