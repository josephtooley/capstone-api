(function () {
  "use strict";

  angular
    .module("spa.cities")
    .controller("spa.cities.CityController", CityController);

  CityController.$inject = [ "spa.cities.City" ];

  function CityController(City) {
    var vm = this;

    vm.cities;
    vm.city;

    activate();
    return;

    function activate() {
      vm.city = new City();
    }

    function handleError(response) {
      console.log(response);
    }

    function edit(object, index) {
    }

    function create() {
    }

    function update() {
    }

    function remove() {
    }

    function removeElement(elements, element) {
    }

  }

})();
