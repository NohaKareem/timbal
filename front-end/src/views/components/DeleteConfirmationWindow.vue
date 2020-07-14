<template>
    <div class="DeleteConfirmationCon">
      <div class="deleteWindow" ref="confirmationWindow">
          <p class="cancelButton" @click="toggleConfirmationWindow()">X</p>
          Sure you want to delete this category? This can't be undone.
          <div class="confirmationOptions">
            <button type="button">Yes</button>
            <button type="button">No</button>
          </div>
          <!-- <button class="smallInfoButton" type="button" @click="showToolTip()">i</button> -->
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
