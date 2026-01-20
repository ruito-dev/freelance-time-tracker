module Api
  module V1
    class TimeEntriesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_time_entry, only: %i[show update destroy]

      # GET /api/v1/time_entries
      def index
        @time_entries = current_user.time_entries
                                    .includes(:task, task: :project)
                                    .order(start_time: :desc)

        # フィルタリング
        @time_entries = @time_entries.where(task_id: params[:task_id]) if params[:task_id].present?
        if params[:project_id].present?
          @time_entries = @time_entries.joins(task: :project).where(tasks: { project_id: params[:project_id] })
        end
        if params[:start_date].present?
          @time_entries = @time_entries.where("start_time >= ?", params[:start_date])
        end
        @time_entries = @time_entries.where("start_time <= ?", params[:end_date]) if params[:end_date].present?

        render json: @time_entries, include: { task: { include: :project } }
      end

      # GET /api/v1/time_entries/:id
      def show
        render json: @time_entry, include: { task: { include: :project } }
      end

      # POST /api/v1/time_entries
      def create
        @time_entry = current_user.time_entries.build(time_entry_params)

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

      private

      def set_time_entry
        @time_entry = current_user.time_entries.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "時間記録が見つかりません" }, status: :not_found
      end

      def time_entry_params
        params.require(:time_entry).permit(:task_id, :start_time, :end_time, :description)
      end
    end
  end
end
