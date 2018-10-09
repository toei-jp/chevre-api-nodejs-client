/**
 * 上映イベント検索サンプル
 */
const moment = require('moment');
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const eventService = new client.service.Event({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching events...');
    const { totalCount, data } = await eventService.searchScreeningEventSeries({
        limit: 10,
        sort: {
            startDate: client.factory.sortType.Descending
        }
    });
    console.log(data.map((e) => e.kanaName).join('\n'));
    // console.log(totalCount, 'events found');
    // console.log(data.length, 'events returned');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
