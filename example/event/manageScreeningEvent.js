/**
 * 上映イベント管理サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');
const moment = require('moment');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    // const loginTicket = authClient.verifyIdToken({});
    // console.log('username is', loginTicket.getUsername());

    const eventService = new client.service.Event({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('creating...');
    let event = await eventService.createScreeningEvent({
        typeOf: client.factory.eventType.ScreeningEvent,
        name: {
            ja: 'サンプルイベン',
            en: 'Sample event'
        },
        workPerformed: {
            typeOf: client.factory.creativeWorkType.Movie,
            identifier: '',
            name: '',
            duration: moment.duration(60, 'm').toISOString(),
            contentRating: ''
        },
        location: {
            typeOf: client.factory.placeType.ScreeningRoom,
            branchCode: '',
            name: {
                ja: 'サンプルイベン',
                en: 'Sample event'
            }
        },
        doorTime: new Date(),
        endDate: new Date(),
        startDate: new Date(),
        superEvent: {
            typeOf: client.factory.eventType.ScreeningEventSeries,
            name: {
                ja: 'サンプルイベン',
                en: 'Sample event'
            },
            eventStatus: client.factory.eventStatusType.EventScheduled
        },
        ticketTypeGroup: ''
    });
    console.log('created', event);

    console.log('finding...');
    event = await eventService.findScreeningEventById({ id: event.id });
    console.log('found', event);

    console.log('updating...');
    event.name.ja = 'さんぷる';
    await eventService.updateScreeningEvent({ id: event.id, attributes: event });
    console.log('updated');

    console.log('deleting...');
    await eventService.deleteScreeningEvent({ id: event.id });
    console.log('deleted');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
