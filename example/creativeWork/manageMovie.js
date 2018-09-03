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
        identifier: '999999',
        name: 'Sample Movie',
        duration: moment.duration(60, 'm').toISOString(),
        contentRating: ''
    });
    console.log('movie created', movie);

    console.log('finding movie...');
    movie = await creativeWorkService.findMovieByIdentifier({ identifier: movie.identifier });
    console.log('movie found', movie.name);

    console.log('updating movie...');
    await creativeWorkService.updateMovie({
        typeOf: client.factory.creativeWorkType.Movie,
        identifier: '999999',
        name: 'Sample Movie Updated',
        duration: moment.duration(60, 'm').toISOString(),
        contentRating: ''
    });
    console.log('movie updated');

    console.log('deleting movie...');
    await creativeWorkService.deleteMovie({ identifier: movie.identifier });
    console.log('movie deleted');
}

main().then(() => {
    console.log('main processed.');
}).catch((err) => {
    console.error(err);
});
