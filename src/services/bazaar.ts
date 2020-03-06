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

function lootToPackage(): Record<string, Item[]> {
  const loot: Record<string, Item[]> = {}
  for (const p of getPackages()) {
    for (const l of p.loot) {
      const v = loot[l.name] || []
      v.push({
        name: p.package,
        quantity: l.quantity
      })
      loot[l.name] = v
    }
  }
  return loot
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

function packageMap(): Record<string, boolean> {
  const purchased: Record<string, boolean> = {}
  const packages = getPackages()
  for (const p of packages) {
    purchased[p.package] = false
  }
  return purchased
}

class Store {
  packages: Package[]
  /* mapping of loot names to the quantities required in each package that needs it */
  lootToPackage: Record<string, Item[]>
  sold: Record<string, number>
  unlocked: Record<string, boolean>
  purchased: Record<string, boolean>

  constructor(
    packages: Package[],
    lootToPackage: Record<string, Item[]>,
    sold: Record<string, number>,
    unlocked: Record<string, boolean>,
    purchased: Record<string, boolean>
  ) {
    this.packages = packages
    this.lootToPackage = lootToPackage
    this.sold = sold
    this.unlocked = unlocked
    this.purchased = purchased
    this.load()
  }

  saveSold() {
    localStorage.setItem("sold", JSON.stringify(this.sold))
  }

  saveUnlocked() {
    localStorage.setItem("unlocked", JSON.stringify(this.unlocked))
  }

  savePurchased() {
    localStorage.setItem("purchased", JSON.stringify(this.purchased))
  }

  load() {
    this.sold = Object.assign(
      this.sold,
      JSON.parse(localStorage.getItem("sold") || "{}")
    )
    this.unlocked = Object.assign(
      this.unlocked,
      JSON.parse(localStorage.getItem("unlocked") || "{}")
    )
    this.purchased = Object.assign(
      this.purchased,
      JSON.parse(localStorage.getItem("purchased") || "{}")
    )
  }

  reset() {
    this.sold = Object.assign(this.sold, initSold())
    this.unlocked = Object.assign(this.unlocked, packageMap())
    this.purchased = Object.assign(this.purchased, packageMap())
  }
}

export default new Store(
  getPackages(),
  lootToPackage(),
  initSold(),
  packageMap(),
  packageMap()
)
