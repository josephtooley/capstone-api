(function() {
  "use strict";

  angular
    .module("spa-demo.foos")
    .factory("Foo", FooFactory);

  FooFactory.$inject = [];
  function FooFactory() {
    return $resource(APP_CONFIG.server_url + "/api/foos?:id",
      { id: '@id' },
      {
        update: { method: "PUT" }
      }
    );
  }

})();
