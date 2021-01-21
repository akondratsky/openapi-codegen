using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace Node {

  /// <summary>
  /// 
  /// </summary>
  [DataContract]
  public class Node {
    /// <summary>
    /// Single node of knowledge
    /// </summary>
    /// <value>Single node of knowledge</value>
    [DataMember(Name="node", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "node")]
    public object Node { get; set; }

    /// <summary>
    /// Gets or Sets id
    /// </summary>
    [DataMember(Name="id", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "id")]
    public string id { get; set; }

    /// <summary>
    /// Gets or Sets nodeType
    /// </summary>
    [DataMember(Name="nodetype", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "nodetype")]
    public  nodeType { get; set; }

    /// <summary>
    /// Gets or Sets question
    /// </summary>
    [DataMember(Name="question", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "question")]
    public string question { get; set; }

    /// <summary>
    /// Gets or Sets answer
    /// </summary>
    [DataMember(Name="answer", EmitDefaultValue=false)]
    [JsonProperty(PropertyName = "answer")]
    public string answer { get; set; }


    /// <summary>
    /// Get the string presentation of the object
    /// </summary>
    /// <returns>String presentation of the object</returns>
    public override string ToString()  {
      var sb = new StringBuilder();
      sb.Append("class Node {\n");
      sb.Append("  Node: ").Append(Node).Append("\n");
      sb.Append("  id: ").Append(id).Append("\n");
      sb.Append("  nodeType: ").Append(nodeType).Append("\n");
      sb.Append("  question: ").Append(question).Append("\n");
      sb.Append("  answer: ").Append(answer).Append("\n");
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
