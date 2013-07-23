# node-zinc

Access to the [Zinc](https://zinc.io/) [API](https://zinc.io/docs).


## Installation

`npm install zinc`

## Usage overview


    var api_key = 'abc';  // secret zinc API key
    var zinc = require('zinc')(api_key);

    zinc.orders.create(
       { ORDER_OBJECT },
       function(err, order) {
          if (err) {
             console.log(err.message);
             return;
          }
          console.log("order id", order.id);
       }
     );


## API

All methods takes a callback as their last parameter. The callback is
called with a Javascript `Error` (if any) and then the response.

* `zinc.orders` - create, retrieve, refund and list charges
   * `.create(order)` - [create an order](https://zinc.io/docs#placing-order)
   * `.retrieve(order)` - [retrieve an order](https://zinc.io/docs#order-object) by order id
   * `.cancel(order_id)` - [cancel an order](https://zinc.io/docs#cancelling-order)

## Errors

Errors returned take the following format. [Zinc Errors](https://zinc.io/docs#errors)

    {
      _type: "Zinc error type",
      _http_code: "Zinc HTTP response code",
      code: "Zinc error code",
      message: "Zinc error message"
    }

## Tests

To run the tests, install vows with `npm install vows` and then run

   ZINC_API=your-dev-api-key vows test/*

## Author

Evan Tann (egtann@gmail.com).
Based on the Stripe API wrapper by Ask Bjørn Hansen (ask@develooper.com).

## License

Copyright (C) 2013 Evan Tann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
