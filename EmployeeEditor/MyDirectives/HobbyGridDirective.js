'use-strict';
mainApp.directive('hobbyGrid',
    ['$q', 'EmployeeWebApiService',
        function ($q, EmployeeWebApiService) {
            var direvtiveDefinitionObject = {
                restrict: 'E',
                bindToController: true,
                controllerAs: 'hobbyGrid',
                scope: {
                    onDirectiveReady: '='
                },
                controller: function ($scope, $element, $attrs) {
                    var ctrl = this;
                    var ctor = new Ctor(ctrl, $scope, $attrs);
                    ctor.initializeController();
                },
                templateUrl: '/MyDirectives/HobbyGridDirective.html'
            };
            function Ctor(ctrl, $scope) {
                this.initializeController = initializeController;
                var context = {};
                function initializeController() {
                    console.log("Called Initialize Controller On HobbyGridDirective");
                    $scope.scopeModel = {};
                    $scope.scopeModel.duplicateRowMessage = "";
                    $scope.scopeModel.Hobbies = [];
                    $scope.scopeModel.AddNewHobby = AddNewHobby;
                    $scope.scopeModel.RemoveCurrentHobby = RemoveCurrentHobby;
                    $scope.scopeModel.ErrorList = [];
                    defineAPI();
                }
                $scope.$watchCollection(
                    function () {
                        return $scope.scopeModel.Hobbies
                            .map(item => item.Name.toLowerCase());
                    },
                    function () {
                        console.log("Entered Watch in HobbyDirectiveGrid");
                        $scope.scopeModel.ErrorList = [];

                        for (let i = 0; i < $scope.scopeModel.Hobbies.length; i++) {
                            checkHobbyNameValidty($scope.scopeModel.Hobbies[i].Name, i);
                        }

                        if (context.updataHobbyDetailGrid != null
                            && typeof (context.updataHobbyDetailGrid) == "function") {
                            context.updataHobbyDetailGrid($scope.scopeModel.Hobbies);
                        }

                    }
                );

                function RemoveCurrentHobby(hobby) {
                    let hobbyIndex = $scope.scopeModel.Hobbies.indexOf(hobby);
                    $scope.scopeModel.Hobbies.splice(hobbyIndex, 1);
                    if (context.removeHobbyDetailAccordingToId != undefined
                        && typeof (context.removeHobbyDetailAccordingToId) == 'function') {
                        context.removeHobbyDetailAccordingToId(hobby.ID);
                    }
                }

                function checkHobbyNameValidty(hobbyName, index) {

                    if (hobbyName.trim() == "") {
                        $scope.scopeModel.ErrorList.push("Hobby Name Empty At Row: " + (index + 1));
                        return;
                    }
                    let firstOccurence = $scope.scopeModel.Hobbies
                        .map(item => item.Name.toLowerCase())
                        .indexOf(hobbyName.toLowerCase());

                    let lastOccurence = $scope.scopeModel.Hobbies
                        .map(item => item.Name.toLowerCase())
                        .lastIndexOf(hobbyName.toLowerCase());

                    if (firstOccurence != lastOccurence) {
                        console.log("Hobby Name Duplicated For Value Of: " + hobbyName);
                        $scope.scopeModel.ErrorList.push(
                            "Hobby Name Duplicated For Value Of: "
                            + hobbyName + " At Row: " + (index + 1));
                        return;
                    }
                }
                function AddNewHobby() {
                    EmployeeWebApiService.GetGUID().then(
                        function (result) {
                            let starterHobbyObj = {
                                ID: result.data,
                                Name: ''
                            };
                            $scope.scopeModel.Hobbies.push(starterHobbyObj);
                        }
                    );
                }

                function defineAPI() {
                    var api = {};
                    api.load = function (payload) {
                        console.log("Entered Load On HobbyGridDirective");
                        context = payload.context;
                        context.getAllHobbies = function () {
                            return $scope.scopeModel.Hobbies;
                        }
                        var directiveLoaded = $q.defer();
                        $scope.scopeModel.Hobbies = payload.Hobbies;

                        directiveLoaded.resolve();
                        return directiveLoaded.promise;
                    };

                    api.getData = function () {
                        return $scope.scopeModel.Hobbies;
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

