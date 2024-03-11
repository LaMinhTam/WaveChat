export const REACTIONS = ['👍', '♥️', '😄', '😲', '😭', '😡'];

export const FILE_TYPE = {
  TEXT: 1,
  IMAGE: 2,
  VIDEO: 3,
  AUDIO: 4,
  FILE: 5,
  REPLY: 6,
  STICKER: 16,
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
      typeNumber = FILE_TYPE.FILE;
      break;
    case 'JPG':
    case 'JPEG':
    case 'PNG':
    case 'GIF':
      typeNumber = FILE_TYPE.IMAGE;
      break;
    case 'MP4':
    case 'AVI':
    case 'MKV':
    case 'MOV':
      typeNumber = FILE_TYPE.VIDEO;
      break;
    case 'MP3':
    case 'WAV':
    case 'FLAC':
    case 'AAC':
      typeNumber = FILE_TYPE.AUDIO;
      break;
    default:
      typeNumber = FILE_TYPE.FILE;
      break;
  }

  return typeNumber;
}
