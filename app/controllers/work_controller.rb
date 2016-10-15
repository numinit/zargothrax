class WorkController < ApplicationController
  before_filter :set_cookie

  def set_cookie
    cookies.permanent.signed[:zxid] ||= SecureRandom.hex(16)
  end

  def request_work
    render json: {ok: true}
  end

  def submit_work

  end
end
