<template>
  <main class="container">
    <article>
      <img src="~/assets/frame 1.svg" alt="">
      <form>
        <label>
          Identifiant
          <input type="text" placeholder="email" id="email" v-model="email" required>
        </label>
        <label>
          Mot de passe
          <input type="password" placeholder="password" id="password" v-model="password" required>
        </label>
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
        this.$axios.$post('/login', {email: this.email, password: this.password});
        this.redirectTo('/players');
      }
    },
    redirectTo(url: string) {
      this.$router.push(url)
    }
  },
  data: () => ({
    email: '',
    password: ''
  })
})
</script>
<style>
main.container {
  border-radius: 8px;
  margin-top: 100px;
  max-width: 500px;
  border: 1px solid #39346A;
}

article {
  background-color: #1e1b38;
}

input {
  color: white;
}

li {
  color: white;
}

img {
  display: block;
  width: 100px;
  margin-left: auto;
  margin-right: auto;
}
</style>
