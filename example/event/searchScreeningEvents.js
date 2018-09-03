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
    const { totalCount, data } = await eventService.searchScreeningEvents({
        inSessionFrom: new Date(),
        inSessionThrough: moment().add(1, 'month').toDate(),
        // superEvent: { ids: ['7i9927kjky5ts19'] },
        limit: 10,
        sort: {
            startDate: client.factory.sortType.Descending
        }
    });
    console.log(data.map((e) => e.startDate).join('\n'));
    console.log(totalCount, 'events found');
    console.log(data.length, 'events returned');

    console.log('searching offers...');
    const offers = await eventService.searchScreeningEventOffers({ eventId: data[0].id });
    console.log(offers.length, 'offers found');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
