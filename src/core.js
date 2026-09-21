const _INT8_SIZE = 1;
const _UINT8_SIZE = 1;
const _INT16_SIZE = 2;
const _UINT16_SIZE = 2;
const _INT32_SIZE = 4;
const _UINT32_SIZE = 4;
const _BIGINT64_SIZE = 8;
const _BIGUINT64_SIZE = 8;

/**
 * Read a signed 8-bit integer from a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to read from.
 * @param {number} offset - The byte offset at which to read.
 * @returns {number} The signed 8-bit integer.
 */
export function readInt8(buffer, offset) {
  _checkBounds(buffer, offset, _INT8_SIZE);
  const value = buffer[offset];
  // Sign-extend if the high bit is set.
  return value & 0x80 ? value - 0x100 : value;
}

/**
 * Read an unsigned 8-bit integer from a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to read from.
 * @param {number} offset - The byte offset at which to read.
 * @returns {number} The unsigned 8-bit integer.
 */
export function readUInt8(buffer, offset) {
  _checkBounds(buffer, offset, _UINT8_SIZE);
  return buffer[offset];
}

/**
 * Read a signed 16-bit integer in big-endian byte order from a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to read from.
 * @param {number} offset - The byte offset at which to read.
 * @returns {number} The signed 16-bit integer.
 */
export function readInt16BE(buffer, offset) {
  _checkBounds(buffer, offset, _INT16_SIZE);
  const high = buffer[offset];
  const low = buffer[offset + 1];
  const unsigned = (high << 8) | low;
  // Sign-extend if the high bit of the high byte is set.
  return high & 0x80 ? unsigned - 0x10000 : unsigned;
}

/**
 * Read an unsigned 16-bit integer in big-endian byte order from a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to read from.
 * @param {number} offset - The byte offset at which to read.
 * @returns {number} The unsigned 16-bit integer.
 */
export function readUInt16BE(buffer, offset) {
  _checkBounds(buffer, offset, _UINT16_SIZE);
  return (buffer[offset] << 8) | buffer[offset + 1];
}

/**
 * Read a signed 32-bit integer in big-endian byte order from a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to read from.
 * @param {number} offset - The byte offset at which to read.
 * @returns {number} The signed 32-bit integer.
 */
export function readInt32BE(buffer, offset) {
  _checkBounds(buffer, offset, _INT32_SIZE);
  const high = (buffer[offset] << 8) | buffer[offset + 1];
  const low = (buffer[offset + 2] << 8) | buffer[offset + 3];
  const unsigned = (high * 0x10000) + low;
  // Use bitwise operations to convert to a signed 32-bit integer.
  return unsigned | 0;
}

/**
 * Read an unsigned 32-bit integer in big-endian byte order from a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to read from.
 * @param {number} offset - The byte offset at which to read.
 * @returns {number} The unsigned 32-bit integer.
 */
export function readUInt32BE(buffer, offset) {
  _checkBounds(buffer, offset, _UINT32_SIZE);
  const high = (buffer[offset] << 8) | buffer[offset + 1];
  const low = (buffer[offset + 2] << 8) | buffer[offset + 3];
  // Multiplication keeps the result unsigned (within Number's safe range).
  return (high * 0x10000) + low;
}

/**
 * Read a signed 64-bit integer in big-endian byte order from a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to read from.
 * @param {number} offset - The byte offset at which to read.
 * @returns {bigint} The signed 64-bit integer as a BigInt.
 */
export function readBigInt64BE(buffer, offset) {
  _checkBounds(buffer, offset, _BIGINT64_SIZE);
  const unsigned = readBigUInt64BE(buffer, offset);
  // Convert to signed by subtracting 2^64 if the high bit is set.
  return unsigned & 0x8000000000000000n ? unsigned - 0x10000000000000000n : unsigned;
}

/**
 * Read an unsigned 64-bit integer in big-endian byte order from a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to read from.
 * @param {number} offset - The byte offset at which to read.
 * @returns {bigint} The unsigned 64-bit integer as a BigInt.
 */
export function readBigUInt64BE(buffer, offset) {
  _checkBounds(buffer, offset, _BIGUINT64_SIZE);
  let value = 0n;
  for (let i = 0; i < 8; i++) {
    value = (value << 8n) | BigInt(buffer[offset + i]);
  }
  return value;
}

/**
 * Write a signed 8-bit integer into a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to write into.
 * @param {number} offset - The byte offset at which to write.
 * @param {number} value - The signed 8-bit integer to write.
 * @returns {void}
 */
export function writeInt8(buffer, offset, value) {
  _checkBounds(buffer, offset, _INT8_SIZE);
  buffer[offset] = value & 0xff;
}

/**
 * Write an unsigned 8-bit integer into a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to write into.
 * @param {number} offset - The byte offset at which to write.
 * @param {number} value - The unsigned 8-bit integer to write.
 * @returns {void}
 */
export function writeUInt8(buffer, offset, value) {
  _checkBounds(buffer, offset, _UINT8_SIZE);
  buffer[offset] = value & 0xff;
}

/**
 * Write a signed 16-bit integer in big-endian byte order into a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to write into.
 * @param {number} offset - The byte offset at which to write.
 * @param {number} value - The signed 16-bit integer to write.
 * @returns {void}
 */
export function writeInt16BE(buffer, offset, value) {
  _checkBounds(buffer, offset, _INT16_SIZE);
  buffer[offset] = (value >> 8) & 0xff;
  buffer[offset + 1] = value & 0xff;
}

/**
 * Write an unsigned 16-bit integer in big-endian byte order into a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to write into.
 * @param {number} offset - The byte offset at which to write.
 * @param {number} value - The unsigned 16-bit integer to write.
 * @returns {void}
 */
export function writeUInt16BE(buffer, offset, value) {
  _checkBounds(buffer, offset, _UINT16_SIZE);
  buffer[offset] = (value >> 8) & 0xff;
  buffer[offset + 1] = value & 0xff;
}

/**
 * Write a signed 32-bit integer in big-endian byte order into a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to write into.
 * @param {number} offset - The byte offset at which to write.
 * @param {number} value - The signed 32-bit integer to write.
 * @returns {void}
 */
export function writeInt32BE(buffer, offset, value) {
  _checkBounds(buffer, offset, _INT32_SIZE);
  buffer[offset] = (value >> 24) & 0xff;
  buffer[offset + 1] = (value >> 16) & 0xff;
  buffer[offset + 2] = (value >> 8) & 0xff;
  buffer[offset + 3] = value & 0xff;
}

/**
 * Write an unsigned 32-bit integer in big-endian byte order into a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to write into.
 * @param {number} offset - The byte offset at which to write.
 * @param {number} value - The unsigned 32-bit integer to write.
 * @returns {void}
 */
export function writeUInt32BE(buffer, offset, value) {
  _checkBounds(buffer, offset, _UINT32_SIZE);
  // Use unsigned right shift to ensure the value is treated as a 32-bit unsigned integer.
  buffer[offset] = (value >>> 24) & 0xff;
  buffer[offset + 1] = (value >>> 16) & 0xff;
  buffer[offset + 2] = (value >>> 8) & 0xff;
  buffer[offset + 3] = value & 0xff;
}

/**
 * Write a signed 64-bit integer in big-endian byte order into a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to write into.
 * @param {number} offset - The byte offset at which to write.
 * @param {bigint} value - The signed 64-bit integer to write.
 * @returns {void}
 */
export function writeBigInt64BE(buffer, offset, value) {
  _checkBounds(buffer, offset, _BIGINT64_SIZE);
  // Convert negative BigInts to their two's complement representation before writing.
  const unsigned = value < 0n ? value + 0x10000000000000000n : value;
  writeBigUInt64BE(buffer, offset, unsigned);
}

/**
 * Write an unsigned 64-bit integer in big-endian byte order into a Uint8Array at the given offset.
 *
 * @param {Uint8Array} buffer - The buffer to write into.
 * @param {number} offset - The byte offset at which to write.
 * @param {bigint} value - The unsigned 64-bit integer to write.
 * @returns {void}
 */
export function writeBigUInt64BE(buffer, offset, value) {
  _checkBounds(buffer, offset, _BIGUINT64_SIZE);
  for (let i = 7; i >= 0; i--) {
    buffer[offset + i] = Number(value & 0xffn);
    value >>= 8n;
  }
}

/**
 * Check that reading or writing `size` bytes from `offset` is within the buffer bounds.
 *
 * @param {Uint8Array} buffer - The buffer to check.
 * @param {number} offset - The starting byte offset.
 * @param {number} size - The number of bytes to access.
 * @throws {RangeError} If the access would go out of bounds.
 */
function _checkBounds(buffer, offset, size) {
  if (!Number.isInteger(offset) || offset < 0) {
    throw new RangeError('offset must be a non-negative integer');
  }
  if (offset + size > buffer.length) {
    throw new RangeError('access out of bounds');
  }
}
