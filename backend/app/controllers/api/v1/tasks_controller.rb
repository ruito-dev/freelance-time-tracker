module Api
  module V1
    class TasksController < ApplicationController
      before_action :authenticate_user!
      before_action :set_project, only: [ :index, :create ]
      before_action :set_task, only: %i[show update destroy]

      # GET /api/v1/projects/:project_id/tasks
      def index
        @tasks = @project.tasks.order(created_at: :desc)
        render json: @tasks
      end

      # GET /api/v1/tasks/:id
      def show
        render json: @task
      end

      # POST /api/v1/projects/:project_id/tasks
      def create
        @task = @project.tasks.build(task_params)

        if @task.save
          render json: @task, status: :created
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/tasks/:id
      def update
        if @task.update(task_params)
          render json: @task
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/tasks/:id
      def destroy
        @task.destroy
        head :no_content
      end

      private

      def set_project
        @project = current_user.projects.find(params[:project_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "プロジェクトが見つかりません" }, status: :not_found
      end

      def set_task
        @task = Task.joins(:project).where(projects: { user_id: current_user.id }).find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "タスクが見つかりません" }, status: :not_found
      end

      def task_params
        params.require(:task).permit(:title, :description, :status, :estimated_hours)
      end
    end
  end
end
