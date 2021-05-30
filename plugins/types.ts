export interface Thumbnail {
  src: string,
  width: number,
  height: number,
  row: number,
  displayTime: number,
  startTime?: number,
  endTime?: number,
}

export interface Option {
  thumbnails: Array<Thumbnail>,
  // default: 150
  top?: number
}
