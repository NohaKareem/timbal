<template>
  <div>
    <transition name="appearTransition" appear>
      <div>
        <h1>{{ h1 }}</h1>

        <transition name="appearTransitionStaggered" appear>
          <p class="center">{{ h2 }}</p>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'PageHeading',
  props: {
    h1: String,
    h2: String
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';
</style>
