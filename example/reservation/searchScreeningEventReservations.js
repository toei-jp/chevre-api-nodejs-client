/**
 * 予約検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');
// const moment = require('moment');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const reservationService = new client.service.Reservation({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching...');
    const { totalCount, data } = await reservationService.searchScreeningEventReservations({
        // ids: ['118-180814-000007-0'],
        // modifiedFrom: moment().add(-20, 'days').toDate(),
        // modifiedThrough: moment().add(-10, 'days').toDate(),
        reservationFor: {
            typeOf: client.factory.eventType.ScreeningEvent,
            id: '7i9978cjkmh42h7'
        }
    });
    console.log(data[0]);
    console.log(totalCount, 'reservations found');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
