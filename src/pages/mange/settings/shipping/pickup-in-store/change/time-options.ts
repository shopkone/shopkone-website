export const getTimeOptions = () => {
  const timeOptions = []

  // 生成从 00:00 到 23:30 的时间选项
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      const value = hour * 60 + minute // 计算分钟数
      timeOptions.push({ label: formattedTime, value })
    }
  }

  return timeOptions
}
