using EmployeeEditor.Controllers.Managers.DataManagers;
using EmployeeEditor.Models;
using StudentEditor.MyHelpers;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;

namespace EmployeeEditor.Controllers.EmployeeDataManagers
{
    public class EmployeeManager
    {

        /// <summary>
        /// Gets All Employees If nameSearchValue was not passed, otherwise searchs accordingly
        /// </summary>
        /// <param name="nameSearchValue"></param>
        /// <returns></returns>
        public static List<Employee> GetFilteredEmployees(string nameSearchValue = "")
        {
            List<Employee> employees = EmployeeDataManager.GetFilteredEmployees(nameSearchValue);
            employees.Sort((first, second) => first.Name.CompareTo(second.Name));
            return employees;
        }

        /// <summary>
        /// Adds New Employee
        /// </summary>
        /// <param name="employee"></param>
        /// <returns>Last Added Employee ID</returns>
        public static long AddEmployee(Employee employee)
        {
            return EmployeeDataManager.AddEmployee(employee);
        }


        /// <summary>
        /// Edits an existing Employee
        /// </summary>
        /// <param name="employee"></param>
        /// <returns>bool flag indicating if the process was successfully executed</returns>
        public static bool EditEmployee(Employee employee)
        {
            return EmployeeDataManager.EditEmployee(employee);
        }

        /// <summary>
        /// Gets the Employee that is identified by the passed Id
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns>Employee Object or Null Accordingly</returns>
        public static Employee GetEmployeeById(long employeeId)
        {
            return EmployeeDataManager.GetEmployeeById(employeeId);
        }
    }
}