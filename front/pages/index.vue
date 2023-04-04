<template>
  <main class="container login">
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
        <button class="login" type="button" @click="loginClick">Login</button>
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
main.container.login {
  border-radius: 8px;
  margin-top: 100px;
  max-width: 500px;
  background-color: #131128;
}

article {
  background-color: #131128;
}

input {
  color: white;
}

li {
  color: white;
}

button.login {
  background-color: #FC228F;
  border-color: #FC228F;
}

img {
  display: block;
  width: 100px;
  margin-left: auto;
  margin-right: auto;
}
</style>
