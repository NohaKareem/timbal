<template>
  <div id="app">
    {{days}}
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Days", 
    data() {
      return {
        days: []
      }
    },
    created() {
      var self = this;

      // get all days
      axios.get('http://localhost:3000/days')
        .then(function(response) {
          // console.log(response)
          self.days = response.data;
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  }
</script>

<style lang="scss">

</style>
