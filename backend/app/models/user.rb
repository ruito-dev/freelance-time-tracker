class User < ApplicationRecord
  has_secure_password

  has_many :projects, dependent: :destroy

  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  # メールアドレスを小文字に正規化
  before_save :downcase_email

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end
end
