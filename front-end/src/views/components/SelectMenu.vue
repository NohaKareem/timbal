<template>
  <!-- https://hackernoon.com/how-to-make-a-custom-select-component-in-vuejs-8kt32pj -->
  <div class="custom-select" :tabindex="tabindex" @blur="open = false">
    <div class="selected" :class="{ open: open }" @click="open = !open">
      {{ selected }}
    </div>
    <div class="items" :class="{ selectHide: !open }">
      <div
        class="item"
        v-for="(option, i) of options"
        :key="i"
        @click="
          selected = option
          open = false
          $emit('input', option)
        "
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectMenu',
  props: {
    options: {
      type: Array,
      required: true
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      selected: this.options.length > 0 ? this.options[0] : null,
      open: false
    }
  },
  mounted() {
    this.$emit('input', this.selected)
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
