/**
 * 配給サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const distributionsService = new client.service.Distributions({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching...');
    const data = await distributionsService.getDistributionsList();
    console.log(data.map((e) => e.id).join('\n'));
    console.log(data.map((e) => e.name).join('\n'));
    console.log(data.length, 'returned');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
