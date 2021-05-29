import { Option } from '../types';
import { getThumbnailImage } from './subfunc';

function removeThumbnailImage(options: Option): void {
  for(let i: number = 0; i < options.thumbnails.length; i++) {
    const thumbnail = getThumbnailImage(i)
    if (thumbnail) {
      thumbnail.style.display = 'none'
    }
  }
}

export default removeThumbnailImage