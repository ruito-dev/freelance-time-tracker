FactoryBot.define do
  factory :task do
    association :project
    title { "タスク#{rand(1000)}" }
    description { "タスクの説明" }
    status { "todo" }
    priority { "medium" }
    due_date { nil }
  end
end
