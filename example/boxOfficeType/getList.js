/**
 * 興行区分サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const boxOfficeTypeService = new client.service.BoxOfficeType({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching...');
    const data = await boxOfficeTypeService.getBoxOfficeTypeList();
    console.log(data.map((e) => e.id).join('\n'));
    console.log(data.map((e) => e.name.ja).join('\n'));
    console.log(data.length, 'returned');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
