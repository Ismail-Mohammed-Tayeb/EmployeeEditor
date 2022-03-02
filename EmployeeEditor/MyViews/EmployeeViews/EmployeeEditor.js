'use-strict';
var EmployeeEditor = function ($scope, $q, EmployeeWebApiService, PromisesService) {
    //Context Obj That will hold function for the next method
    var context = {};
    var hobbyGridApi;
    var hobbyGridApiDeffered = $q.defer();
    $scope.onHobbyGridReady = function (api) {
        hobbyGridApi = api;
        hobbyGridApiDeffered.resolve();
    };

    var hobbyDetailGridApi;
    var hobbyDetailGridApiDeferred = $q.defer();
    $scope.onHobbyDetailGridReady = function (api) {
        hobbyDetailGridApi = api;
        hobbyDetailGridApiDeferred.resolve();
    }
    function loadItemDirective() {
        var promises = [];

        promises.push(hobbyGridApiDeffered.promise);

        hobbyGridApiDeffered.promise.then(
            function () {
                hobbyGridApi.load({
                    Hobbies: $scope.scopeModel.employeeInfo.Hobbies,
                    context: context
                })
            });

        promises.push(hobbyDetailGridApiDeferred.promise);
        hobbyDetailGridApiDeferred.promise.then(
            function () {
                hobbyDetailGridApi.load({
                    hobbyDetailList: $scope.scopeModel.employeeInfo.HobbyDetails,
                    context: context
                });
            }
        );
        return PromisesService.waitMultiplePromises(promises);
    }

    function defineScope() {
        $scope.scopeModel = {};
        $scope.scopeModel.buttonText = "";
        $scope.scopeModel.isEdit = false;
        $scope.scopeModel.AddEmployee = AddEmployee;
        $scope.scopeModel.EditEmployee = EditEmployee;
        $scope.scopeModel.CloseModal = CloseModal;
        $scope.scopeModel.employeeInfo = {
            ID: -1,
            Name: '',
            Hobbies: [],
            HobbyDetails: []
        };
    }

    function load() {
        function loadAllControls() {
            function loadStaticData() { };
            function loadData() {
                LoadEmployeeData();
            };
            loadStaticData();
            loadData();
        }
        loadAllControls();
    }

    function LoadEmployeeData() {
        if ($scope.parameters.isEditMode) {
            //Edit Case
            $scope.scopeModel.isEdit = true;
            EmployeeWebApiService.GetEmployeeById($scope.parameters.employeeId).then(
                function (result) {
                    console.log("Employee's Data Was:");
                    console.log(result.data);
                    $scope.scopeModel.employeeInfo.ID = result.data.ID;
                    $scope.scopeModel.employeeInfo.Name = result.data.Name;
                    $scope.scopeModel.employeeInfo.Hobbies = result.data.Hobbies;
                    $scope.scopeModel.employeeInfo.HobbyDetails = result.data.HobbyDetails;
                    $scope.scopeModel.buttonText = "Edit";
                    loadItemDirective();
                }
            );
            return;
        }

        //Add Case
        $scope.scopeModel.employeeInfo.ID = 'ID is Autoincremented and Not Assignable';
        $scope.scopeModel.buttonText = "Add";
        $scope.isEdit = false;
        loadItemDirective();
    }

    function CloseModal() {
        $scope.Close();
    }

    function buildEmployeeObj() {
        //Student Obj init
        let finalEmployeeObj = {};

        //Getting Data From Directives
        let hobbiesData = hobbyGridApi.getData();
        let hobbyDetailsData = hobbyDetailGridApi.getData();

        //Assigning Values to FinalStudent Object to add or edit later on
        finalEmployeeObj.ID = $scope.scopeModel.employeeInfo.ID;
        finalEmployeeObj.Name = $scope.scopeModel.employeeInfo.Name;
        finalEmployeeObj.Hobbies = hobbiesData;
        finalEmployeeObj.HobbyDetails = hobbyDetailsData;
        console.log("Employee Object Created:");
        console.log(finalEmployeeObj);
        return finalEmployeeObj;
    }
    function isAllowedToAddOrEdit(employeeObj) {
        let isNameFilled = (employeeObj.Name.trim() != '');
        let hasHobbies = (employeeObj.Hobbies.length != 0);
        let hasHobbyDetails = (employeeObj.HobbyDetails.length != 0);
        let allHobbiesHaveDetails = (employeeObj.Hobbies.length == employeeObj.HobbyDetails.length);
        let allHobbiesAreFilled = true;
        for (let i = 0; i < employeeObj.Hobbies.length; i++) {
            if (employeeObj.Hobbies[i].Name.trim() == '') {
                allHobbiesAreFilled = false;
                break;
            }
        }
        let allHobbyDetailsArePicked = true;
        for (let i = 0; i < employeeObj.HobbyDetails.length; i++) {
            if (employeeObj.HobbyDetails[i].ID == ''
                || employeeObj.HobbyDetails[i].ID == undefined) {
                allHobbyDetailsArePicked = false;
            }
        }

        return isNameFilled && hasHobbies
            && hasHobbyDetails && allHobbiesHaveDetails
            && allHobbiesAreFilled && allHobbyDetailsArePicked;
    }

    function AddEmployee() {
        let finalEmployee = buildEmployeeObj();
        if (!isAllowedToAddOrEdit(finalEmployee)) {

            alert("Please Fill All Fields And Pick All Added Hobbies Before Adding An Employee");
            return;
        }
        EmployeeWebApiService.AddEmployee(finalEmployee)
            .then(
                function (result) {
                    console.log("Adding Employee Result Was: " + result.data);
                    CloseModal();
                })
            .catch(
                function () {
                    console.log("An Error Occured While Adding New Employee");
                });
    }

    function EditEmployee() {
        let finalEmployee = buildEmployeeObj();
        if (!isAllowedToAddOrEdit(finalEmployee)) {
            alert("Please Fill All Fields And Pick All Added Hobbies Before Editing An Employee");
            return;
        }
        EmployeeWebApiService.EditEmployee(finalEmployee)
            .then(
                function (result) {
                    console.log("Editing Employee Result Was: " + result.data);
                    CloseModal();
                })
            .catch(function () {
                console.log("An Error Occured While Editing Old Employee");
            });
    }

    defineScope();
    load();
}

mainApp.controller('EmployeeEditor', EmployeeEditor);