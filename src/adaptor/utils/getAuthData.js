import { convertArray } from './index.js';

export const getAuthData = (secSchemes, api) => {
  const result = {};
  result.hasAuthMethods = (secSchemes && secSchemes.length > 0);
  result.authMethods = [];
  if (result.hasAuthMethods) {
    for (const ss of secSchemes) {
      for (const s in ss) {
        const scheme = api.components.securitySchemes[s];
        const entry = {};
        entry.name = s;
        entry.isApiKey = false;
        entry.isBasic = false;
        entry.isOAuth = false;
        if (scheme.type === 'http') {
          entry.isBasic = true;
        }
        else if (scheme.type === 'oauth2') {
          entry.isOAuth = true;
          if (scheme.flows) {
            entry.flow = Object.keys(scheme.flows)[0];
            const flow = Object.values(scheme.flows)[0];
            entry.authorizationUrl = flow.authorizationUrl;
            entry.tokenUrl = flow.tokenUrl;
            entry.scopes = [];
            if (flow.scopes) {
              for (const scope in flow.scopes) {
                const sc = {};
                sc.scope = scope;
                entry.scopes.push(sc);
              }
            }
            // override scopes with local subset
            if (Array.isArray(ss[s])) {
              const newScopes = [];
              for (const scope of entry.scopes) {
                if (ss[s].indexOf(scope.scope) >= 0) {
                  newScopes.push(scope);
                }
              }
              entry.scopes = newScopes;
            }
            entry.scopes = convertArray(entry.scopes);
          }
        }
        else if (scheme.type == 'apiKey') {
          entry.isApiKey = true;
          entry.keyParamName = scheme.name;
          entry.isKeyInQuery = (scheme.in === 'query');
          entry.isKeyInHeader = (scheme.in === 'header');
          entry.isKeyInCookie = (scheme.in === 'cookie'); // extension
        }
        else {
          entry.openapi = {};
          entry.openapi.scheme = scheme;
        }
        result.authMethods.push(entry);
      }
    }
    result.authMethods = convertArray(result.authMethods);
  }
  return result;
}