const fs = require('fs');
const path = require('path');

module.exports = {
    index: function *() {
        this.body = fs.readFileSync(path.join(process.cwd(), 'app/dist/sms.html'), 'utf8');
    }
};
