<template>
    <div class="DeleteConfirmationCon">
      <div class="deleteWindow" ref="confirmationWindow">
          <p class="cancelButton" @click="toggleConfirmationWindow()">X</p>
      </div> 
    </div>
</template>

<script>
  export default {
    name: "DeleteConfirmationWindow", 
    data() {
      return {
      }
    },
    computed: {
    },
    created() {
    },
    methods: { 
      // display window 
     toggleConfirmationWindow() {
        this.$refs.confirmationWindow.classList.toggle('hidden');
        }
    }
}
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
</style>
