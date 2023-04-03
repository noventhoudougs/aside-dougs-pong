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
<style>
main.container {
  max-width: 800px;
  border: 1px solid #39346A;
}

article {
  background-color: #1e1b38;
}

label {
  color: white;
}

input {
  color: white;
}

button {
  background-color: #FC228F;
  border-color: #FC228F;
}
</style>
