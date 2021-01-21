using System;
using System.Collections.Generic;
using RestSharp;
using IO.OpenAPI.Client;
using IO.OpenAPI;

namespace IO.OpenAPI
{
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public interface INodesApi
    {
        /// <summary>
        /// Get single node Since searching is too diffucult for GET request, we can use it to get single nodes by ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Node</returns>
        Node getNodeById (string id);
        /// <summary>
        /// Search nodes We assume there are lot of tags which can&#39;t fit GET query, all of them are placed in request body.
        /// </summary>
        /// <param name="searchNodesParams">We assume there are lot of tags which can&#39;t fit GET query, all of them are placed in request body.</param>
        /// <returns>Nodes</returns>
        Nodes searchNodes (SearchNodesParams searchNodesParams);
        /// <summary>
        ///  Create nodes
        /// </summary>
        /// <returns></returns>
        void nodesPut ();
        /// <summary>
        ///  Update nodes
        /// </summary>
        /// <returns></returns>
        void nodesPatch ();
    }
  
    /// <summary>
    /// Represents a collection of functions to interact with the API endpoints
    /// </summary>
    public class NodesApi : INodesApi
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NodesApi"/> class.
        /// </summary>
        /// <param name="apiClient"> an instance of ApiClient (optional)</param>
        /// <returns></returns>
        public NodesApi(ApiClient apiClient = null)
        {
            if (apiClient == null) // use the default one in Configuration
                this.ApiClient = Configuration.DefaultApiClient; 
            else
                this.ApiClient = apiClient;
        }
    
        /// <summary>
        /// Initializes a new instance of the <see cref="NodesApi"/> class.
        /// </summary>
        /// <returns></returns>
        public NodesApi(String basePath)
        {
            this.ApiClient = new ApiClient(basePath);
        }
    
        /// <summary>
        /// Sets the base path of the API client.
        /// </summary>
        /// <param name="basePath">The base path</param>
        /// <value>The base path</value>
        public void SetBasePath(String basePath)
        {
            this.ApiClient.BasePath = basePath;
        }
    
        /// <summary>
        /// Gets the base path of the API client.
        /// </summary>
        /// <param name="basePath">The base path</param>
        /// <value>The base path</value>
        public String GetBasePath(String basePath)
        {
            return this.ApiClient.BasePath;
        }
    
        /// <summary>
        /// Gets or sets the API client.
        /// </summary>
        /// <value>An instance of the ApiClient</value>
        public ApiClient ApiClient {get; set;}
    
        /// <summary>
        /// Get single node Since searching is too diffucult for GET request, we can use it to get single nodes by ID.
        /// </summary>
        /// <param name="id"></param> 
        /// <returns>Node</returns>            
        public Node getNodeById (string id)
        {
            // verify the required parameter 'id' is set
            if (id == null) throw new ApiException(400, "Missing required parameter 'id' when calling getNodeById");
    
            var path = "/nodes";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<String, String>();
            var headerParams = new Dictionary<String, String>();
            var formParams = new Dictionary<String, String>();
            var fileParams = new Dictionary<String, FileParameter>();
            String postBody = null;
    
             if (id != null) queryParams.Add("id", ApiClient.ParameterToString(id)); // query parameter
                                        
            // authentication setting, if any
            String[] authSettings = new String[] {  };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.GET, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if (((int)response.StatusCode) >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling getNodeById: " + response.Content, response.Content);
            else if (((int)response.StatusCode) == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling getNodeById: " + response.ErrorMessage, response.ErrorMessage);
    
            return (Node) ApiClient.Deserialize(response.Content, typeof(Node), response.Headers);
        }
    
        /// <summary>
        /// Search nodes We assume there are lot of tags which can&#39;t fit GET query, all of them are placed in request body.
        /// </summary>
        /// <param name="searchNodesParams">We assume there are lot of tags which can&#39;t fit GET query, all of them are placed in request body.</param> 
        /// <returns>Nodes</returns>            
        public Nodes searchNodes (SearchNodesParams searchNodesParams)
        {
    
            var path = "/nodes";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<String, String>();
            var headerParams = new Dictionary<String, String>();
            var formParams = new Dictionary<String, String>();
            var fileParams = new Dictionary<String, FileParameter>();
            String postBody = null;
    
                                                postBody = ApiClient.Serialize(searchNodesParams); // http body (model) parameter
    
            // authentication setting, if any
            String[] authSettings = new String[] {  };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.POST, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if (((int)response.StatusCode) >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling searchNodes: " + response.Content, response.Content);
            else if (((int)response.StatusCode) == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling searchNodes: " + response.ErrorMessage, response.ErrorMessage);
    
            return (Nodes) ApiClient.Deserialize(response.Content, typeof(Nodes), response.Headers);
        }
    
        /// <summary>
        ///  Create nodes
        /// </summary>
        /// <returns></returns>            
        public void nodesPut ()
        {
    
            var path = "/nodes";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<String, String>();
            var headerParams = new Dictionary<String, String>();
            var formParams = new Dictionary<String, String>();
            var fileParams = new Dictionary<String, FileParameter>();
            String postBody = null;
    
                                                    
            // authentication setting, if any
            String[] authSettings = new String[] {  };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PUT, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if (((int)response.StatusCode) >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling nodesPut: " + response.Content, response.Content);
            else if (((int)response.StatusCode) == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling nodesPut: " + response.ErrorMessage, response.ErrorMessage);
    
            return;
        }
    
        /// <summary>
        ///  Update nodes
        /// </summary>
        /// <returns></returns>            
        public void nodesPatch ()
        {
    
            var path = "/nodes";
            path = path.Replace("{format}", "json");
                
            var queryParams = new Dictionary<String, String>();
            var headerParams = new Dictionary<String, String>();
            var formParams = new Dictionary<String, String>();
            var fileParams = new Dictionary<String, FileParameter>();
            String postBody = null;
    
                                                    
            // authentication setting, if any
            String[] authSettings = new String[] {  };
    
            // make the HTTP request
            IRestResponse response = (IRestResponse) ApiClient.CallApi(path, Method.PATCH, queryParams, postBody, headerParams, formParams, fileParams, authSettings);
    
            if (((int)response.StatusCode) >= 400)
                throw new ApiException ((int)response.StatusCode, "Error calling nodesPatch: " + response.Content, response.Content);
            else if (((int)response.StatusCode) == 0)
                throw new ApiException ((int)response.StatusCode, "Error calling nodesPatch: " + response.ErrorMessage, response.ErrorMessage);
    
            return;
        }
    
    }
}
