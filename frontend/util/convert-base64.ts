import compress from 'compress-base64'

export const convertToBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    // fileReader.onload = (e: any) => {

    //   resolve(fileReader.result)
    // }
    fileReader.readAsDataURL(file)

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

// export const convertToBase64 = async (base64: any) => {
//   await compress(base64, {
//     width: 400,
//     max: 2,
//     min: 1,
//     quality: 0.8,
//   }).then((result) => {
//     console.log(result)
//   })
// }
