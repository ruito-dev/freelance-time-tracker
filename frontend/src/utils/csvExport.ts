/**
 * データをCSV形式に変換してダウンロードする
 */
export const exportToCSV = (data: unknown[][], filename: string) => {
  // CSVデータを作成
  const csvContent = data
    .map((row) =>
      row
        .map((cell) => {
          // セルの値を文字列に変換
          const cellValue = cell === null || cell === undefined ? '' : String(cell);
          // カンマや改行を含む場合はダブルクォートで囲む
          if (cellValue.includes(',') || cellValue.includes('\n') || cellValue.includes('"')) {
            return `"${cellValue.replace(/"/g, '""')}"`;
          }
          return cellValue;
        })
        .join(',')
    )
    .join('\n');

  // BOM付きUTF-8でエンコード（Excelで文字化けしないように）
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

  // ダウンロードリンクを作成
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 日付を YYYY-MM-DD 形式にフォーマット
 */
export const formatDateForFilename = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 時間（秒）を HH:MM:SS 形式にフォーマット
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
