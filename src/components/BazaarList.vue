<template>
  <div>
    <nav class="has-background-light">
      <div class="container">
        <div class="level filters">
          <div class="level-left">
            <div class="level-item">
              <div class="field-label">
                <label class="label">Search</label>
              </div>
              <div class="field is-horizontal">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Query..."
                      v-on:input="filter"
                      v-model="query"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="level-item">
              <div class="field-label">
                <label class="label">Filter</label>
              </div>
              <div class="buttons are-small">
                <button
                  class="button"
                  v-bind:class="{ 'is-success': this.filterUnlocked }"
                  v-on:click="toggleShow('unlocked')"
                >
                  Unlocked
                </button>
                <button
                  class="button"
                  v-bind:class="{ 'is-warning': this.filterInProgress }"
                  v-on:click="toggleShow('inProgress')"
                >
                  In Progress
                </button>
                <button
                  class="button"
                  v-bind:class="{ 'is-danger': this.filterLocked }"
                  v-on:click="toggleShow('locked')"
                >
                  Locked
                </button>
                <button
                  class="button"
                  v-bind:class="{ 'is-info': this.filterPurchased }"
                  v-on:click="toggleShow('purchased')"
                >
                  Purchased
                </button>
                <button
                  class="button"
                  v-bind:class="{ 'has-background-yellow': this.filterStarred }"
                  v-on:click="toggleShow('starred')"
                >
                  Starred
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <section class="scrollable">
      <div class="container">
        <table class="table is-fullwidth">
          <tr>
            <th>Package</th>
            <th>Loot Sold</th>
            <th>Actions</th>
            <th>Rewards</th>
            <th>Gil</th>
          </tr>
          <tr v-for="p in filtered" v-bind:key="p.id">
            <td>
              <span
                class="icon is-size-5 has-color-yellow clickable-icon"
                v-on:click="toggleStar(p)"
              >
                <i
                  class="mdi"
                  v-bind:class="{
                    'mdi-star-outline': !isStarred(p),
                    'mdi-star': isStarred(p)
                  }"
                  aria-hidden="true"
                ></i>
              </span>
              {{ p.package }}
              <div class="tags">
                <span v-if="isUnlocked(p)" class="tag is-success"
                  >Unlocked</span
                >
                <span v-if="isInProgress(p)" class="tag is-warning"
                  >In Progress</span
                >
                <span v-if="isPurchased(p)" class="tag is-info">Purchased</span>
              </div>
            </td>
            <td>
              <div v-for="loot in p.loot" v-bind:key="loot.name">
                {{ loot.name }} {{ sold[loot.name] || 0 }}/{{ loot.quantity }}
                <span
                  class="icon is-size-5 clickable-icon"
                  v-on:click="unsell(loot)"
                >
                  <i class="mdi mdi-minus-box-outline" aria-hidden="true"></i>
                </span>
                <span
                  class="icon is-size-5 clickable-icon"
                  v-on:click="sell(loot)"
                >
                  <i class="mdi mdi-plus-box-outline" aria-hidden="true"></i>
                </span>
              </div>
            </td>
            <td>
              <div class="buttons are-small">
                <button
                  class="button is-success"
                  v-if="!isUnlockable(p) && !isUnlocked(p)"
                  v-on:click="markUnlocked(p)"
                >
                  Add All Loot
                </button>
                <button
                  class="button is-danger"
                  v-if="isHasLoot(p)"
                  v-on:click="clearLoot(p)"
                >
                  Clear Loot
                </button>
                <button
                  class="button is-danger"
                  v-if="isUnlocked(p) && !isUnlockable(p)"
                  v-on:click="markLocked(p)"
                >
                  Lock
                </button>
                <button
                  class="button is-info"
                  v-if="!isPurchased(p)"
                  v-on:click="markPurchased(p)"
                >
                  Mark Purchased
                </button>
                <button
                  class="button is-info is-light"
                  v-if="isPurchased(p)"
                  v-on:click="markNotPurchased(p)"
                >
                  Unmark Purchased
                </button>
              </div>
            </td>
            <td>
              <div v-for="reward in p.reward" v-bind:key="reward.name">
                {{ reward.name }} x{{ reward.quantity }}
              </div>
            </td>
            <td class="has-text-right">{{ p.price }}</td>
          </tr>
        </table>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
$filters-height: 3rem;
$filters-height-mobile: 2 * $filters-height;
@import "./views-shared.scss";

.clickable-icon {
  user-select: none;
  cursor: pointer;
}

.has-color-yellow {
  color: #ffd800;
}

.has-background-yellow {
  background-color: #ffd800;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import store, { Item, Package } from "../services/bazaar"

@Component
export default class BazaarList extends Vue {
  packages = store.packages
  filtered = this.packages
  starred = store.starred
  sold: Record<string, number> = store.sold
  unlocked: Record<string, boolean> = store.unlocked
  purchased: Record<string, boolean> = store.purchased
  query = ""
  filterUnlocked = false
  filterLocked = false
  filterPurchased = false
  filterInProgress = false
  filterStarred = false
  checkShowAll = true

  mounted() {
    this.$watch(
      "sold",
      function() {
        this.filter()
        store.saveSold()
      },
      { deep: true }
    )
    this.$watch(
      "unlocked",
      function() {
        this.filter()
        store.saveUnlocked()
      },
      { deep: true }
    )
    this.$watch(
      "purchased",
      function() {
        this.filter()
        store.savePurchased()
      },
      { deep: true }
    )
    this.$watch(
      "starred",
      function() {
        this.filter()
        store.saveStarred()
      },
      { deep: true }
    )
  }

  filter() {
    const q = this.query.toLowerCase()
    this.filtered = this.packages.filter(p => {
      return (
        ((p.package.toLowerCase().includes(q) ||
          !!p.loot.find(l => l.name.toLowerCase().includes(q)) ||
          !!p.reward.find(r => r.name.toLowerCase().includes(q))) &&
          (this.checkShowAll ||
            (this.filterUnlocked && this.isUnlocked(p)) ||
            (this.filterPurchased && this.isPurchased(p)) ||
            (this.filterInProgress && this.isInProgress(p)) ||
            (this.filterLocked &&
              !this.isUnlocked(p) &&
              !this.isPurchased(p)))) ||
        (this.filterStarred && this.isStarred(p))
      )
    })
  }
  toggleShow(type: string) {
    switch (type) {
      case "unlocked":
        this.filterUnlocked = !this.filterUnlocked
        break
      case "locked":
        this.filterLocked = !this.filterLocked
        break
      case "purchased":
        this.filterPurchased = !this.filterPurchased
        break
      case "inProgress":
        this.filterInProgress = !this.filterInProgress
        break
      case "starred":
        this.filterStarred = !this.filterStarred
        break
    }
    this.checkShowAll =
      !this.filterUnlocked &&
      !this.filterLocked &&
      !this.filterPurchased &&
      !this.filterInProgress &&
      !this.filterStarred
    this.filter()
  }
  isUnlocked(p: Package): boolean {
    return this.unlocked[p.package]
  }
  markLocked(p: Package) {
    return (this.unlocked[p.package] = false)
  }
  markUnlocked(p: Package) {
    for (const loot of p.loot) {
      const sold = this.numSold(loot)
      if (loot.quantity > sold) {
        this.sold[loot.name] = loot.quantity
      }
    }
    this.updateUnlocked()
  }
  isUnlockable(p: Package): boolean {
    return p.loot
      .map(l => this.numSold(l) >= l.quantity)
      .reduce((a, b) => a && b)
  }
  updateUnlocked() {
    for (const p of this.packages) {
      const shouldUnlock = !this.isPurchased(p) && this.isUnlockable(p)
      if (shouldUnlock) {
        this.unlocked[p.package] = true
      }
    }
  }
  isInProgress(p: Package): boolean {
    return !this.isUnlocked(p) && !this.isPurchased(p) && this.isHasLoot(p)
  }
  isHasLoot(p: Package): boolean {
    return p.loot
      .map(l => {
        const sold = this.numSold(l)
        return sold > 0
      })
      .reduce((a, b) => a || b)
  }
  isPurchased(p: Package): boolean {
    return this.purchased[p.package]
  }
  markPurchased(p: Package) {
    this.purchased[p.package] = true
    this.unlocked[p.package] = false
    this.clearLoot(p)
  }
  markNotPurchased(p: Package) {
    this.purchased[p.package] = false
    this.updateUnlocked()
  }
  isStarred(p: Package): boolean {
    return this.starred[p.package]
  }
  toggleStar(p: Package) {
    this.starred[p.package] = !this.starred[p.package]
  }
  clearLoot(p: Package) {
    for (const loot of p.loot) {
      this.sold[loot.name] = 0
    }
  }
  numSold(loot: Item): number {
    return this.sold[loot.name] || 0
  }
  sell(loot: Item) {
    this.sold[loot.name] = this.numSold(loot) + 1
    this.updateUnlocked()
  }
  unsell(loot: Item) {
    this.sold[loot.name] = Math.max(this.numSold(loot) - 1, 0)
    this.updateUnlocked()
  }
}
</script>
