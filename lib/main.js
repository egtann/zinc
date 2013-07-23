/* Copyright 2011 Ask Bjørn Hansen, see LICENSE */
"use strict";

var https = require('https');

function setup_response_handler(req, callback) {
  if (typeof callback !== "function") {
    console.log("missing callback");
    return;
  }
  req.on('response',
    function(res) {
      var response = '';
      res.setEncoding('utf8');
      res.on('data',
        function(chunk) {
          response += chunk;
      });
      res.on('end',
        function() {
          var err = null;
          try {
            console.log(response);
            response = JSON.parse(response);
            if(200 != res.statusCode) {
              err = new Error(response.error.message);
              err.name = response.error.type;
              err.code = response.error.code;
              err.param = response.error.param;
              response = null;
            }
          }
          catch(e) {
            err = new Error("Invalid JSON from zinc.io");
            response = null;
          }
          callback(err, response);
      });
    });
  req.on('error', function(error){
    callback(error);
  });
}

module.exports = function (api_key, options) {
  var defaults = options || {};

  var auth = 'Basic ' + new Buffer(api_key + ":").toString('base64');

  function _request(method, path, data, callback) {

    //console.log("data", typeof data, data);

    data = JSON.stringify(data);

    //console.log(method, "request for", path);
    //console.log("http request", data);

    var request_options = {
      host: 'api.zinc.io',
      port: '443',
      path: path,
      method: method,
      headers: {
        'Authorization': auth,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    };

    var req = https.request(request_options);
    setup_response_handler(req, callback);
    req.write(data);
    req.end();
  }

  function post(path, data, callback) {
    _request('POST', path, data, callback);
  }

  function get(path, data, callback) {
    _request('GET', path, data, callback);
  }

  function del(path, data, callback) {
    _request('DELETE', path, data, callback);
  }

  function normalizeArguments() {
    var args = arguments[0];
    if(typeof args[0] == 'object' && typeof args[1] == 'function' && !args[2])
      return { count: args[0].count, offset: args[0].offset, cb: args[1] };
    else
      return { count: args[0], offset: args[1], cb: args[2] };
  }

  return {
    orders: {
      create: function (data, cb) {
        post("/v1/orders", data, cb);
      },
      retrieve: function(order_id, cb) {
        if(!(order_id && typeof order_id === 'string')) {
          cb("order_id required");
        }
        get("/v1/orders/" + order_id, {}, cb);
      },
      cancel: function(order_id, cb) {
        var requestParams = {};
        if(!(order_id && typeof order_id === 'string')) {
          cb("order_id required");
        }
        post("/v1/orders/" + order_id + "/cancellation", requestParams, cb);
      }
    }
  };
}
