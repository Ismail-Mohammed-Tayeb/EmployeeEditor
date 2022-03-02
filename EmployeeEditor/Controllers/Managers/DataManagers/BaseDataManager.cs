using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace EmployeeEditor.Controllers.Managers.DataManagers
{
    public abstract class BaseDataManager
    {
        private const string connectionString = @"data source=.;
                                                initial catalog=EmployeesDB;
                                                integrated security=True;
                                                MultipleActiveResultSets=True;
                                                App=EntityFramework";
        public static long ExecuteScalar(string spName, params object[] parameters)
        {
            try
            {
                long lastAddedID = 0;
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    sqlConnection.Open();
                    SqlCommand command = new SqlCommand(spName, sqlConnection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    SqlCommandBuilder.DeriveParameters(command);
                    if (parameters.Length > 0)
                    {
                        for (int i = 0; i < parameters.Length; i++)
                        {
                            command.Parameters[i + 1].Value = parameters[i];
                        }
                    }
                    lastAddedID = long.Parse(command.ExecuteScalar().ToString());
                    sqlConnection.Close();
                    return lastAddedID;
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine($"Error Occured While Executing {spName}: {e.Message}");
                return 0;
            }
        }
        public static int ExecuteNonQuery(string spName, params object[] parameters)
        {
            try
            {
                int affectedRowsCount = 0;
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    sqlConnection.Open();
                    SqlCommand command = new SqlCommand(spName, sqlConnection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    SqlCommandBuilder.DeriveParameters(command);
                    if (parameters.Length > 0)
                    {
                        for (int i = 0; i < parameters.Length; i++)
                        {
                            command.Parameters[i + 1].Value = parameters[i];
                        }
                    }
                    affectedRowsCount = command.ExecuteNonQuery();
                    sqlConnection.Close();
                    return affectedRowsCount;
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine($"Error Occured While Executing {spName}: {e.Message}");
                return 0;
            }
        }
        public static List<T> GetSPItems<T>(string spName,
                                      Func<IDataReader, T> mapper,
                                      params object[] parameters)
        {
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {

                    sqlConnection.Open();
                    SqlCommand command = new SqlCommand(spName, sqlConnection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    SqlCommandBuilder.DeriveParameters(command);
                    for (int i = 0; i < parameters.Length; i++)
                    {
                        command.Parameters[i + 1].Value = parameters[i];
                    }
                    IDataReader reader = command.ExecuteReader();
                    List<T> items = new List<T>();
                    while (reader.Read())
                    {
                        items.Add(mapper(reader));
                    }
                    reader.Close();
                    sqlConnection.Close();
                    return items;
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine($"Error Occured While Executing {spName}: {e.Message}");
                return null;
            }

        }
    }
}