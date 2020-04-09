<template>
  <div id="systemCon">
    {{systems}}
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Systems", 
    data() {
      return {
        systems: []
      }
    },
    created() {
      var self = this;

      // get all systems
      axios.get('http://localhost:3000/systems')
        .then(function(response) {
          // console.log(response)
          self.systems = response.data;
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  }
</script>

<style lang="scss">

</style>
