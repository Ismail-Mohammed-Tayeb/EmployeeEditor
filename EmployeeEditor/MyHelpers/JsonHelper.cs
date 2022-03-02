using Newtonsoft.Json;

namespace StudentEditor.MyHelpers
{
    public abstract class JsonHelper
    {
        private static JsonSerializerSettings settings = new JsonSerializerSettings()
        {
            TypeNameHandling = TypeNameHandling.Objects
        };
        public static T DeserializeObject<T>(string data)
        {
            return JsonConvert.DeserializeObject<T>(data, settings);
        }

        public static string SerializeObject(object dataObject)
        {
            return JsonConvert.SerializeObject(dataObject, settings);
        }
    }
}