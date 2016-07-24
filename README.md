# Bali

Bali.js is a simple, light-weight, no-fluff access authorization library written
for the JavaScript, both targeting the server and the client.

It was created when I need to do role-based auth on the client. If you are writing
server-side code in Ruby, you might as well look at [Bali.rb](https://github.com/saveav/bali).
Oh yes you are right, Bali is that beautiful island in Indonesia the Indonesians
call itself "the islands of gods."

## How does it works?

You can install through npm, or download the UMD distribution to be used in
browser (if you do not use like Webpack or something).

To install through NPM:

```
npm i -S bali
```

Then, you have to define your authorizer (assuming ES6):

```javascript
import Bali from 'bali';
authorizer = Bali.mapRules({
  "ALL_LEAVE": (ruler) => { ruler.canAll("leave"); },
  "SEE_LEAVE": (ruler) => { ruler.can("see", "leave"); },
  "APPROVE_LEAVE": (ruler) => { ruler.can("approve", "leave"); }
});
```

To do authorization, invoke `can` like this:

```javascript
authorizer.can("SEE_LEAVE", "see", "leave") # => true
authorizer.can("SEE_LEAVE", "approve", "leave") # => false
authorizer.can("ALL_LEAVE", "see", "leave") # => true
authorizer.can("ALL_LEAVE", "approve", "leave") # => true
```

Usage is best illustrated in the test file `bali.test.js`.

## License

Bali is proudly available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright (c) 2016, Adam Pahlevi.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Version history

### 1.0.0

- Initial release, wohoo!
- Supported `ruler`: `can`, `canAll`.
- Supported inspection: `can`.
- Can express roles both in an array, or as a standalone string literal.
- Heavy test, of course!
