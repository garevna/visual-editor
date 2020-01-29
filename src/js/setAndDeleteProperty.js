import Vue from 'vue'

export function setProperty(obj, prop, value) {
  Vue.set(obj, prop, value)
}

export function deleteProperty(obj, prop) {
  if (!obj[prop]) return
  Vue.delete(obj, prop)
}
