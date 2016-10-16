class WorkController < ApplicationController
  before_filter :set_cookie

  def set_cookie
    cookies.permanent.signed[:zxid] ||= SecureRandom.hex(16)
  end

  def request_work
    # Pick a random enabled project
    avail = Project.available
    avail = avail.includes(:work_units => :work_requests)
    avail = avail.references(:projects, :work_units, :work_requests)
    avail = avail.where('extract(epoch from work_requests.time_issued) < (extract(epoch from now()) - (projects.timeout / 1000.0))')
    avail = avail.where('(SELECT count(*) from work_requests wr where wr.work_unit_id = work_units.id AND NOT wr.completed) > 0')
    avail = avail.where(work_requests: {completed: false})
    project = avail.take
    unit = project ? project.work_units.take : nil
    request = unit ? unit.work_requests.take : nil
    if request
      # Issue this request
      request = request.issue

      entity = {
        id: request.id,
        script: project.script_name,
        timeout: project.timeout,
        arguments: unit.arguments,
        nonce: request.nonce.unpack('H*').first
      }
      render json: {result: entity}
    else
      render json: {error: :TRY_AGAIN_LATER}
    end
  end

  def submit_work

  end
end
