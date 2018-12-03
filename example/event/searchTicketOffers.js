/**
 * イベントのチケットオファー検索サンプル
 */
const moment = require('moment');
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = new client.auth.ClientCredentials({
        domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
        clientId: process.env.TEST_CLIENT_ID,
        clientSecret: process.env.TEST_CLIENT_SECRET,
        scopes: [],
        state: ''
    });

    const eventService = new client.service.Event({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching offers...');
    const offers = await eventService.searchScreeningEventTicketOffers({
        eventId: 'eewk43ejoz78lu0'
    });
    console.log(offers);
    console.log(offers.map((o) => o.priceSpecification.priceComponent));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
