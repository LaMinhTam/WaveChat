export function normalizeString(input: string): string {
  // Xóa dấu từ chuỗi
  const withoutDiacritics = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Chuyển đổi thành chữ thường
  const lowercaseString = withoutDiacritics.toLowerCase().trim();

  return lowercaseString;
}
