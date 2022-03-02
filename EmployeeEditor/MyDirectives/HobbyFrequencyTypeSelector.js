'use-strict';
mainApp.directive('hobbyFrequencyTypeSelector',
    ['$q', 'FrequencyType',
        function ($q, FrequencyType) {
            var direvtiveDefinitionObject = {
                restrict: 'E',
                bindToController: true,
                controllerAs: 'hobbyFrequencyTypeSelector',
                scope: {
                    onDirectiveReady: '='
                },
                controller: function ($scope, $element, $attrs) {
                    var ctrl = this;
                    var ctor = new Ctor(ctrl, $scope, $attrs);
                    ctor.initializeController();
                },
                templateUrl: '/MyDirectives/HobbyFrequencyTypeSelector.html'
            };
            function Ctor(ctrl, $scope) {
                this.initializeController = initializeController;
                function initializeController() {
                    $scope.scopeModel = {};
                    $scope.scopeModel.frequencyTypeEnum = FrequencyType;
                    $scope.scopeModel.selectedFrequencyType = 0;
                    defineAPI();
                }
                $scope.printNewFrequency = function () {
                    console.log("New Frequency Type Is : " + $scope.scopeModel.selectedFrequencyType);
                }
                function defineAPI() {
                    var api = {};
                    api.load = function (payload) {
                        var directiveLoaded = $q.defer();

                        $scope.scopeModel.selectedFrequencyType = payload.selectedFrequencyType;

                        directiveLoaded.resolve();
                        return directiveLoaded.promise;
                    };

                    api.getData = function () {
                        console.log("When Getting Frequnecy Type Result Was" + $scope.scopeModel.selectedFrequencyType);
                        return $scope.scopeModel.selectedFrequencyType;
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

