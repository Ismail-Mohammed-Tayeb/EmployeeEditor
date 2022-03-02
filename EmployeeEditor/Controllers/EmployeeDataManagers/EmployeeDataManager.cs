using EmployeeEditor.Controllers.Managers.DataManagers;
using EmployeeEditor.Models;
using StudentEditor.MyHelpers;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;

namespace EmployeeEditor.Controllers.EmployeeDataManagers
{
    public class EmployeeDataManager
    {
        /// <summary>
        /// Helper Function For Mapping Employees From Raw Data Of Database Response
        /// </summary>
        private static Employee EmployeeMapper(IDataReader dataReader)
        {
            long ID = long.Parse(dataReader["ID"].ToString());
            string Name = dataReader["Name"].ToString();
            List<Hobby> Hobbies = JsonHelper.DeserializeObject<List<Hobby>>(dataReader["Hobbies"].ToString());
            List<HobbyDetail> HobbyDetails =
                JsonHelper.DeserializeObject<List<HobbyDetail>>(dataReader["HobbyDetails"].ToString());
            return new Employee(ID, Name, Hobbies, HobbyDetails);
        }

        /// <summary>
        /// Gets All Employees If nameSearchValue was not passed, otherwise searchs accordingly
        /// </summary>
        /// <param name="nameSearchValue"></param>
        /// <returns></returns>
        public static List<Employee> GetFilteredEmployees(string nameSearchValue = "")
        {

            List<Employee> employees =
                BaseDataManager.GetSPItems("SearchEmployeesByName", EmployeeMapper, nameSearchValue ?? "");
            Debug.WriteLine($"GetEmployees Query Returned {employees.Count} Items(s)");
            return employees;
        }

        /// <summary>
        /// Adds New Employee
        /// </summary>
        /// <param name="employee"></param>
        /// <returns>Last Added Employee ID</returns>
        public static long AddEmployee(Employee employee)
        {
            string employeeHobbies = JsonHelper.SerializeObject(employee.Hobbies);
            string employeeHobbiesDetails = JsonHelper.SerializeObject(employee.HobbyDetails);
            long addedEmployeeId = BaseDataManager.ExecuteScalar("AddEmployee",
                                                   employee.Name,
                                                   employeeHobbies,
                                                   employeeHobbiesDetails);
            Debug.WriteLine($"AddEmployee Query Returned An ID Of: {addedEmployeeId}");
            return addedEmployeeId;
        }


        /// <summary>
        /// Edits an existing Employee
        /// </summary>
        /// <param name="employee"></param>
        /// <returns>bool flag indicating if the process was successfully executed</returns>
        public static bool EditEmployee(Employee employee)
        {
            string employeeHobbies = JsonHelper.SerializeObject(employee.Hobbies);
            string employeeHobbiesDetails = JsonHelper.SerializeObject(employee.HobbyDetails);
            int affectedRowCount = BaseDataManager.ExecuteNonQuery("EditEmployee",
                                                   employee.ID,
                                                   employee.Name,
                                                   employeeHobbies,
                                                   employeeHobbiesDetails);

            bool didEditSuccessfully = affectedRowCount == 1;
            Debug.WriteLine($"EditEmployee Query Returned A Result Of: {didEditSuccessfully}");
            return didEditSuccessfully;
        }

        /// <summary>
        /// Gets the Employee that is identified by the passed Id
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns>Employee Object or Null Accordingly</returns>
        public static Employee GetEmployeeById(long employeeId)
        {

            List<Employee> fullResult =
                BaseDataManager.GetSPItems("GetEmployeeByID", EmployeeMapper, employeeId);
            if (fullResult == null)
            {
                Debug.WriteLine("GetEmployeeById Query Returned Null");

                return null;
            }
            if (fullResult.Count == 0)
            {
                Debug.WriteLine("GetEmployeeById Query Returned Null");
                return null;
            }

            Debug.WriteLine("GetEmployeeById Query Returned An Employee With ID: " +
                            $"{fullResult.First().ID} And Name {fullResult.First().Name} ");
            return fullResult.First();
        }
    }
}