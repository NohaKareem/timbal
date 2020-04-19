<template>
  <div class="auth">
    <h1 class="hidden">Sign Up</h1>
    <form action="http://localhost:3000/signup" method="POST" class="signUpForm">
      <input type="text" name="firstName" id="firstName" placeholder="first name">
      <input type="text" name="lastName" id="lastName" placeholder="last name">
      <input type="email"  name="email" id="email" placeholder="email">
      <input type="password" name="password" id="password" placeholder="password">
      <input type="submit" value="sign up">
    </form>
    <div class="alternativeLinks">
      <p><a href="http://localhost:3000/auth/facebook">log in using facebook</a></p>
      <p>already a member? <router-link to="/signIn"> sign in </router-link> </p>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
  // @import '@/styles/reset.scss';
  @import '@/styles/globalStyles.scss';
</style>
