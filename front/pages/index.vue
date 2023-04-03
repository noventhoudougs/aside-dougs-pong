<template>
  <main class="container">
    <article>
      <h1>Welcome to dougs pong</h1>
      <form>
        <input type="text" placeholder="email" id="email" v-model="email" required>
        <input type="password" placeholder="password" id="password" v-model="password" required>
        <button type="button" @click="loginClick">Login</button>
      </form>
    </article>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
  methods: {
    loginClick() {
      if (this.email && this.password) {
        this.$axios.$post('/login', {email: this.email, password: this.password})
      }
    }
  },
  data: () => ({
    email: '',
    password: ''
  })
})
</script>
