Rails.application.routes.draw do
  get 'states/index'

  scope :api, defaults: { :format => :json } do
    resources :cities, :except => [ :new, :edit ]
    resources :states, :except => [ :new, :edit ]
  end

  root "ui#index"
end
