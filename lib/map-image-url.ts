import { defaultMapImageUrl } from 'react-notion-x'

export const mapImageUrl = defaultMapImageUrl

const FILENAME_REGEX = /\/([\w-]+?)\/(\w+?)\.(png|jpeg|jpg|gif)/
const ALI_OSS_REGEX = /https:\/\/[\w-]+?\.oss-cn-([a-z]+?)\.(aliyuncs\.com).+?\?/

export const proxyMapImageUrl = (url, block): string => {
    const mappedUrl = defaultMapImageUrl(url, block);
    let m = FILENAME_REGEX.exec(url);
    if (m) {
        console.log(`https://biproxy.cdn.kherrisan.cn/image${m[0]}`)
        return `https://biproxy.cdn.kherrisan.cn/image${m[0]}?data=${Buffer.from(mappedUrl).toString('base64')}`;
    }
    url = decodeURIComponent(mappedUrl);
    m = ALI_OSS_REGEX.exec(url);
    if (m) {
        console.log(`${m[0]}`)
        return m[0];
    }
    return mappedUrl
}