module Api
  module V1
    class TimeEntriesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_time_entry, only: %i[show update destroy]

      # GET /api/v1/time_entries
      def index
        @time_entries = TimeEntry.joins(task: :project)
                                  .where(projects: { user_id: current_user.id })
                                  .includes(:task, task: :project)
                                  .order(started_at: :desc)

        # フィルタリング
        @time_entries = @time_entries.where(task_id: params[:task_id]) if params[:task_id].present?
        if params[:project_id].present?
          @time_entries = @time_entries.where(tasks: { project_id: params[:project_id] })
        end
        if params[:start_date].present?
          @time_entries = @time_entries.where("started_at >= ?", params[:start_date])
        end
        @time_entries = @time_entries.where("started_at <= ?", params[:end_date]) if params[:end_date].present?

        render json: @time_entries, include: { task: { include: :project } }
      end

      # GET /api/v1/time_entries/:id
      def show
        render json: @time_entry, include: { task: { include: :project } }
      end

      # POST /api/v1/time_entries
      def create
        task = Task.joins(:project).find_by(id: time_entry_params[:task_id], projects: { user_id: current_user.id })
        unless task
          return render json: { error: "タスクが見つかりません" }, status: :not_found
        end

        @time_entry = TimeEntry.new(time_entry_params)

        if @time_entry.save
          render json: @time_entry, status: :created, include: { task: { include: :project } }
        else
          render json: { errors: @time_entry.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/time_entries/:id
      def update
        if @time_entry.update(time_entry_params)
          render json: @time_entry, include: { task: { include: :project } }
        else
          render json: { errors: @time_entry.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/time_entries/:id
      def destroy
        @time_entry.destroy
        head :no_content
      end

      # GET /api/v1/time_entries/summary
      def summary
        @time_entries = TimeEntry.joins(task: :project)
                                  .where(projects: { user_id: current_user.id })

        # 日付範囲でフィルタリング
        if params[:start_date].present?
          @time_entries = @time_entries.where("started_at >= ?", params[:start_date])
        end
        if params[:end_date].present?
          @time_entries = @time_entries.where("started_at <= ?", params[:end_date])
        end

        total_duration = @time_entries.sum(:duration)
        
        render json: { total_duration: total_duration }
      end

      private

      def set_time_entry
        @time_entry = TimeEntry.joins(task: :project)
                               .where(projects: { user_id: current_user.id })
                               .find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "時間記録が見つかりません" }, status: :not_found
      end

      def time_entry_params
        params.require(:time_entry).permit(:task_id, :started_at, :ended_at, :description)
      end
    end
  end
end
