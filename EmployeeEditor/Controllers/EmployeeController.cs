using EmployeeEditor.Controllers.EmployeeDataManagers;
using EmployeeEditor.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace EmployeeEditor.Controllers
{
    public class EmployeeController : ApiController
    {
        [HttpGet]
        public string GetGUID()
        {
            return Guid.NewGuid().ToString();
        }

        [HttpGet]
        public IEnumerable<Employee> GetEmployees([FromUri] string searchVal = "")
        {
            return EmployeeManager.GetFilteredEmployees(searchVal ?? "");
        }

        [HttpGet]
        public Employee GetEmployeeByID([FromUri] long employeeId)
        {
            return EmployeeManager.GetEmployeeById(employeeId);
        }

        [HttpPost]
        public long AddEmployee([FromBody] Employee employee)
        {
            return EmployeeManager.AddEmployee(employee);
        }

        [HttpPost]
        public bool EditEmployee([FromBody] Employee employee)
        {
            return EmployeeManager.EditEmployee(employee);
        }
    }
}