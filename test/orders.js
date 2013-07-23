var vows = require('vows'),
  assert = require('assert'),
  sys = require('sys');

var api_key = process.env.ZINC_API;

if (!api_key) {
  sys.puts('To run vows, you must have a zinc_API environment variable with a test api key');
  process.exit(2)
}

var zinc = require('./../lib/main.js')(api_key);

vows.describe("Orders API").addBatch({
  'Create order' : {
    topic: function() {
      zinc.orders.create({
        "mode": "dev",
        "max_total":6000,
        "address": {
        "name":"Tim Beaver",
        "address_line1": "77 Massachusetts Avenue",
        "address_line2": null,
        "zip_code":"02139",
        "city": "Cambridge", 
        "state": "MA",
        "country": "US"
        },
        "address_suggestion_choice":"suggested",
        "products": [
        {
          "pid":"B003L1ZYYM",
          "pid_type" : "ASIN",
          "qty":1
        }, 
        {
          "pid":"0833030477",
          "pid_type" : "ASIN",
          "qty":1
        }
        ],
        "merchant": "amazon",
        "gift_ship": true,
        "gift_message": "Thanks for ordering from example.com!",
        "shipping_method": "standard"
      }, this.callback);
    },
    'returns an order' : function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.equal(response._type, 'order');
      assert.isDefined(response.id);
    },
    'Retrieve an order' : {
      topic: function(create_err, order) {
        zinc.orders.retrieve(order.id, this.callback);
      },
      'Got an order' : function(err, response) {
        assert.isNull(err);
        assert.isDefined(response);
        assert.equal(response._type, 'order');
        assert.isDefined(response.id);
      },
    },
    'Cancel an order' : {
      topic: function(create_err, order) {
        zinc.orders.cancel(order.id, this.callback);
      },
      'Got a refund' : function(err, response) {
        assert.isNull(err);
        assert.isDefined(response);
        assert.equal(response._type, 'cancellation');
      }
    }
  }
}).export(module, {error: false});
