<template>
  <div id="app" class="menuAndAppCon">
    <div class="appCon">
      <h1 class="hidden">Timbal App</h1>
      <header class="timbalHeader">
        <nav>
          <h1 class="hidden">Header</h1>
          <router-link to="/" class="imageLink"><img src="logo_gray.svg" alt="timbal logo" class="logo"></router-link>
          <div class="profilePic"></div>
          <div class="menuCon">
            <h2 class="hidden">Nav menu</h2>
            <!-- <router-link to="/queryBuilder">Query Builder</router-link> |  -->
            <router-link to="/">Home</router-link>
            <!-- <router-link to="/categoryLibrary">Category Library</router-link> -->
          </div>
        </nav>
      </header>
      <!-- <div class="testingNav">
        <h2 class="hidden">test nav bar</h2>
        <router-link to="/days">Days</router-link> | 
        <router-link to="/systems">Systems</router-link> | 
        <router-link to="/categories">Categories</router-link> | 
        <router-link to="/variables">Variables</router-link> |
        <router-link to="/signUp">Sign Up</router-link>
      </div> -->
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
  // @import '@/styles/reset.scss';
  @import '@/styles/globalStyles.scss';
</style>
