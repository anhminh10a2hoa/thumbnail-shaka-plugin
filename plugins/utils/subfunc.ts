import { Thumbnail } from '../types';

function getThumbnailImage(index: number): HTMLElement | null {
  return document.getElementById('thumbnail-' + index)
}

function getColumnThumbnail(index: number, thumbnails: Array<Thumbnail>) {
  if(index > 0) {
    const thumbnail = getThumbnailImage(index - 1)
    if(thumbnail) {
      return Math.round(thumbnail.clientHeight / thumbnails[index - 1].height)
    }
  }
  return -1
}

export {getThumbnailImage, getColumnThumbnail}