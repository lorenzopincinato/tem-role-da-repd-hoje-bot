const crypto = require('crypto');

exports.handleCommentOnIssue = (req, res) => {
    if (req.body.action !== 'created') {
        res.end();
        return;
    }

    const comment = req.body.comment;
    console.log(`New comment on issue: ${comment.body}`);

    return validateRequest(req);
};

function validateRequest (req) {
    return Promise.resolve()
        .then(() => {
            const digest = crypto.createHmac('sha1', process.env.SECRET_TOKEN)
                .update(JSON.stringify(req.body))
                .digest('hex');
                
            if (req.headers['x-hub-signature'] !== `sha1=${digest}`) {
                const error = new Error('Unauthorized');
                error.statusCode = 403;
                throw error;
            } else {
                console.log('Request validated.');
            }
        })
}
