Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'page#show'
  scope :work do
    get 'request', to: 'work#request_work'
    post 'submit', to: 'work#submit_work'
  end
end
