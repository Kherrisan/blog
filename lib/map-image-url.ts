import { defaultMapImageUrl } from 'react-notion-x'

export const mapImageUrl = defaultMapImageUrl

export const proxyMapImageUrl = (url, block): string => {
    const mappedUrl = defaultMapImageUrl(url, block);
    return `https://biproxy.cdn.kherrisan.cn/image/${encodeURI(mappedUrl)}`;
}