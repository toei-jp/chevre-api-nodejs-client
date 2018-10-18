/**
 * 科目サンプル
 */
const auth = require('../auth');
const client = require('../../lib/');
const moment = require('moment');

async function main() {
    const authClient = await auth.login();
    await authClient.refreshAccessToken();
    const loginTicket = authClient.verifyIdToken({});
    console.log('username is', loginTicket.getUsername());

    const subjectService = new client.service.Subject({
        endpoint: process.env.TEST_API_ENDPOINT,
        auth: authClient
    });

    console.log('creating subject...');
    let subject = await subjectService.createSubject({
        subjectClassificationCd: '20181016002',
        subjectClassificationName: {
            'ja': 'subjectClassificationName',
            'en': 'subjectClassificationName',
            'kr': ''
        },
        subjectCd: '20181016102',
        subjectName: {
            'ja': 'subjectName',
            'en': 'subjectName',
            'kr': ''
        },
        detailCd: '20181016202',
        detailName: {
            'ja': 'detailName',
            'en': 'detailName',
            'kr': ''
        },
    });
    // console.log('subject created', subject);

    console.log('finding subject...');
    subject = await subjectService.findSubjectById({ id: subject.id });
    console.log('subject found', subject.subjectClassificationName);
    console.log('subject found', subject.subjectClassificationCd);
    console.log('subject found', subject.subjectCd);
    console.log('subject found', subject.subjectName);
    console.log('subject found', subject.detailCd);
    console.log('subject found', subject.detailName);

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
