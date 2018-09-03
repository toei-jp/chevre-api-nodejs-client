/**
 * API Node.js Client
 */
import * as abstractClient from '@toei-jp/chevre-api-abstract-client';

import ClientCredentialsClient from './auth/clientCredentialsClient';
import OAuth2client from './auth/oAuth2client';

/**
 * factory
 * All object interfaces are here.
 * 全てのオブジェクトのインターフェースはここに含まれます。
 */
export import factory = abstractClient.factory;
export import service = abstractClient.service;
export import transporters = abstractClient.transporters;

/**
 * each OAuth2 clients
 */
export namespace auth {
    /**
     * OAuth2 client using grant type 'client_credentials'
     */
    export class ClientCredentials extends ClientCredentialsClient { }
    /**
     * OAuth2 client using grant type 'authorization_code'
     */
    export class OAuth2 extends OAuth2client { }
}
