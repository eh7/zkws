function numToUint8Array(num) {
  let arr = new Uint8Array(8);

  for (let i = 0; i < 8; i++) {
    arr[i] = num % 256;
    num = Math.floor(num / 256);
  }

  return arr;
}

function uint8ArrayToNumV1(arr) {
  let num = 0;

  for (let i = 0; i < 8; i++) {
    num += Math.pow(256, i) * arr[i];
  }

  return num;
}

function uint8ArrayToNumV2(arr) {
  let num = 0;

  for (let i = 7; i >= 0; i--) {
    num = num * 256 + arr[i];
  }

  return num;
}

let foo = numToUint8Array(9458239048);
let bar = uint8ArrayToNumV1(foo); // 9458239048
let baz = uint8ArrayToNumV2(foo); // 9458239048

console.log(foo, bar, baz);
