/**
 * 上映イベント予約検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const reservationService = new client.service.Reservation({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('searching reservations...');
    const reservation = await reservationService.findScreeningEventReservationById({
        id: '118-180814-000007-0',
    });
    console.log('reservations found', reservation);
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
