class WorkController < ApplicationController
  before_action :set_cookie

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
        script: ActionController::Base.helpers.asset_path(File.join('payloads', project.script_name)),
        timeout: project.timeout,
        delay: project.worker_delay,
        arguments: unit.arguments,
        nonce: request.nonce.unpack('H*').first
      }
      render status: 200, json: {result: entity}
    else
      render status: 408, json: {error: :TRY_AGAIN_LATER}
    end
  end

  def submit_work
    if not (args=params[:params]).is_a?(ActionController::Parameters) or
       not (id=args[:id]).is_a?(String) or
       not (nonce_str=args[:nonce]).is_a?(String) or
       not (nonce=[nonce_str].pack('H*')).bytesize == nonce_str.bytesize / 2 or
       not (result=args[:result]).is_a?(ActionController::Parameters)
      render status: 400, json: {error: :BAD_REQUEST}
      return
    end

    wr = WorkRequest.where(id: id, nonce: nonce).take
    if wr.nil?
      render status: 404, json: {error: :NOT_FOUND}
    else
      wr.complete result
      render status: 202, json: {result: :OK}
    end
  end

  MAX_RECENT_WORK = 10
  def recent_work
    if not (limit=params[:limit]).is_a?(String) or
           (limit=limit.to_i) <= 0 or
           limit > MAX_RECENT_WORK
      render status: 400, json: {error: :BAD_REQUEST}
      return
    end

    reqs = WorkRequest.where(completed: true).order(updated_at: :desc).limit(limit).map do |req|
      {id: req.id, result: req.result}
    end
    render status: 200, json: {result: reqs}
  end

  private
  def set_cookie
    cookies.permanent.signed[:zxid] ||= SecureRandom.hex(16)
  end
end
