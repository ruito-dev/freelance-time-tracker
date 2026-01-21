import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types/project';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProjectCard', () => {
  const mockProject: Project = {
    id: 1,
    name: 'テストプロジェクト',
    description: 'これはテスト用のプロジェクトです',
    color: '#3B82F6',
    user_id: 1,
    tasks_count: 5,
    total_hours: 12.5,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderProjectCard = (project: Project = mockProject) => {
    return render(
      <BrowserRouter>
        <ProjectCard project={project} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </BrowserRouter>
    );
  };

  describe('レンダリング', () => {
    it('プロジェクト名が表示される', () => {
      renderProjectCard();
      expect(screen.getByText('テストプロジェクト')).toBeInTheDocument();
    });

    it('プロジェクトの説明が表示される', () => {
      renderProjectCard();
      expect(screen.getByText('これはテスト用のプロジェクトです')).toBeInTheDocument();
    });

    it('説明がない場合は表示されない', () => {
      const projectWithoutDescription = { ...mockProject, description: null };
      renderProjectCard(projectWithoutDescription);
      expect(screen.queryByText('これはテスト用のプロジェクトです')).not.toBeInTheDocument();
    });

    it('プロジェクトカラーが表示される', () => {
      renderProjectCard();
      const colorElement = screen.getByLabelText('プロジェクトカラー');
      expect(colorElement).toHaveStyle({ backgroundColor: '#3B82F6' });
    });

    it('タスク数が表示される', () => {
      renderProjectCard();
      expect(screen.getByText('5 タスク')).toBeInTheDocument();
    });

    it('タスク数が0の場合も表示される', () => {
      const projectWithNoTasks = { ...mockProject, tasks_count: 0 };
      renderProjectCard(projectWithNoTasks);
      expect(screen.getByText('0 タスク')).toBeInTheDocument();
    });

    it('合計時間が正しくフォーマットされて表示される', () => {
      renderProjectCard();
      expect(screen.getByText('12時間30分')).toBeInTheDocument();
    });

    it('合計時間が0の場合は「0時間」と表示される', () => {
      const projectWithNoHours = { ...mockProject, total_hours: 0 };
      renderProjectCard(projectWithNoHours);
      expect(screen.getByText('0時間')).toBeInTheDocument();
    });

    it('合計時間が整数の場合は分を表示しない', () => {
      const projectWithWholeHours = { ...mockProject, total_hours: 10 };
      renderProjectCard(projectWithWholeHours);
      expect(screen.getByText('10時間')).toBeInTheDocument();
    });

    it('作成日が日本語形式で表示される', () => {
      renderProjectCard();
      expect(screen.getByText(/作成日: 2024\/1\/15/)).toBeInTheDocument();
    });
  });

  describe('ボタン操作', () => {
    it('編集ボタンが表示される', () => {
      renderProjectCard();
      expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
    });

    it('削除ボタンが表示される', () => {
      renderProjectCard();
      expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
    });

    it('編集ボタンをクリックするとonEditが呼ばれる', async () => {
      const user = userEvent.setup();
      renderProjectCard();
      
      const editButton = screen.getByRole('button', { name: '編集' });
      await user.click(editButton);
      
      expect(mockOnEdit).toHaveBeenCalledWith(mockProject);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('削除ボタンをクリックして確認するとonDeleteが呼ばれる', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn(() => true);
      renderProjectCard();
      
      const deleteButton = screen.getByRole('button', { name: '削除' });
      await user.click(deleteButton);
      
      expect(window.confirm).toHaveBeenCalledWith('「テストプロジェクト」を削除してもよろしいですか？');
      expect(mockOnDelete).toHaveBeenCalledWith(1);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('削除ボタンをクリックしてキャンセルするとonDeleteが呼ばれない', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn(() => false);
      renderProjectCard();
      
      const deleteButton = screen.getByRole('button', { name: '削除' });
      await user.click(deleteButton);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    it('タスク数をクリックするとタスクページに遷移する', async () => {
      const user = userEvent.setup();
      renderProjectCard();
      
      const tasksButton = screen.getByText('5 タスク').closest('button');
      await user.click(tasksButton!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/tasks?project=1');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('時間フォーマット', () => {
    it('1.5時間は「1時間30分」と表示される', () => {
      const project = { ...mockProject, total_hours: 1.5 };
      renderProjectCard(project);
      expect(screen.getByText('1時間30分')).toBeInTheDocument();
    });

    it('0.25時間は「0時間15分」と表示される', () => {
      const project = { ...mockProject, total_hours: 0.25 };
      renderProjectCard(project);
      expect(screen.getByText('0時間15分')).toBeInTheDocument();
    });

    it('24時間は「24時間」と表示される', () => {
      const project = { ...mockProject, total_hours: 24 };
      renderProjectCard(project);
      expect(screen.getByText('24時間')).toBeInTheDocument();
    });

    it('100.75時間は「100時間45分」と表示される', () => {
      const project = { ...mockProject, total_hours: 100.75 };
      renderProjectCard(project);
      expect(screen.getByText('100時間45分')).toBeInTheDocument();
    });
  });
});
