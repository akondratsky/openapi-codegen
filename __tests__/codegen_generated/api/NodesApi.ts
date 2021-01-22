/**
 * Starway APIs
 * No description
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { AxiosRequestConfig } from 'axios';
import { axios } from '../axios.config';

import { NodesApi } from '../';

/* tslint:disable:no-unused-variable member-ordering max-line-length */

export class NodesApiResource {

    /**
     * Get single node
     * Since searching is too diffucult for GET request, we can use it to get single nodes by ID.
     * @param id 
     */
    public getNodeById(query?: { id: string }, axiosConfig?: AxiosRequestConfig): Promise<Node> {
        const reqPath = '/nodes';
        let reqConfig = {
            ...axiosConfig,
            method: 'GET',
            url: reqPath,
            params: query
        };
        return axios.request(reqConfig)
            .then(res => {
                return res.data;
            });
    }

    /**
     * Search nodes
     * We assume there are lot of tags which can&#39;t fit GET query, all of them are placed in request body.
     * @param searchNodesParams We assume there are lot of tags which can&#39;t fit GET query, all of them are placed in request body.
     */
    public searchNodes(searchNodesParams?: Partial<SearchNodesParams>, axiosConfig?: AxiosRequestConfig): Promise<Nodes> {
        const reqPath = '/nodes';
        let reqConfig = {
            ...axiosConfig,
            method: 'POST',
            url: reqPath,
            data: searchNodesParams
        };
        return axios.request(reqConfig)
            .then(res => {
                return res.data;
            });
    }

    /**
     * 
     * Create nodes
     */
    public nodesPut(axiosConfig?: AxiosRequestConfig): Promise<{}> {
        const reqPath = '/nodes';
        let reqConfig = {
            ...axiosConfig,
            method: 'PUT',
            url: reqPath
        };
        return axios.request(reqConfig)
            .then(res => {
                return res.data;
            });
    }

    /**
     * 
     * Update nodes
     */
    public nodesPatch(axiosConfig?: AxiosRequestConfig): Promise<{}> {
        const reqPath = '/nodes';
        let reqConfig = {
            ...axiosConfig,
            method: 'PATCH',
            url: reqPath
        };
        return axios.request(reqConfig)
            .then(res => {
                return res.data;
            });
    }

}

export const NodesApi = new NodesApiResource();