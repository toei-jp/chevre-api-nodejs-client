/**
 * 上映イベントシリーズ管理サンプル
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
    let event = await eventService.createScreeningEventSeries({
        typeOf: client.factory.eventType.ScreeningEventSeries,
        name: {
            ja: 'サンプルイベントシリーズ',
            en: 'Sample event series'
        },
        subtitleLanguage: '',
        videoFormat: '',
        workPerformed: {
            typeOf: client.factory.creativeWorkType.Movie,
            identifier: '',
            name: '',
            duration: moment.duration(60, 'm').toISOString(),
            contentRating: ''
        },
        location: {
            typeOf: client.factory.placeType.MovieTheater,
            id: '',
            branchCode: '',
            name: {
                ja: '',
                en: ''
            },
            kanaName: ''
        },
        kanaName: 'サンプルイベントシリーズ',
        alternativeHeadline: '',
        endDate: new Date(),
        startDate: new Date()
    });
    console.log('created', event);

    console.log('finding...');
    event = await eventService.findScreeningEventSeriesById({ id: event.id });
    console.log('found', event);

    console.log('updating...');
    event.kanaName = 'サンプル';
    await eventService.updateScreeningEventSeries({ id: event.id, attributes: event });
    console.log('updated');

    console.log('deleting...');
    await eventService.deleteScreeningEventSeries({ id: event.id });
    console.log('deleted');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
