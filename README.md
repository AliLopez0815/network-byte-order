# Network Byte Order

Reads and writes signed and unsigned integers in big-endian byte order into and out of `Uint8Array` buffers.

```javascript
import { writeUInt16BE, readUInt16BE } from 'network-byte-order';

const buffer = new Uint8Array(2);
writeUInt16BE(buffer, 0, 0x1234);
console.log(readUInt16BE(buffer, 0)); // 4660
```

## Why this library exists

JavaScript's typed arrays use the platform's native endianness. Network protocols almost always require big-endian byte order. This library provides a tiny, dependency-free set of functions for converting integers to and from that format.

The main trade-off is that 64-bit integers are handled with `BigInt`, which is slightly more verbose than the `Number`-based functions for smaller sizes but avoids precision loss beyond 2^53.

## Edge cases

- Reading or writing past the end of the buffer throws a `RangeError`.
- Negative 64-bit integers are written in two's complement form.
- All functions assume the offset is a non-negative integer; otherwise a `RangeError` is thrown.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

