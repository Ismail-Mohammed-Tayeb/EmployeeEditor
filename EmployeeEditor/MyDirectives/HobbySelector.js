'use-strict';
mainApp.directive('hobbySelector',
    ['$q',
        function ($q) {
            var direvtiveDefinitionObject = {
                restrict: 'E',
                bindToController: true,
                controllerAs: 'hobbySelector',
                scope: {
                    onDirectiveReady: '='
                },
                controller: function ($scope, $element, $attrs) {
                    var ctrl = this;
                    var ctor = new Ctor(ctrl, $scope, $attrs);
                    ctor.initializeController();
                },
                templateUrl: '/MyDirectives/HobbySelector.html'
            };
            function Ctor(ctrl, $scope) {
                this.initializeController = initializeController;
                var context = {};
                function initializeController() {
                    $scope.scopeModel = {};
                    $scope.scopeModel.hobbiesList = [];
                    $scope.scopeModel.selectedHobbyId = 0;
                    $scope.scopeModel.selectedItemChanged = function () {
                        if (context.refreshHobbyDetailGrid != undefined
                            && typeof (context.refreshHobbyDetailGrid) == 'function') {
                            context.refreshHobbyDetailGrid();
                        }
                    };
                    defineAPI();
                }

                function defineAPI() {
                    var api = {};

                    api.load = function (payload) {
                        console.log("Called Load For HobbySelector With ID: " + payload.selectedHobbyId);
                        context = payload.context;
                        var directiveLoaded = $q.defer();
                        $scope.scopeModel.hobbiesList = payload.hobbiesList;
                        $scope.scopeModel.selectedHobbyId = payload.selectedHobbyId;
                        directiveLoaded.resolve();
                        return directiveLoaded.promise;
                    };

                    api.getData = function () {
                        return $scope.scopeModel.selectedHobbyId;
                    };

                    if (ctrl.onDirectiveReady != null
                        && typeof (ctrl.onDirectiveReady) == "function") {
                        ctrl.onDirectiveReady(api);
                    }
                }
            }
            return direvtiveDefinitionObject;
        }
    ]);

