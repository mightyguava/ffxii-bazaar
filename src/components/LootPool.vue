<template>
  <div>
    <nav class="has-background-light">
      <div class="container">
        <div class="level filters is-mobile">
          <div class="level-left">
            <div class="level-item">
              <label class="label">Search</label>
            </div>
            <div class="level-item">
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
    <section>
      <div class="container">
        <table class="table">
          <tr>
            <th>Loot</th>
            <th>Quantity</th>
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
          </tr>
        </table>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import store from "../services/bazaar"

interface Row {
  name: string
  quantity: number
}

@Component
export default class LootPool extends Vue {
  sold = store.sold
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
      if (name.toLowerCase().includes(q)) {
        rows.push({ name, quantity })
      }
    }
    this.filtered = rows
  }
}
</script>

<style lang="scss"></style>
