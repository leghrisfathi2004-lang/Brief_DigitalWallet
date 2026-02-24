const parsebody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
};

module.exports = { parsebody };

export GIT_AUTHOR_DATE="2026-02-24 17:19:47" export GIT_COMMITTER_DATE="2026-02-24 17:19:47"