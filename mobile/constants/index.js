export const REACTIONS = ['👍', '♥️', '😄', '😲', '😭', '😡'];

export const FILE_TYPE = {
  1: 'Text',
  2: 'Hình ảnh',
  3: 'Video',
  4: 'Audio',
  5: 'File',
  6: 'Reply',
  16: 'Sticker',
};

export function handleConvertFileTypeToNumber(fileName) {
  const fileType = fileName.split('.');
  const extension = fileType[fileType.length - 1].toUpperCase();
  let typeNumber;

  switch (extension) {
    case 'PDF':
    case 'DOCX':
    case 'DOC':
    case 'TXT':
    case 'RTF':
      typeNumber = 5;
      break;
    case 'JPG':
    case 'JPEG':
    case 'PNG':
    case 'GIF':
      typeNumber = 2;
      break;
    case 'MP4':
    case 'AVI':
    case 'MKV':
    case 'MOV':
      typeNumber = 3;
      break;
    case 'MP3':
    case 'WAV':
    case 'FLAC':
    case 'AAC':
      typeNumber = 4;
      break;
    default:
      typeNumber = 5;
      break;
  }

  return typeNumber;
}
