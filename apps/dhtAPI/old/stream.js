/* eslint-disable no-console */

import * as lp from 'it-length-prefixed'
import map from 'it-map'
import { pipe } from 'it-pipe'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

export function stdinToStream (stream) {
  try {
console.log('stdinToStream')
    // Read utf-8 from stdin
    process.stdin.setEncoding('utf8')
    pipe(
      // Read from stdin (the source)
      process.stdin,
      // Turn strings into buffers
      (source) => map(source, (string) => uint8ArrayFromString(string)),
      // Encode with length prefix (so receiving side knows how much data is coming)
      (source) => lp.encode(source),
      // Write to the stream (the sink)
      stream.sink
    )
  }
  catch (e) {
    console.log('catch stdinToStream error:', e)
  } 
}

export function streamToConsole (stream) {
  try {
    pipe(
      // Read from the stream (the source)
      stream.source,
      // Decode length-prefixed data
      (source) => lp.decode(source),
      // Turn buffers into strings
      (source) => map(source, (buf) => uint8ArrayToString(buf.subarray())),
      // Sink function
      async function (source) {
        // For each chunk of data
        for await (const msg of source) {
          // Output the data as a utf8 string
          console.log('> ' + msg.toString().replace('\n', ''))
        }
      }
    )
  }
  catch (e) {
    console.log('catch streamToConsole error:', e)
  } 
}
