/**
 * 認証
 */
const open = require('open');
const readline = require('readline');
const client = require('../lib/');

exports.login = async function () {
    const auth = new client.auth.OAuth2({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        redirectUri: 'https://localhost/signIn',
        logoutUri: 'https://localhost/logout'
    });

    const scopes = [];
    const state = '12345';
    const codeVerifier = '12345';

    const authUrl = auth.generateAuthUrl({
        scopes: scopes,
        state: state,
        codeVerifier: codeVerifier
    });
    console.log('authUrl:', authUrl);

    if (process.env.TEST_REFRESH_TOKEN !== undefined) {
        auth.setCredentials({
            refresh_token: process.env.TEST_REFRESH_TOKEN
        });
    } else {
        open(authUrl);

        await new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('enter authorization code:\n', async (code) => {
                rl.question('enter state:\n', async (givenState) => {
                    if (givenState !== state) {
                        reject(new Error('state not matched'));

                        return;
                    }

                    let credentials = await auth.getToken(code, codeVerifier);
                    console.log('credentials published', credentials);

                    auth.setCredentials(credentials);

                    credentials = await auth.refreshAccessToken();
                    console.log('credentials refreshed', credentials);

                    rl.close();
                    resolve();
                });
            });
        });
    }

    const logoutUrl = auth.generateLogoutUrl();
    console.log('logoutUrl:', logoutUrl);

    return auth;
}
