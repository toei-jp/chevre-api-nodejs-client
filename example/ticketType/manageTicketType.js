/**
 * 券種管理サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');
const moment = require('moment');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const ticketTypeService = new client.service.TicketType({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('creating...');
    let ticketType = await ticketTypeService.createTicketType({
        id: '999999',
        name: {
            ja: 'サンプル名',
            en: 'Sample Name'
        },
        description: {
            ja: 'サンプル',
            en: 'Sample'
        },
        notes: {
            ja: 'サンプル',
            en: 'Sample'
        },
        charge: 9999
    });
    console.log('created');

    console.log('finding...');
    ticketType = await ticketTypeService.findTicketTypeById({ id: ticketType.id });
    console.log('found', ticketType);

    console.log('updating...');
    ticketType.name.ja = 'サンプル名変更';
    await ticketTypeService.updateTicketType(ticketType);
    console.log('updated');

    console.log('deleting...');
    await ticketTypeService.deleteTicketType({ id: ticketType.id });
    console.log('deleted');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
