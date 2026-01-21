import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './TaskCard';
import type { Task } from '../types/task';

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 1,
    title: 'テストタスク',
    description: 'これはテスト用のタスクです',
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-12-31',
    project_id: 1,
    project: {
      id: 1,
      name: 'テストプロジェクト',
      color: '#3B82F6',
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTaskCard = (task: Task = mockTask) => {
    return render(
      <TaskCard
        task={task}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onStatusChange={mockOnStatusChange}
      />
    );
  };

  describe('レンダリング', () => {
    it('タスクタイトルが表示される', () => {
      renderTaskCard();
      expect(screen.getByText('テストタスク')).toBeInTheDocument();
    });

    it('タスクの説明が表示される', () => {
      renderTaskCard();
      expect(screen.getByText('これはテスト用のタスクです')).toBeInTheDocument();
    });

    it('説明がない場合は表示されない', () => {
      const taskWithoutDescription = { ...mockTask, description: null };
      renderTaskCard(taskWithoutDescription);
      expect(screen.queryByText('これはテスト用のタスクです')).not.toBeInTheDocument();
    });

    it('プロジェクトカラーが表示される', () => {
      renderTaskCard();
      const colorElement = screen.getByTitle('テストプロジェクト');
      expect(colorElement).toHaveStyle({ backgroundColor: '#3B82F6' });
    });

    it('プロジェクトがない場合はカラーが表示されない', () => {
      const taskWithoutProject = { ...mockTask, project: undefined };
      renderTaskCard(taskWithoutProject);
      expect(screen.queryByTitle('テストプロジェクト')).not.toBeInTheDocument();
    });
  });

  describe('ステータス表示', () => {
    it('進行中ステータスが表示される', () => {
      renderTaskCard();
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('in_progress');
      expect(screen.getByText('進行中')).toBeInTheDocument();
    });

    it('未着手ステータスが表示される', () => {
      const todoTask = { ...mockTask, status: 'todo' as const };
      renderTaskCard(todoTask);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('todo');
    });

    it('完了ステータスが表示される', () => {
      const doneTask = { ...mockTask, status: 'done' as const };
      renderTaskCard(doneTask);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('done');
    });

    it('ステータスを変更するとonStatusChangeが呼ばれる', async () => {
      const user = userEvent.setup();
      renderTaskCard();

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'done');

      expect(mockOnStatusChange).toHaveBeenCalledWith(1, 'done');
      expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('優先度表示', () => {
    it('高優先度が表示される', () => {
      renderTaskCard();
      expect(screen.getByText('優先度: 高')).toBeInTheDocument();
    });

    it('中優先度が表示される', () => {
      const mediumTask = { ...mockTask, priority: 'medium' as const };
      renderTaskCard(mediumTask);
      expect(screen.getByText('優先度: 中')).toBeInTheDocument();
    });

    it('低優先度が表示される', () => {
      const lowTask = { ...mockTask, priority: 'low' as const };
      renderTaskCard(lowTask);
      expect(screen.getByText('優先度: 低')).toBeInTheDocument();
    });
  });

  describe('期限表示', () => {
    it('期限が表示される', () => {
      renderTaskCard();
      expect(screen.getByText(/期限: 2024\/12\/31/)).toBeInTheDocument();
    });

    it('期限がない場合は表示されない', () => {
      const taskWithoutDueDate = { ...mockTask, due_date: null };
      renderTaskCard(taskWithoutDueDate);
      expect(screen.queryByText(/期限:/)).not.toBeInTheDocument();
    });

    it('期限切れの場合は警告が表示される', () => {
      // 過去の日付を設定
      const overdueTask = { ...mockTask, due_date: '2020-01-01' };
      renderTaskCard(overdueTask);
      expect(screen.getByText(/期限切れ/)).toBeInTheDocument();
    });

    it('完了タスクは期限切れでも警告が表示されない', () => {
      const doneOverdueTask = {
        ...mockTask,
        status: 'done' as const,
        due_date: '2020-01-01',
      };
      renderTaskCard(doneOverdueTask);
      expect(screen.queryByText(/期限切れ/)).not.toBeInTheDocument();
    });

    it('未来の期限は期限切れ表示されない', () => {
      const futureTask = { ...mockTask, due_date: '2099-12-31' };
      renderTaskCard(futureTask);
      expect(screen.queryByText(/期限切れ/)).not.toBeInTheDocument();
    });
  });

  describe('ボタン操作', () => {
    it('編集ボタンが表示される', () => {
      renderTaskCard();
      expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
    });

    it('削除ボタンが表示される', () => {
      renderTaskCard();
      expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
    });

    it('編集ボタンをクリックするとonEditが呼ばれる', async () => {
      const user = userEvent.setup();
      renderTaskCard();

      const editButton = screen.getByRole('button', { name: '編集' });
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('削除ボタンをクリックして確認するとonDeleteが呼ばれる', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn(() => true);
      renderTaskCard();

      const deleteButton = screen.getByRole('button', { name: '削除' });
      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalledWith('このタスクを削除しますか？');
      expect(mockOnDelete).toHaveBeenCalledWith(1);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('削除ボタンをクリックしてキャンセルするとonDeleteが呼ばれない', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn(() => false);
      renderTaskCard();

      const deleteButton = screen.getByRole('button', { name: '削除' });
      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });
});
