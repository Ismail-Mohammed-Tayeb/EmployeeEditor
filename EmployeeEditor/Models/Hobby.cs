namespace EmployeeEditor.Models
{
    public class Hobby
    {
        public string ID { get; set; }
        public string Name { get; set; }

        public Hobby() { }
        public Hobby(string ID, string Name)
        {
            this.ID = ID;
            this.Name = Name;
        }
    }
}