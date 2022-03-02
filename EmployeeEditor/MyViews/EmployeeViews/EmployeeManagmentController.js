'use-strict';

function EmployeeManagmentController($scope, EmployeeWebApiService, PaginationService, ModalService) {
    defineScope();
    load();
    function load() {
        function loadAllControls() {
            function loadStaticData() { };
            function loadData() {
                GetEmployees();
            };
            loadStaticData();
            loadData();
        }
        loadAllControls();
    }
    function defineScope() {
        $scope.scopeModel = {};
        $scope.scopeModel.employeesData = {};
        $scope.scopeModel.searchVal = '';
        $scope.scopeModel.GetEmployees = GetEmployees;
        $scope.scopeModel.setPage = setPage;
        $scope.scopeModel.currentPage = {};
        $scope.scopeModel.currentPageDescription = null;
        $scope.scopeModel.openAddModal = openAddModal;
        $scope.scopeModel.openEditModal = openEditModal;
    }

    ///Handling Pagination For Student Table
    function buildPaginationList() {
        $scope.scopeModel.paginationPagesList = PaginationService.getPages($scope.scopeModel.employeesData);
    }
    function setPage(pageDescription) {
        $scope.scopeModel.currentPageDescription = pageDescription;
        $scope.scopeModel.currentPage = PaginationService.setPage($scope.scopeModel.employeesData, pageDescription);
    }

    //Reading All Students Without Any Filtering 
    function GetEmployees() {
        EmployeeWebApiService.GetEmployees($scope.scopeModel.searchVal).then(
            function (result) {
                $scope.scopeModel.employeesData = result.data;
                if (result.data.length == 0) {
                    $scope.scopeModel.currentPage = {};
                    $scope.scopeModel.currentPageDescription = null;
                    setPage($scope.scopeModel.paginationPagesList[0]);
                    return;
                }
                buildPaginationList();
                setPage($scope.scopeModel.paginationPagesList[0]);
                console.log("GetEmployees() Succeded");
            }
        ).catch(
            function () {
                console.log("GetEmployees() Failed");
            }
        );
    }


    //This methods shows the popup modal for add 
    function openAddModal() {
        function onEmployeAdded() {
            console.log("Adder Modal Closed And Data Is Being Updated");
            GetEmployees();
        }

        ModalService.openModal(
            '/MyViews/EmployeeViews/EmployeeEditor.html',
            { isEditMode: false }, onEmployeAdded);

    }

    function openEditModal(employeeId) {
        function onEmployeeEdited() {
            console.log("Editor Modal Closed And Data Is Being Updated");
            GetEmployees();
        }

        ModalService.openModal(
            '/MyViews/EmployeeViews/EmployeeEditor.html',
            { employeeId: employeeId, isEditMode: true },
            onEmployeeEdited);

    }

}

mainApp.controller('EmployeeManagmentController', EmployeeManagmentController);