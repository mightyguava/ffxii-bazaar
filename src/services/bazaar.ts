import data from "../../data/bazaar.json"

export type Package = {
  package: string
  price: number
  loot: Item[]
  reward: Item[]
}

export type Item = {
  name: string
  quantity: number
}

function getPackages(): Package[] {
  return data
}

/**
 * sold and purchased need to be initialized with zero values to support Vue's reactivity model.
 */
function initSold(): Record<string, number> {
  const inventory: Record<string, number> = {}
  const packages = getPackages()
  for (const p of packages) {
    for (const l of p.loot) {
      inventory[l.name] = 0
    }
  }
  return inventory
}

function initPurchased(): Record<string, boolean> {
  const purchased: Record<string, boolean> = {}
  const packages = getPackages()
  for (const p of packages) {
    purchased[p.package] = false
  }
  return purchased
}

class Store {
  packages: Package[]
  sold: Record<string, number>
  purchased: Record<string, boolean>
  constructor(
    packages: Package[],
    sold: Record<string, number>,
    purchased: Record<string, boolean>
  ) {
    this.packages = packages
    this.sold = sold
    this.purchased = purchased
    this.load()
  }

  saveSold() {
    localStorage.setItem("sold", JSON.stringify(this.sold))
  }

  savePurchased() {
    localStorage.setItem("purchased", JSON.stringify(this.purchased))
  }

  load() {
    this.sold = Object.assign(
      this.sold,
      JSON.parse(localStorage.getItem("sold") || "{}")
    )
    this.purchased = Object.assign(
      this.purchased,
      JSON.parse(localStorage.getItem("purchased") || "{}")
    )
  }

  reset() {
    this.sold = Object.assign(this.sold, initSold())
    this.purchased = Object.assign(this.purchased, initPurchased())
  }
}

export default new Store(getPackages(), initSold(), initPurchased())
