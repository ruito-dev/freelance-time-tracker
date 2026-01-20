FactoryBot.define do
  factory :project do
    association :user
    name { "プロジェクト#{rand(1000)}" }
    description { "プロジェクトの説明" }
    color { "##{SecureRandom.hex(3)}" }
  end
end
