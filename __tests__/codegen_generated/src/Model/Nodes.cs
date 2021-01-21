using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace Nodes {

  /// <summary>
  /// 
  /// </summary>
  [DataContract]
  public class Nodes {
    /// <summary>
    /// Single node of knowledge
    /// </summary>
    /// <value>Single node of knowledge</value>
    [DataMember(Name="node", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "node")]
    public object Node { get; set; }


    /// <summary>
    /// Get the string presentation of the object
    /// </summary>
    /// <returns>String presentation of the object</returns>
    public override string ToString()  {
      var sb = new StringBuilder();
      sb.Append("class Nodes {\n");
      sb.Append("  Node: ").Append(Node).Append("\n");
      sb.Append("}\n");
      return sb.ToString();
    }

    /// <summary>
    /// Get the JSON string presentation of the object
    /// </summary>
    /// <returns>JSON string presentation of the object</returns>
    public string ToJson() {
      return JsonConvert.SerializeObject(this, Formatting.Indented);
    }

}
}
