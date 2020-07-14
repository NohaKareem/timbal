<template>
    <div class="deleteConfirmationCon">
      <div class="deleteWindow" ref="confirmationWindow">
          <p class="cancelButton" @click="toggleConfirmationWindow()">X</p>
          Sure you want to delete this category? This can't be undone.
          <div class="confirmationOptions">
            <button type="button" @click="cconfirmDeletion()">Yes</button>
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
      console.log('delete confirmation window has been launched');
    },
    methods: { 
      // display window 
     toggleConfirmationWindow() {
        this.$refs.confirmationWindow.classList.toggle('hidden');
      }, 
      cconfirmDeletion() {
        console.log('delete away!');
      }
    }
}
</script>

<style lang="scss">
  @import '@/styles/globalStyles.scss';
</style>
