import { genId } from '@/utils/random'

interface GetVideoInfoType {
  run: (fileName: string, file: File) => Promise<{ url: any } | undefined>
}

interface Result {
  url: string
  width: number
  height: number
  name: string
  size: number
  duration: number
}

export async function getVideoInfo (file: File, oss: GetVideoInfoType): Promise<Result> {
  return await new Promise((resolve) => {
    const fileUrl = URL.createObjectURL(file) // 文件转blob流
    let videoElement = document.createElement('video') // 创建一个视频控件
    videoElement.src = fileUrl // 控件视频地址
    videoElement.autoplay = true // 是否自动播放

    videoElement.addEventListener('canplay', () => {
      const canvas = document.createElement('canvas') // 创建一个画板
      canvas.width = videoElement.videoWidth * 0.8 // 画板宽
      canvas.height = videoElement.videoHeight * 0.8 // 画板的高

      const ctx = canvas.getContext('2d')
      const duration = videoElement.duration
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(b => {
          if (!b) {
            resolve({ url: '', width: 0, height: 0, name: '', size: 0, duration: 0 })
            return
          }
          const name = 'cover-' + genId().toString() + '.png'
          oss.run(name, b as File).then(res => {
            resolve({
              url: res?.url,
              width: canvas.width,
              height: canvas.height,
              name,
              size: b.size,
              duration
            })
          })
        }, 'image/png')
      } else {
        resolve({ url: '', width: 0, height: 0, name: '', size: 0, duration: 0 })
        console.error('Canvas context 2D is not supported.')
      }

      videoElement.src = ''
      videoElement.remove()
      // @ts-expect-error
      videoElement = null
    })
  })
}
