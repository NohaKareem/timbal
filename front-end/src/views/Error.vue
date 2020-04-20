<template>
  <div class="errorPageCon">
      <h1>404 error page</h1>
      <h2>Hmm, seems like this wasn't what you were looking for!</h2>
  </div>
</template>
<script>
export default {
  name: "App", 
   data() {
      return {
        hideMenu: true
      }
   }, 
   computed: {
      // get current route name https://stackoverflow.com/a/53126892/1446598
      currRoute() {
        return this.$route.name;
      }
   },
   methods: {
     toggleMenu() {
       console.log('in toggle')
       this.hideMenu = !this.hideMenu;
     }
   }
}
</script>
<style lang="scss" scoped>
  // @import '@/styles/reset.scss';
  @import '@/styles/globalStyles.scss';
  
  .errorPageCon {
    margin-top: 30%;
  }
  
  h1, h2 {
    text-align: center;
  }

  h2 {
    font-weight: normal;
  }
</style>
