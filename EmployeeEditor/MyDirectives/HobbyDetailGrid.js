'use-strict';

mainApp.directive('hobbyDetailGrid',
    ['$q',
        function ($q) {
            var direvtiveDefinitionObject = {
                restrict: 'E',
                bindToController: true,
                controllerAs: 'hobbyDetailGrid',
                scope: {
                    onDirectiveReady: '='
                },
                controller: function ($scope, $element, $attrs) {
                    var ctrl = this;
                    var ctor = new Ctor(ctrl, $scope, $attrs);
                    ctor.initializeController();
                },
                templateUrl: '/MyDirectives/HobbyDetailGrid.html'
            };
            function Ctor(ctrl, $scope) {

                this.initializeController = initializeController;

                var context = {};
                //Initializing Controller Data And Defining Scope Parameters
                function initializeController() {
                    $scope.scopeModel = {};
                    $scope.scopeModel.hobbyDetailList = [];
                    $scope.scopeModel.hobbiesList = [];
                    $scope.scopeModel.AddNewHobbyDetail = AddNewHobbyDetail;
                    $scope.scopeModel.RemoveHobbyDetail = RemoveHobbyDetail;
                    $scope.scopeModel.ErrorList = [];
                    defineAPI();
                }

                //Extention Functions
                function extendSingleHobbyDetailObjForHobbySelector(hobby) {
                    hobby.hobbySelectorDeferred = $q.defer();
                    hobby.hobbySelectorDeferred.promise.then(
                        function () {
                            hobby.hobbySelectorApi.load(
                                {
                                    hobbiesList: getAllowedHobbiesForHobbyDetails(hobby),
                                    selectedHobbyId: hobby.ID,
                                    context: context
                                }
                            ).then(
                                function () {
                                    console.log("Selected Hobby ID Of Value: " + hobby.ID);
                                }
                            );
                        }
                    );
                    hobby.onHobbySelectorReady = function (api) {
                        hobby.hobbySelectorApi = api;
                        hobby.hobbySelectorDeferred.resolve();
                    }
                }
                function extendSingleHobbyDetailObjForFrequencyType(hobby) {
                    hobby.frequencyTypeDeffered = $q.defer();
                    hobby.frequencyTypeDeffered.promise.then(
                        function () {
                            hobby.frequencyTypeApi.load(
                                {
                                    selectedFrequencyType: hobby.FrequencyType,
                                }
                            ).then(
                                function () {
                                    console.log("Loaded Type Selector: " + hobby.FrequencyType);
                                }
                            );
                        }
                    );

                    hobby.onFrequencyTypeReady = function (api) {
                        hobby.frequencyTypeApi = api;
                        hobby.frequencyTypeDeffered.resolve();
                    }
                }
                function extendHobbyDetailsObjs() {
                    for (let i = 0; i < $scope.scopeModel.hobbyDetailList.length; i++) {

                        extendSingleHobbyDetailObjForHobbySelector(
                            $scope.scopeModel.hobbyDetailList[i]);

                        extendSingleHobbyDetailObjForFrequencyType(
                            $scope.scopeModel.hobbyDetailList[i]);
                    }
                }

                //Gets All Allowed Hobbies For One HobbyDetail
                function getAllowedHobbiesForHobbyDetails(hobbyDetail) {
                    var detailList = $scope.scopeModel.hobbyDetailList.map(arr => arr.ID);
                    var allowedHobbies = $scope.scopeModel.hobbiesList.filter
                        (arr => arr.ID == hobbyDetail.ID || !detailList.includes(arr.ID));
                    //console.log("*******************************************************");
                    //console.log("For Hobby: ");
                    //console.log(hobbyDetail);
                    //console.log("--------------------------Allowed Hobbies Are: ");
                    //console.log(allowedHobbies);
                    //console.log("*******************************************************");
                    return allowedHobbies;
                }

                //Manipulating HobbyDetailsList
                function RemoveHobbyDetail(hobbyDetail) {
                    let indexOfHobbyDetail = $scope.scopeModel.hobbyDetailList.indexOf(hobbyDetail);
                    $scope.scopeModel.hobbyDetailList.splice(indexOfHobbyDetail, 1);
                    refreshHobbyDetailGrid();
                }
                function AddNewHobbyDetail() {
                    let newHobbyDetailObj =
                    {
                        ID: "",
                        Frequency: 0,
                        FrequencyType: 0
                    };
                    extendSingleHobbyDetailObjForHobbySelector(newHobbyDetailObj);
                    extendSingleHobbyDetailObjForFrequencyType(newHobbyDetailObj);
                    $scope.scopeModel.hobbyDetailList.push(newHobbyDetailObj);
                }

                //Methods That Will Be Exposed Onto The Context To Allow Other Directives From Communicating
                function reloadHobbySelectorDropDown(item) {
                    item.hobbySelectorApi.load(
                        {
                            hobbiesList: getAllowedHobbiesForHobbyDetails(item),
                            selectedHobbyId: item.ID,
                            context: context
                        }
                    );
                }
                function refreshHobbyDetailGrid() {
                    for (let i = 0; i < $scope.scopeModel.hobbyDetailList.length; i++) {
                        if ($scope.scopeModel.hobbyDetailList[i].hobbySelectorApi == undefined) return;

                        $scope.scopeModel.hobbyDetailList[i].ID =
                            $scope.scopeModel.hobbyDetailList[i].hobbySelectorApi.getData();
                    }

                    for (let i = 0; i < $scope.scopeModel.hobbyDetailList.length; i++) {
                        reloadHobbySelectorDropDown($scope.scopeModel.hobbyDetailList[i]);
                    }
                }
                function updataHobbyDetailGrid(newHobbyList) {
                    $scope.scopeModel.hobbyList = newHobbyList;
                    refreshHobbyDetailGrid();
                }
                function removeHobbyDetailAccordingToId(hobbyId) {
                    for (let i = 0; i < $scope.scopeModel.hobbyDetailList.length; i++) {
                        if ($scope.scopeModel.hobbyDetailList[i].ID == hobbyId
                            || $scope.scopeModel.hobbyDetailList[i].ID == '') {
                            $scope.scopeModel.hobbyDetailList.splice(i, 1);
                            refreshHobbyDetailGrid();
                        }
                    }
                }


                function defineAPI() {
                    var api = {};
                    api.load = function (payload) {
                        context = payload.context;
                        context.updataHobbyDetailGrid = updataHobbyDetailGrid;
                        context.refreshHobbyDetailGrid = refreshHobbyDetailGrid;
                        context.removeHobbyDetailAccordingToId = removeHobbyDetailAccordingToId;
                        var directiveLoaded = $q.defer();
                        if (context.getAllHobbies != undefined
                            && typeof (context.getAllHobbies) == 'function') {
                            $scope.scopeModel.hobbiesList = context.getAllHobbies();
                        }
                        $scope.scopeModel.hobbyDetailList = payload.hobbyDetailList;
                        extendHobbyDetailsObjs();
                        directiveLoaded.resolve();

                        return directiveLoaded.promise;
                    };

                    api.getData = function () {
                        //Collecting Data From Sub-Directives
                        for (let i = 0; i < $scope.scopeModel.hobbyDetailList.length; i++) {
                            $scope.scopeModel.hobbyDetailList[i].ID =
                                $scope.scopeModel.hobbyDetailList[i].hobbySelectorApi.getData();
                            $scope.scopeModel.hobbyDetailList[i].FrequencyType
                                = $scope.scopeModel.hobbyDetailList[i].frequencyTypeApi.getData();
                        }
                        return $scope.scopeModel.hobbyDetailList;
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
