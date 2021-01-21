# IO.OpenAPI.NodesApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getNodeById**](NodesApi.md#getnodebyid) | **GET** /nodes | Get single node
[**searchNodes**](NodesApi.md#searchnodes) | **POST** /nodes | Search nodes
[**nodesPut**](NodesApi.md#nodesput) | **PUT** /nodes | 
[**nodesPatch**](NodesApi.md#nodespatch) | **PATCH** /nodes | 

<a name="getnodebyid"></a>
# **getNodeById**
> Node getNodeById (string id)

Get single node

Since searching is too diffucult for GET request, we can use it to get single nodes by ID.

### Example
```csharp
using System;
using System.Diagnostics;
using IO.OpenAPI;
using IO.OpenAPI.Client;
using IO.OpenAPI;

namespace Example
{
    public class getNodeByIdExample
    {
        public void main()
        {

            var apiInstance = new NodesApi();
            var id = new string(); // string | 

            try
            {
                // 
                Node result = apiInstance.getNodeById(id);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.getNodeById: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**](.md)|  | 

### Return type

[**Node**](object.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="searchnodes"></a>
# **searchNodes**
> Nodes searchNodes (SearchNodesParams searchNodesParams)

Search nodes

We assume there are lot of tags which can't fit GET query, all of them are placed in request body.

### Example
```csharp
using System;
using System.Diagnostics;
using IO.OpenAPI;
using IO.OpenAPI.Client;
using IO.OpenAPI;

namespace Example
{
    public class searchNodesExample
    {
        public void main()
        {

            var apiInstance = new NodesApi();
            var searchNodesParams = new SearchNodesParams(); // SearchNodesParams | We assume there are lot of tags which can't fit GET query, all of them are placed in request body. (optional) 

            try
            {
                // 
                Nodes result = apiInstance.searchNodes(searchNodesParams);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.searchNodes: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **searchNodesParams** | [**SearchNodesParams**](object.md)| We assume there are lot of tags which can&#39;t fit GET query, all of them are placed in request body. | [optional] 

### Return type

[**Nodes**](array.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="nodesput"></a>
# **nodesPut**
> void nodesPut ()



Create nodes

### Example
```csharp
using System;
using System.Diagnostics;
using IO.OpenAPI;
using IO.OpenAPI.Client;
using IO.OpenAPI;

namespace Example
{
    public class nodesPutExample
    {
        public void main()
        {

            var apiInstance = new NodesApi();

            try
            {
                apiInstance.nodesPut();
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.nodesPut: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="nodespatch"></a>
# **nodesPatch**
> void nodesPatch ()



Update nodes

### Example
```csharp
using System;
using System.Diagnostics;
using IO.OpenAPI;
using IO.OpenAPI.Client;
using IO.OpenAPI;

namespace Example
{
    public class nodesPatchExample
    {
        public void main()
        {

            var apiInstance = new NodesApi();

            try
            {
                apiInstance.nodesPatch();
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling NodesApi.nodesPatch: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

