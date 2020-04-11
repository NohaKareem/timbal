<template>
  <div id="app">
    <h1 class="hidden">Timbal App</h1>
    <header class="timbalHeader">
      <nav>
        <h1 class="hidden">Header</h1>
        <img src="logo_gray.svg" alt="timbal logo" class="logo">
        <div class="profilePic"></div>
      </nav>
    </header>
    <div class="testingNav">
      <!-- <router-link to="/">Home</router-link> | -->
      <!-- <router-link to="/about">About</router-link> -->
      <router-link to="/days">Days</router-link> | 
      <router-link to="/systems">Systems</router-link> | 
      <router-link to="/categories">Categories</router-link> | 
      <router-link to="/variables">Variables</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
  // @import '@/styles/reset.scss';
  @import '@/styles/globalStyles.scss';
</style>
