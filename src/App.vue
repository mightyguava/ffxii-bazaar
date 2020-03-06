<template>
  <div id="app">
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <h3 class="navbar-item">FFXII Bazaar</h3>
        <a
          class="navbar-item is-tab"
          v-bind:class="{ 'is-active': isActive('bazaar') }"
          v-on:click="activate('bazaar')"
          >Bazaar</a
        >
        <a
          class="navbar-item is-tab"
          v-bind:class="{ 'is-active': isActive('loot') }"
          v-on:click="activate('loot')"
          >Loot Sold</a
        >

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          v-bind:class="{ 'is-active': isMenuActive }"
          v-on:click="toggleMenu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': isMenuActive }">
        <div class="navbar-start"></div>
        <div class="navbar-end">
          <div class="navbar-item">
            <button
              class="button is-dark has-text-grey reset-button"
              v-on:click="resetData"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </nav>
    <BazaarList v-if="isActive('bazaar')" />
    <LootPool v-if="isActive('loot')" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import BazaarList from "./components/BazaarList.vue"
import LootPool from "./components/LootPool.vue"
import store from "./services/bazaar"
@Component({
  components: {
    BazaarList,
    LootPool
  }
})
export default class App extends Vue {
  activeTab = "bazaar"
  isMenuActive = false
  activate(tab: string) {
    this.activeTab = tab
  }
  isActive(tab: string): boolean {
    return this.activeTab === tab
  }

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive
  }
  resetData() {
    store.reset()
  }
}
</script>

<style lang="scss">
@import "~normalize-scss";
@import "~bulma/sass/utilities/_all.sass";
@import "~bulma/sass/base/_all.sass";
@import "~bulma/sass/grid/_all.sass";
@import "~bulma/sass/components/level.sass";
@import "~bulma/sass/components/navbar.sass";
@import "~bulma/sass/elements/container";
@import "~bulma/sass/elements/table.sass";
@import "~bulma/sass/elements/tag.sass";
@import "~bulma/sass/elements/button.sass";
@import "~bulma/sass/form/shared.sass";
@import "~bulma/sass/form/tools.sass";
@import "~bulma/sass/form/input-textarea.sass";
@import "~bulma/sass/layout/_all.sass";

@include touch {
  .button.reset-button {
    background-color: $white !important;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
