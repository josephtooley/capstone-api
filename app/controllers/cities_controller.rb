class CitiesController < ApplicationController
  def index
    @cities = City.all
  end

  def create
    @city = City.new(city_params)

    if @city.save
      render :show, status: :created, location: @city
    else
      render json: @city.errors, status: :unprocessable_entity
    end
  end

  def update
    @city = City.find(params[:id])

    if @city.update(city_params)
      head :no_content
    else
      render json: @city.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @city = City.find(params[:id])
    @city.destroy

    head :no_content
  end

  private

    def set_city
      @city = City.find(params[:id])
    end

    def city_params
      params.require(:city).permit(:name)
    end

end
