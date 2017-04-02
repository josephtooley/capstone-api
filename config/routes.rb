Rails.application.routes.draw do
  scope :api, defaults: { :format => :json } do
    resources :cities, :except => [ :new, :edit ]
  end

  root "ui#index"
end
