/**
 * 映画作品管理サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');
const moment = require('moment');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const creativeWorkService = new client.service.CreativeWork({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('creating movie...');
    let movie = await creativeWorkService.createMovie({
        typeOf: client.factory.creativeWorkType.Movie,
        identifier: '00009',
        name: 'Sample Movie 9',
        duration: moment.duration(60, 'm').toISOString(),
        contentRating: '',
        subtitle: 'sub8',
        datePublished: new Date(),
        scheduleEndDate: new Date(),
        distribution: 1
    });
    console.log('movie created', movie);

    console.log('finding movie...');
    movie = await creativeWorkService.findMovieByIdentifier({ identifier: movie.identifier });
    console.log('movie found', movie.name);
    console.log('movie found', movie.subtitle);
    console.log('movie found', movie.datePublished);
    console.log('movie found', movie.scheduleEndDate);
    console.log('movie found', movie.distribution);

    // console.log('updating movie...');
    // await creativeWorkService.updateMovie({
    //     typeOf: client.factory.creativeWorkType.Movie,
    //     identifier: '00001',
    //     name: 'Sample Movie Updated',
    //     duration: moment.duration(60, 'm').toISOString(),
    //     contentRating: '',
    //     subtitle: 'sub 00003',
    //     datePublished: "2018/09/28",
    //     scheduleEndDate: new Date(),
    //     distribution: 1
    // });
    // console.log('movie updated');

    // console.log('deleting movie...');
    // await creativeWorkService.deleteMovie({ identifier: movie.identifier });
    // console.log('movie deleted');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
