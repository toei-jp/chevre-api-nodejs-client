/**
 * 予約取引サンプル
 */
const moment = require('moment');
const client = require('../../lib/');

const auth = new client.auth.ClientCredentials({
    domain: process.env.TEST_AUTHORIZE_SERVER_DOMAIN,
    clientId: process.env.TEST_CLIENT_ID,
    clientSecret: process.env.TEST_CLIENT_SECRET,
    scopes: []
});
const eventService = new client.service.Event({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});
const reserveService = new client.service.transaction.Reserve({
    endpoint: process.env.TEST_API_ENDPOINT,
    auth: auth
});

async function main() {
    console.log('searching events...');
    const events = await eventService.searchScreeningEvents({
        startFrom: new Date(),
        endThrough: moment().add(1, 'month').toDate()
    });
    console.log(events.length, 'events found');

    console.log('searching ticket types...');
    const ticketTypes = await eventService.searchScreeningEventTicketTypes({ eventId: events[0].id });
    console.log('ticketTypes:', ticketTypes);

    console.log('searching offers...');
    const offers = await eventService.searchScreeningEventOffers({ eventId: events[0].id });
    console.log('offers:', offers);
    const seatOffers = offers[0].containsPlace;
    console.log(seatOffers.length, 'seatOffers found');
    const availableSeatOffers = seatOffers.filter((o) => o.offers[0].availability === client.factory.itemAvailability.InStock);
    console.log(availableSeatOffers.length, 'availableSeatOffers found');

    console.log('starting transaction...');
    const transaction = await reserveService.start({
        typeOf: client.factory.transactionType.Reserve,
        agent: {
            typeOf: 'Person',
            name: 'agent name'
        },
        object: {
            event: {
                id: events[0].id
            },
            tickets: [
                {
                    ticketType: {
                        id: ticketTypes[0].id
                    },
                    ticketedSeat: {
                        seatNumber: availableSeatOffers[0].branchCode,
                        seatSection: offers[0].branchCode
                    }
                }
            ],
            notes: 'test from samples'

        },
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);

    await wait(1000);

    // 確定
    const result = await reserveService.confirm({
        transactionId: transaction.id
    });
    console.log('transaction confirmed', result);
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
