<template>
  <div class="categoryListCon">
    <!-- add category color if top level category, otherwise add current top level category color -->
    <!-- a check is made on the foreground color to see if it's a light color, or if the previously sest color (from top-level cateogry) is a light color, requiring contrasting foreground  -->
    <div
      class="categoryListItem"
      v-for="category in categoriesList"
      :key="category._id"
      :style="
        (category.color !== undefined
          ? 'background-color:' + category.color.color
          : 'background-color:' + currColor) +
          ';' +
          'color:' +
          currForegroundColor
      "
      @click="
        addCategoryToLog(
          category._id,
          category.is_top_level,
          category.code,
          category.color != undefined ? category.color.color : currColor
        )
      "
    >
      {{ category.code }}: {{ category.description }}
    </div>
    <button class="circle" type="button" @click="launchNewCategoryWindow()"
      >+</button
    >
    <transition name="appearTransition">
      <newCategoryWindow v-if="showNewCategoryWindow" />
    </transition>
    <div class="verticalLine"></div>
  </div>
</template>

<script>
import NewCategoryWindow from './NewCategoryWindow.vue'
export default {
  name: 'CategoryItemsList',
  components: { newCategoryWindow: NewCategoryWindow },
  props: ['categoriesList'],
  data() {
    return {
      showNewCategoryWindow: false,
      foregroundColor: '#F0F0F0'
    }
  },
  computed: {
    currColor() {
      return this.$store.state.currColor
    },
    currLogsList() {
      return this.$store.state.logInput
    },
    currLogsStr() {
      return this.$store.state.logStr
    },
    currForegroundColor() {
      return ['#96F5F3', '#C5F566', '#FFD500', '#99F596'].includes(
        this.currColor
      )
        ? '#707070'
        : '#F0F0F0'
    }
  },
  methods: {
    launchNewCategoryWindow() {
      this.showNewCategoryWindow = true
    },
    // update vuex logInput state with selected categories (push to logInput array, concatenate log string delineated with '.')
    addCategoryToLog(categoryId, isTopLevel, categoryStr, catColor) {
      let currLogsList = this.currLogsList
      let currLogStr = this.$store.state.logStr //this.currLogStr;

      // reset logInput and LogStr in vuex if category is top level (ie. new log entry, not a nested hierarchy to an existing one)
      if (isTopLevel) {
        currLogsList = []
        currLogStr = ''

        // update current top level color, to use with subcategories
        this.$store.commit('currColor', catColor)
      }
      currLogsList.push(categoryId)
      currLogStr += (isTopLevel ? '' : '.') + categoryStr
      this.$store.commit('logInput', currLogsList)
      this.$store.commit('logStr', currLogStr)

      currLogStr = this.$store.state.logInput //this.currLogStr;

      // emit event to parent, to render a new instance of this component
      this.$emit('addedLogCategoryItem')
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/globalStyles.scss';

// transitions
.appearTransition-enter-active,
.appearTransition-leave-active {
  transition: all 0.75s ease-in-out; //steps(3,start);
}
.appearTransition-enter,
.appearTransition-leave-to {
  opacity: 0;
}
.appearTransition-enter-to,
.appearTransition-leave {
  opacity: 1;
}
</style>
