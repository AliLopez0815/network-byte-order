import test from 'node:test';
import assert from 'node:assert/strict';

import {
  readInt8,
  readUInt8,
  readInt16BE,
  readUInt16BE,
  readInt32BE,
  readUInt32BE,
  readBigInt64BE,
  readBigUInt64BE,
  writeInt8,
  writeUInt8,
  writeInt16BE,
  writeUInt16BE,
  writeInt32BE,
  writeUInt32BE,
  writeBigInt64BE,
  writeBigUInt64BE,
} from '../src/core.js';

test('readInt8 reads signed values', () => {
  const buffer = new Uint8Array([0x00, 0x7f, 0x80, 0xff]);
  assert.equal(readInt8(buffer, 0), 0);
  assert.equal(readInt8(buffer, 1), 127);
  assert.equal(readInt8(buffer, 2), -128);
  assert.equal(readInt8(buffer, 3), -1);
});

test('readUInt8 reads unsigned values', () => {
  const buffer = new Uint8Array([0x00, 0x7f, 0x80, 0xff]);
  assert.equal(readUInt8(buffer, 0), 0);
  assert.equal(readUInt8(buffer, 1), 127);
  assert.equal(readUInt8(buffer, 2), 128);
  assert.equal(readUInt8(buffer, 3), 255);
});

test('readInt16BE reads signed big-endian values', () => {
  const buffer = new Uint8Array([0x00, 0x00, 0x7f, 0xff, 0x80, 0x00, 0xff, 0xff]);
  assert.equal(readInt16BE(buffer, 0), 0);
  assert.equal(readInt16BE(buffer, 2), 32767);
  assert.equal(readInt16BE(buffer, 4), -32768);
  assert.equal(readInt16BE(buffer, 6), -1);
});

test('readUInt16BE reads unsigned big-endian values', () => {
  const buffer = new Uint8Array([0x00, 0x00, 0x7f, 0xff, 0x80, 0x00, 0xff, 0xff]);
  assert.equal(readUInt16BE(buffer, 0), 0);
  assert.equal(readUInt16BE(buffer, 2), 32767);
  assert.equal(readUInt16BE(buffer, 4), 32768);
  assert.equal(readUInt16BE(buffer, 6), 65535);
});

test('readInt32BE reads signed big-endian values', () => {
  const buffer = new Uint8Array([
    0x00, 0x00, 0x00, 0x00,
    0x7f, 0xff, 0xff, 0xff,
    0x80, 0x00, 0x00, 0x00,
    0xff, 0xff, 0xff, 0xff,
  ]);
  assert.equal(readInt32BE(buffer, 0), 0);
  assert.equal(readInt32BE(buffer, 4), 2147483647);
  assert.equal(readInt32BE(buffer, 8), -2147483648);
  assert.equal(readInt32BE(buffer, 12), -1);
});

test('readUInt32BE reads unsigned big-endian values', () => {
  const buffer = new Uint8Array([
    0x00, 0x00, 0x00, 0x00,
    0x7f, 0xff, 0xff, 0xff,
    0x80, 0x00, 0x00, 0x00,
    0xff, 0xff, 0xff, 0xff,
  ]);
  assert.equal(readUInt32BE(buffer, 0), 0);
  assert.equal(readUInt32BE(buffer, 4), 2147483647);
  assert.equal(readUInt32BE(buffer, 8), 2147483648);
  assert.equal(readUInt32BE(buffer, 12), 4294967295);
});

test('readBigInt64BE reads signed big-endian values', () => {
  const buffer = new Uint8Array([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  ]);
  assert.equal(readBigInt64BE(buffer, 0), 0n);
  assert.equal(readBigInt64BE(buffer, 8), 9223372036854775807n);
  assert.equal(readBigInt64BE(buffer, 16), -9223372036854775808n);
  assert.equal(readBigInt64BE(buffer, 24), -1n);
});

test('readBigUInt64BE reads unsigned big-endian values', () => {
  const buffer = new Uint8Array([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  ]);
  assert.equal(readBigUInt64BE(buffer, 0), 0n);
  assert.equal(readBigUInt64BE(buffer, 8), 9223372036854775807n);
  assert.equal(readBigUInt64BE(buffer, 16), 9223372036854775808n);
  assert.equal(readBigUInt64BE(buffer, 24), 18446744073709551615n);
});

test('write functions round-trip with read functions', () => {
  const buffer = new Uint8Array(8);

  writeInt8(buffer, 0, -128);
  assert.equal(readInt8(buffer, 0), -128);

  writeUInt8(buffer, 1, 255);
  assert.equal(readUInt8(buffer, 1), 255);

  writeInt16BE(buffer, 2, -32768);
  assert.equal(readInt16BE(buffer, 2), -32768);

  writeUInt16BE(buffer, 4, 65535);
  assert.equal(readUInt16BE(buffer, 4), 65535);
});

test('write functions handle 32-bit and 64-bit values', () => {
  const buffer = new Uint8Array(24);

  writeInt32BE(buffer, 0, -2147483648);
  assert.equal(readInt32BE(buffer, 0), -2147483648);

  writeUInt32BE(buffer, 4, 4294967295);
  assert.equal(readUInt32BE(buffer, 4), 4294967295);

  writeBigInt64BE(buffer, 8, -9223372036854775808n);
  assert.equal(readBigInt64BE(buffer, 8), -9223372036854775808n);

  writeBigUInt64BE(buffer, 16, 18446744073709551615n);
  assert.equal(readBigUInt64BE(buffer, 16), 18446744073709551615n);
});

test('offset out of bounds throws RangeError', () => {
  const buffer = new Uint8Array(4);
  assert.throws(() => readInt16BE(buffer, 3), RangeError);
  assert.throws(() => writeUInt32BE(buffer, 1), RangeError);
  assert.throws(() => readInt8(buffer, -1), RangeError);
  assert.throws(() => readUInt8(buffer, 4), RangeError);
});

test('negative BigInt writes two\'s complement representation', () => {
  const buffer = new Uint8Array(8);
  writeBigInt64BE(buffer, 0, -1n);
  const expected = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
  assert.deepEqual(buffer, expected);
  assert.equal(readBigInt64BE(buffer, 0), -1n);
});
