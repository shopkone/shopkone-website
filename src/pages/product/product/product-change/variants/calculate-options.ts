interface Options {
  name: string
  values: Array<{ value: string, id: number }>
  id: number
}

interface Result {
  label: string
  value: string
  id: number
}

// 生成笛卡尔积的函数
function cartesianProduct (arr: any[][]) {
  return arr.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [...d, e])), [[]])
}

// 主函数：生成组合
function generateCombinations (input: Options[]): Result[][] {
  // 将输入转换为 Result 格式
  const valuesArray = input.map(option =>
    option.values.map(value => ({
      label: option.name,
      value: value.value,
      id: value.id
    }))
  )

  // 生成全部维度的笛卡尔积组合
  const fullCombinations = cartesianProduct(valuesArray)

  // 生成部分维度的组合（少一个维度）
  const partialCombinations = input.flatMap((_, idx) =>
    cartesianProduct(valuesArray.filter((_, i) => i !== idx))
  )

  // 合并完整组合和部分组合
  return [...fullCombinations, ...partialCombinations]
}

self.onmessage = (e) => {
  let data = (e.data as Options[])?.filter(item => item.name)
  data = data.map(item => ({
    ...item,
    values: item.values.filter(item => item.value)
  }))
  const result = generateCombinations(data).filter(item => item.length)
}
