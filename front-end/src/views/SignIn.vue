<template>
  <div class="auth">
    <h1 class="hidden">Sign In</h1>
    <form action="http://localhost:3000/signIn" method="POST" class="signUpForm">
      <input type="email"  name="email" id="email" placeholder="email">
      <input type="password" name="password" id="password" placeholder="password">
      <input type="submit" value="sign in">
    </form>
    <div class="alternativeLinks">
        <p><a href="http://localhost:3000/facebook">log in using facebook</a></p>
        <p>new here? <router-link to="/signUp"> sign up </router-link> </p>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
  // @import '@/styles/reset.scss';
  @import '@/styles/globalStyles.scss';
</style>
