/**
 * 劇場検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const placeService = new client.service.Place({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('finding movieTheater...');
    const { totalCount, data } = await placeService.searchMovieTheaters({
        name: 'モーション'
    });
    console.log(data);
    console.log(totalCount, 'movieTheater found');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
