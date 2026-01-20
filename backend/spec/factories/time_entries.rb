FactoryBot.define do
  factory :time_entry do
    association :user
    association :task
    start_time { 2.hours.ago }
    end_time { 1.hour.ago }
    description { "作業内容の説明" }
  end
end
