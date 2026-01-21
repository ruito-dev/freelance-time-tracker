import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('プレースホルダーが表示される', () => {
    render(<SearchBar value="" onChange={vi.fn()} placeholder="検索..." />);
    expect(screen.getByPlaceholderText('検索...')).toBeInTheDocument();
  });

  it('入力値が表示される', () => {
    render(<SearchBar value="テスト" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('テスト');
  });

  it('入力時にonChangeが呼ばれる', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'テスト');

    expect(handleChange).toHaveBeenCalled();
  });

  it('値がある場合、クリアボタンが表示される', () => {
    render(<SearchBar value="テスト" onChange={vi.fn()} />);
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('値がない場合、クリアボタンが表示されない', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    const clearButton = screen.queryByRole('button');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('クリアボタンをクリックすると空文字でonChangeが呼ばれる', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SearchBar value="テスト" onChange={handleChange} />);

    const clearButton = screen.getByRole('button');
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('検索アイコンが表示される', () => {
    const { container } = render(<SearchBar value="" onChange={vi.fn()} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
