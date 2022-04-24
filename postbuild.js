const OSS = require('ali-oss');
const fs = require('fs').promises
const path = require('path');
const nextStaticPath = path.resolve('.next/static/')

const dotenv = require("dotenv")
dotenv.config()

const headers = {
  'Cache-Control': 'public,max-age=31536000,immutable', 
  'oss.kherrisan.cn': '*'
};

const client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  bucket: 'kherrisan-fc-blog'
});

async function uploadDir(dir) {
  let files = await fs.readdir(dir)
  files.map(async file => {
    let filePath = path.resolve(dir, file)
    let stat = await fs.stat(filePath)
    if (stat.isDirectory()) {
      await uploadDir(filePath)
    } else {
      let fileName = filePath.replace(nextStaticPath, '_next/static')
      console.log(`uploading ${fileName}`)
      await client.put(fileName, filePath, { headers })
    }
  })
}

async function uploadNextStatic() {
  try {
    uploadDir('.next/static/')
  } catch (e) {
    console.log(e);
  }
}

async function handleDel(name, options) {
  try {
    await client.delete(name);
    return name
  } catch (error) {
    error.failObjectName = name;
    return error;
  }
}

async function cleanOssBucket(){
  const list = await client.list({
    prefix: '_next/static',
  });
  list.objects = list.objects || [];
  try{
    const result = await Promise.all(list.objects.map((v) => handleDel(v.name)));
    console.log(result);
  }catch(e){
    console.log(e)
  }
}

(async ()=>{
  await cleanOssBucket()
  await uploadNextStatic()
})();