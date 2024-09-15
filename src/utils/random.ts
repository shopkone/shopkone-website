import dayjs from 'dayjs'

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const genId = () => {
  let str = '';
  [1, 2, 3, 4].forEach(() => {
    const num = random(0, 999)
    str += String(num)
  })
  const index = random(0, 3)
  const m = dayjs().get('millisecond').toString()
  str = str.split('').map((n, i) => i === index ? m : n).join('')
  return Number(str)
}
