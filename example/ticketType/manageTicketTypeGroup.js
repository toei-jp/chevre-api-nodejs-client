/**
 * 券種グループ管理サンプル
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
    let ticketTypeGroup = await ticketTypeService.createTicketTypeGroup({
        id: '999999',
        name: {
            ja: 'サンプル名',
            en: 'Sample Name'
        },
        ticketTypes: ['00001', '00002']
    });
    console.log('created');

    console.log('finding...');
    ticketTypeGroup = await ticketTypeService.findTicketTypeGroupById({ id: ticketTypeGroup.id });
    console.log('found', ticketTypeGroup);

    console.log('updating...');
    ticketTypeGroup.name.ja = 'サンプル名変更';
    await ticketTypeService.updateTicketTypeGroup(ticketTypeGroup);
    console.log('updated');

    console.log('deleting...');
    await ticketTypeService.deleteTicketTypeGroup({ id: ticketTypeGroup.id });
    console.log('deleted');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
