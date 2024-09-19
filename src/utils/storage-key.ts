export const STORAGE_KEY = {
  TOKEN: 'Authorization' // token
}

const encode = (str: string) => {
  return window.btoa(str)
}

export const setStorage = (key: string, value: string) => {
  localStorage.setItem(encode(key), value)
}

export const getStorage = (key: string) => {
  return localStorage.getItem(encode(key))
}

export const removeStorage = (key: string) => {
  localStorage.removeItem(encode(key))
}
