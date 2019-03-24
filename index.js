const crypto = require('crypto');

exports.handleCommentOnIssue = (req, res) => {
    if (req.body.action !== 'created') {
        res.end();
        return;
    }

    if (!req.body.comment.body.includes(`@${process.env.ACCOUNT_ID}`)) {
        res.end();
        return;
    }

    const comment = req.body.comment;

    console.log(`New comment on issue: ${comment.body}`);

    return validateRequest(req)
        .then(() => parseEvent(comment.body));
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

function parseEvent (commentBody) {
    return Promise.resolve()
        .then(() => {
            commentBody = commentBody.replace(`@${process.env.ACCOUNT_ID}\r\n`, "");
            let values = commentBody.split("; ");

            let event = {
                name: values[0],
                startsAt: values[1],
                date: values[2],
                link: values[3]
            };

            console.log(`Event parsed: { name: ${event.name}, startsAt: ${event.startsAt}, date: ${event.date}, link: ${event.link} }`);
        })
}
