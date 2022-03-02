using System.Collections.Generic;

namespace EmployeeEditor.Models
{
    public class Employee
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public List<Hobby> Hobbies { get; set; }
        public List<HobbyDetail> HobbyDetails { get; set; }

        //Leaving a Default Paramter For Late Object Initialization
        public Employee() { }

        //Base Object Parameters Constructor
        public Employee(long ID, string Name, List<Hobby> Hobbies, List<HobbyDetail> HobbyDetails)
        {
            this.ID = ID;
            this.Name = Name;
            this.Hobbies = Hobbies;
            this.HobbyDetails = HobbyDetails;
        }
    }
}