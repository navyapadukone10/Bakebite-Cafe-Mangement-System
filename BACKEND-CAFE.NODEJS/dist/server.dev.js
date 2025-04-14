"use strict";

require('dotenv').config();

var http = require('http');

var app = require('./index');

var server = http.createServer(app);
server.listen(process.env.PORT);
//# sourceMappingURL=server.dev.js.map
