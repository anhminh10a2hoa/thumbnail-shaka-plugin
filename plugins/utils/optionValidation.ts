import { Option } from '../types'
import warning from './warning'

function OptionValidation(option: Option){
  const { thumbnails } = option
  for(let i = 0; i < thumbnails.length; i++){
    const { width, height, row, displayTime, startTime } = thumbnails[i]
    if(startTime && startTime < 0) {
      warning('startTime have to be zero or positive number')
    }
    if(displayTime < 0) {
      warning('displayTime have to be zero or positive number')
    }
    if(width === undefined) {
      warning('width have to be provided')
    }
    if(height === undefined) {
      warning('height have to be provided')
    }
    if(row === undefined) {
      warning('row have to be provided')
    }
    if(displayTime === undefined) {
      warning('displayTime have to be provided')
    }
  }
}

export default OptionValidation