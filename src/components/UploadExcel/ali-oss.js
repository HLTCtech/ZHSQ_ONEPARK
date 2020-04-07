const OSS = require('ali-oss')

const client = new OSS({
  region: 'zhsq-vue.oss-cn-beijing.aliyuncs.com',
  accessKeyId: 'LTAI4FgSpxAu8qrgZ9rePVoz',
  accessKeySecret: 'OUwPlikf0QdYfPCEtxjf2Qt6evN1L2',
  bucket: 'zhsq-vue'
})

async function put() {
  try {
    const result = await client.put('object-name', 'local-file')
    console.log(result)
  } catch (e) {
    console.log(e)
  }
}

put()
