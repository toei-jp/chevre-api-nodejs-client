/**
 * 映画検索サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const creativeWorkService = new client.service.CreativeWork({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    // console.log('searching...');
    // const { totalCount, data } = await creativeWorkService.searchMovies({
    //     limit: 10,
    //     // identifier: "00009",
    //     // datePublishedFrom: "2018/10/01",
    //     // datePublishedTo: "2018/10/03",
    //     sort: {
    //         identifier: client.factory.sortType.Ascending
    //     }
    // });
    // console.log(data.map((e) => e.identifier).join('\n'));
    // console.log(data.map((e) => e.datePublished).join('\n'));
    // console.log(data.map((e) => e.subtitle).join('\n'));
    // console.log(data.map((e) => e.duration).join('\n'));
    // console.log(totalCount, 'found');
    // console.log(data.length, 'returned');

    console.log('searching with check scheduleEndDate...');
    const { totalCount, data } = await creativeWorkService.searchMovies({
        // limit: 10,
        checkScheduleEndDate: true,
        // identifier: "00009",
        // datePublishedFrom: "2018/10/01",
        // datePublishedTo: "2018/10/03",
        sort: {
            identifier: client.factory.sortType.Ascending
        }
    });
    console.log(data.map((e) => e.identifier).join('\n'));

    // console.log('get rating...');
    // const data = await creativeWorkService.getMovieRatingByIdentifier({
    //     identifier: "00009"
    // });
    // console.log(data, 'rating');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
