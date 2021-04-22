<template>
  <div class="deleteConfirmationCon">
    <div class="deleteWindow" ref="confirmationWindow">
      <!-- <p class="cancelButton" @click="toggleConfirmationWindow()">X</p> -->
      <p class="cancelButton" @click="$emit('close-delete-win')">X</p>
      Sure you want to delete this category? This can't be undone.
      <div class="confirmationOptions">
        <button type="button" @click="confirmDeletion()">Yes</button>
        <button type="button" @click="toggleConfirmationWindow()">No</button>
      </div>
      <!-- <button class="smallInfoButton" type="button" @click="showToolTip()">i</button> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'DeleteConfirmationWindow',
  props: {
    itemType: String,
    itemId: String
  },
  methods: {
    // display window
    toggleConfirmationWindow() {
      this.$refs.confirmationWindow.classList.toggle('hidden')
    },
    confirmDeletion() {
      console.log(
        `http://localhost:3000/${this.itemType}/${this.itemId}/delete`
      )
      axios
        .post(`http://localhost:3000/${this.itemType}/${this.itemId}/delete`)
        .then(function(response) {
          console.log('deleted', response.data)
        })
        .catch(function(error) {
          console.error(error)
        })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
