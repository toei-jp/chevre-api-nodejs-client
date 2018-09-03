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
    const movieTheater = await placeService.findMovieTheaterByBranchCode({
        branchCode: '118'
    });
    console.log('movieTheater found', movieTheater);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
