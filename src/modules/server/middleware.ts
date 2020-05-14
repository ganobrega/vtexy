import transformerProxy from 'transformer-proxy'
import pipeline from './pipes'

const isContentTypeHTML = (contentType: string): boolean => contentType && ~contentType.indexOf('text/html')
const isVTEXClientPage = (htmlBody: string): boolean => ~htmlBody.indexOf('xmlns:vtex')

export default transformerProxy((data: any, request: any, response: any) => {
  if (isContentTypeHTML(response._headers['content-type'])) {
    const body = data.toString('utf8')

    // Check if the page is a VTEX Client Page
    if (isVTEXClientPage(body)) {
      return new Promise(async (resolve, reject) => {
        try {
          let _data: any = await pipeline(body, request, response)
          let buff = Buffer.from(_data.data, 'utf8')

          resolve(buff)
        } catch (error) {
          console.error(error)
          reject(data)
        }
      })
    }
  }

  return data
})
