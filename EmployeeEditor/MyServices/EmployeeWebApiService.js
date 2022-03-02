"use-strict";

var EmployeeWebApiService = function (WebApiService) {

    function GetGUID() {
        return WebApiService.Get('https://localhost:44342/api/Employee/GetGUID');
    }
    function GetEmployees(searchVal = "") {
        return WebApiService.Get('https://localhost:44342/api/Employee/GetEmployees',
            {
                searchVal: searchVal.trim()
            });
    }

    function GetEmployeeById(employeeId) {
        return WebApiService.Get('https://localhost:44342/api/Employee/GetEmployeeByID',
            {
                employeeId: employeeId
            }
        );
    }

    function AddEmployee(employee) {
        return WebApiService.Post('https://localhost:44342/api/Employee/AddEmployee', employee);
    }

    function EditEmployee(employee) {
        return WebApiService.Post('https://localhost:44342/api/Employee/EditEmployee', employee);
    }
    return {
        GetEmployees: GetEmployees,
        GetEmployeeById: GetEmployeeById,
        AddEmployee: AddEmployee,
        EditEmployee: EditEmployee,
        GetGUID: GetGUID
    };

}
mainApp.service("EmployeeWebApiService", EmployeeWebApiService);