namespace EmployeeEditor.Models
{
    public class HobbyDetail
    {
        public enum FrequencyTypeEnum
        {
            Yearly,
            Monthly,
            Weekly,
            Daily
        }
        public string ID { get; set; }
        public int Frequency { get; set; }
        public FrequencyTypeEnum FrequencyType { get; set; }

        public HobbyDetail() { }
        public HobbyDetail(string ID, int Frequency, FrequencyTypeEnum FrequencyType)
        {
            this.ID = ID;
            this.Frequency = Frequency;
            this.FrequencyType = FrequencyType;
        }
        public HobbyDetail(string ID, int Frequency, int FrequencyType)
        {
            this.ID = ID;
            this.Frequency = Frequency;
            this.FrequencyType = (FrequencyTypeEnum)FrequencyType;
        }
    }
}