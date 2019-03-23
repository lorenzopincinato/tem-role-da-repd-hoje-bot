import { createHmac } from 'crypto';

export function handleComentOnIssue(req, res) {
    if (req.body.action !== 'created') {
        res.end();
        return;
    }

    const comment = req.body.comment;
    console.log(`New comment on issue: ${comment.body}`);

    return validateRequest(req);
}

function validateRequest (req) {
    return Promisse.resolve()
        .then(() => {
            const digest = createHmac('sha1', process.env.SCRET_TOKEN)
                .update(JSON.stringify(req.body))
                .digest('hex');

            if (req.headers['x-github-signature'] !== `sha1=${digest}`) {
                const error = new Error('Unauthorized');
                error.statusCode = 403;
                throw error;
            } else {
                console.log('Request validated.');
            }
        })
}
