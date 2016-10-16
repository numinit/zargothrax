Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'page#home'
  get 'visualize', to: 'page#visualize'

  scope :work do
    get 'request', to: 'work#request_work'
    post 'submit', to: 'work#submit_work'
    get 'recent', to: 'work#recent_work'
  end
end
