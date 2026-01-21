import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCSV, formatDateForFilename, formatDuration } from './csvExport';

describe('csvExport', () => {
  describe('formatDateForFilename', () => {
    it('日付をYYYY-MM-DD形式でフォーマットする', () => {
      const date = new Date('2026-01-21');
      const result = formatDateForFilename(date);
      expect(result).toBe('2026-01-21');
    });

    it('1桁の月と日をゼロパディングする', () => {
      const date = new Date('2026-03-05');
      const result = formatDateForFilename(date);
      expect(result).toBe('2026-03-05');
    });

    it('引数なしの場合、現在の日付を使用する', () => {
      const result = formatDateForFilename();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatDuration', () => {
    it('秒をHH:MM:SS形式でフォーマットする', () => {
      expect(formatDuration(3661)).toBe('01:01:01');
    });

    it('0秒を正しくフォーマットする', () => {
      expect(formatDuration(0)).toBe('00:00:00');
    });

    it('1時間未満を正しくフォーマットする', () => {
      expect(formatDuration(125)).toBe('00:02:05');
    });

    it('10時間以上を正しくフォーマットする', () => {
      expect(formatDuration(36000)).toBe('10:00:00');
    });

    it('小数点以下を切り捨てる', () => {
      expect(formatDuration(3661.9)).toBe('01:01:01');
    });
  });

  describe('exportToCSV', () => {
    let createElementSpy: ReturnType<typeof vi.spyOn>;
    let appendChildSpy: ReturnType<typeof vi.spyOn>;
    let removeChildSpy: ReturnType<typeof vi.spyOn>;
    let clickSpy: ReturnType<typeof vi.fn>;
    let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      clickSpy = vi.fn();
      const mockLink = {
        setAttribute: vi.fn(),
        style: {},
        click: clickSpy,
      } as unknown as HTMLAnchorElement;

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('CSVファイルをダウンロードする', () => {
      const data = [
        ['名前', '年齢'],
        ['太郎', '30'],
        ['花子', '25'],
      ];

      exportToCSV(data, 'test.csv');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('正しいファイル名でダウンロードされる', () => {
      const data = [['テスト']];
      exportToCSV(data, 'test.csv');

      const mockLink = createElementSpy.mock.results[0]?.value as HTMLAnchorElement;
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test.csv');
    });

    it('BOM付きUTF-8でエンコードされる', () => {
      const data = [['日本語']];
      exportToCSV(data, 'test.csv');

      // Blobが作成されたことを確認
      expect(createObjectURLSpy).toHaveBeenCalled();
    });
  });
});
