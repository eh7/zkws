function isPrime(x) {
  for (let d = 2; d * d <= x; d++) {
    //console.log(d, x % d )
    if (x % d == 0) {
      return false;
    }
  }
  return x >= 2;
}

function binpower(base, e, mod) {
  let result = 1;
  base %= mod;
  while (e) {
    if (e & 1) {
      result = result * base % mod;
    }
    base = base * base % mod;
    e >>= 1;
  }
  return result;
}

function probablyPrimeFermat(n, iter) {
    if (n < 4)
        return n == 2 || n == 3;

    for (let i = 0; i < iter; i++) {
        const rand = Math.floor(Math.random() * 100);
        let a = 2 + rand % (n - 3);
        //console.log(a);
        if (binpower(a, n - 1, n) != 1)
            return false;
    }
    return true;
}

const x = process.argv[2] || 2
console.table([
  [
    "isPrime: ",
    x,
    isPrime(x)
  ],[
    "probablyPrimeFermat: ",
    x,
    probablyPrimeFermat(x, 5)
  ]
]);
