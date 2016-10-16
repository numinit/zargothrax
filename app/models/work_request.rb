class WorkRequest < ApplicationRecord
  belongs_to :work_unit

  def expire
    @readonly = false
    self.time_issued = Time.at(0)
    self.save
    self
  end

  def issue
    @readonly = false
    self.time_issued = Time.now.utc
    self.nonce = generate_nonce
    self.save
    self
  end

  private
  def generate_nonce
    SecureRandom.random_bytes(16)
  end
end
