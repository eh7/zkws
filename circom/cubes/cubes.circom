pragma circom 2.1.5;

template Cubes (N) {
   //Declaration of signals.
   signal input in[N];
   signal output out[N];

   signal aux[N];

   //Statements.
   for (var i = 0; i < N; i++) {
      aux[i] <== in[i]*in[i];
      out[i] <== aux[i]*in[i];      
   }
}

component main = Cubes(3);
