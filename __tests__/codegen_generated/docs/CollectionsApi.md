# IO.OpenAPI.CollectionsApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAllCollections**](CollectionsApi.md#getallcollections) | **GET** /collections | Get single collection

<a name="getallcollections"></a>
# **getAllCollections**
> Collections getAllCollections ()

Get single collection

description is absent

### Example
```csharp
using System;
using System.Diagnostics;
using IO.OpenAPI;
using IO.OpenAPI.Client;
using IO.OpenAPI;

namespace Example
{
    public class getAllCollectionsExample
    {
        public void main()
        {

            var apiInstance = new CollectionsApi();

            try
            {
                // 
                Collections result = apiInstance.getAllCollections();
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling CollectionsApi.getAllCollections: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Collections**](array.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

