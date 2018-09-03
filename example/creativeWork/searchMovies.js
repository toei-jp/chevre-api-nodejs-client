/**
 * 映画検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const creativeWorkService = new client.service.CreativeWork({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching...');
    const { totalCount, data } = await creativeWorkService.searchMovies({
        limit: 10,
        sort: {
            identifier: client.factory.sortType.Ascending
        }
    });
    console.log(data.map((e) => e.identifier).join('\n'));
    console.log(totalCount, 'found');
    console.log(data.length, 'returned');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
