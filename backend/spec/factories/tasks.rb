FactoryBot.define do
  factory :task do
    association :project
    title { "タスク#{rand(1000)}" }
    description { "タスクの説明" }
    status { "todo" }
    estimated_hours { 5.0 }
  end
end
