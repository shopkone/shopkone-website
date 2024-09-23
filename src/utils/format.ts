export function formatFileSize (sizeInBytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0

  while (sizeInBytes >= 1024 && index < units.length - 1) {
    sizeInBytes /= 1024
    index++
  }

  return `${sizeInBytes.toFixed(2)} ${units[index]}`
}
