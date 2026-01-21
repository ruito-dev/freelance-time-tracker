FactoryBot.define do
  factory :time_entry do
    association :task
    started_at { 2.hours.ago }
    ended_at { 1.hour.ago }
    description { "作業内容の説明" }
  end
end
