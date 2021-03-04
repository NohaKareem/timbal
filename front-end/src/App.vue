<template>
  <div id="app" class="menuAndAppCon">
    <div class="appCon">
      <h1 class="hidden">Timbal App</h1>
      <header class="timbalHeader">
        <nav>
          <h1 class="hidden">Header</h1>

          <img
            src="/logo_gray.svg"
            alt="timbal logo"
            class="logo"
            @click="toggleMenu()"
          />
          <!--  check if page is an authentication page -->
          <div
            class="profilePic"
            v-if="!(this.currRoute.substring(0, 4) == 'Sign')"
          >
            <!-- // image source https://unsplash.com/photos/ohbfKsIEbJQ -->
            <img src="/profilepic.jpg" alt="profile picture" />
          </div>
          <div :class="hideMenu ? 'hidden menuCon' : 'menuCon'">
            <h2 class="hidden">Nav menu</h2>
            <!-- <router-link to="/queryBuilder">Query Builder</router-link> |  -->
            <router-link to="/">Home</router-link>
            <router-link to="/categories">Category Library</router-link>
          </div>
          <br />
          <footer>
            <button class="help">?</button>
          </footer>
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
<script>
export default {
  name: 'App',
  data() {
    return {
      hideMenu: true
    }
  },
  computed: {
    // get current route name https://stackoverflow.com/a/53126892/1446598
    currRoute() {
      return this.$route.name
    }
  },
  methods: {
    toggleMenu() {
      console.log('in toggle')
      this.hideMenu = !this.hideMenu
    }
  }
}
</script>
<style lang="scss">
// @import '@/styles/reset.scss';
@import '@/styles/globalStyles.scss';
@import url('https://fonts.googleapis.com/css2?family=Quattrocento+Sans&display=swap');
@import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
</style>
