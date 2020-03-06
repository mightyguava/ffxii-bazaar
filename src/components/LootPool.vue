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
          </div>
        </div>
      </div>
    </nav>
    <section class="scrollable">
      <div class="container">
        <table class="table">
          <tr>
            <th>Loot</th>
            <th>Quantity</th>
            <th>Used in Package</th>
          </tr>
          <tr v-for="row in filtered" v-bind:key="row.name">
            <td>
              {{ row.name }}
            </td>
            <td class="has-text-right">
              <div class="field">
                <div class="control">
                  <input
                    class="input"
                    type="number"
                    placeholder="Quantity"
                    v-on:input="setQuantity(row.name, $event)"
                    v-bind:value="row.quantity"
                  />
                </div>
              </div>
            </td>
            <td>
              <div v-for="p in row.packages" v-bind:key="p.name">
                x{{ p.quantity }} for {{ p.name }}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import store, { Item } from "../services/bazaar"

interface Row {
  name: string
  quantity: number
  packages: Item[]
}

@Component
export default class LootPool extends Vue {
  sold = store.sold
  lootToPackage = store.lootToPackage
  filtered: Row[] = []
  query = ""

  mounted() {
    this.filter()
  }

  setQuantity(name: string, event: Event) {
    const quantity = parseInt((event.target as HTMLInputElement).value)
    if (isNaN(quantity)) {
      return
    }
    this.sold[name] = quantity
  }
  filter() {
    const rows: Row[] = []
    const q = this.query.toLowerCase()
    for (const [name, quantity] of Object.entries(this.sold)) {
      let match = name.toLowerCase().includes(q)
      if (!match) {
        // Check if any of the package names match
        match = this.lootToPackage[name]
          .map(p => p.name.toLowerCase().includes(q))
          .reduce((a, b) => a || b)
      }
      if (match) {
        rows.push({ name, quantity, packages: this.lootToPackage[name] })
      }
    }
    this.filtered = rows.sort((a, b) => (a.name < b.name ? -1 : 1))
  }
}
</script>

<style lang="scss" scoped>
$filters-height: 3rem;
$filters-height-mobile: 3.5rem;
@import "./views-shared.scss";
</style>
