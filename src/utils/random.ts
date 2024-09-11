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
  str += dayjs().get('millisecond').toString()
  return Number(str)
}
