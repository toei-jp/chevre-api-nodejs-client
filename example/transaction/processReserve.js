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
        inSessionFrom: new Date(),
        inSessionThrough: moment().add(1, 'month').toDate()
    });
    console.log(events.totalCount, 'events found');
    const selectedEvent = events.data[0];

    console.log('searching ticket types...');
    const ticketTypes = await eventService.searchScreeningEventTicketTypes({ eventId: selectedEvent.id });
    console.log('ticketTypes:', ticketTypes);

    console.log('searching offers...');
    const offers = await eventService.searchScreeningEventOffers({ eventId: selectedEvent.id });
    console.log('offers:', offers);
    const seatOffers = offers[0].containsPlace;
    console.log(seatOffers.length, 'seatOffers found');
    const availableSeatOffers = seatOffers.filter((o) => o.offers[0].availability === client.factory.itemAvailability.InStock);
    console.log(availableSeatOffers.length, 'availableSeatOffers found');

    const selectedSectionOffer = offers[0];
    const selectedSeatOffer = availableSeatOffers[0];
    const selectedTicketType = ticketTypes[0];
    console.log('reserving...', selectedEvent.id, selectedSectionOffer.branchCode, selectedSeatOffer.branchCode, selectedTicketType.id);

    console.log('starting transaction...');
    let transaction = await reserveService.start({
        typeOf: client.factory.transactionType.Reserve,
        agent: {
            typeOf: 'Person',
            name: 'agent name'
        },
        object: {
            event: {
                id: selectedEvent.id
            },
            tickets: [
                {
                    ticketType: {
                        id: selectedTicketType.id
                    },
                    ticketedSeat: {
                        seatNumber: selectedSeatOffer.branchCode,
                        seatSection: selectedSectionOffer.branchCode
                    }
                }
            ],
            notes: 'test from samples'

        },
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);

    await wait(1000);

    // 中止
    await reserveService.cancel({
        transactionId: transaction.id
    });
    console.log('transaction canceled');

    transaction = await reserveService.start({
        typeOf: client.factory.transactionType.Reserve,
        agent: {
            typeOf: 'Person',
            name: 'agent name'
        },
        object: {
            event: {
                id: selectedEvent.id
            },
            tickets: [
                {
                    ticketType: {
                        id: selectedTicketType.id
                    },
                    ticketedSeat: {
                        seatNumber: selectedSeatOffer.branchCode,
                        seatSection: selectedSectionOffer.branchCode
                    }
                }
            ],
            notes: 'test from samples'

        },
        expires: moment().add(5, 'minutes').toDate()
    });
    console.log('transaction started', transaction.id);

    // 確定
    await reserveService.confirm({
        transactionId: transaction.id
    });
    console.log('transaction confirmed');
}

async function wait(waitInMilliseconds) {
    return new Promise((resolve) => setTimeout(resolve, waitInMilliseconds));
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
