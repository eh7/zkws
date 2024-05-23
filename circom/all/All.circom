pragma circom 2.0.0;

template fun(N){
  signal output out;
  out <== N;
}

template All(N){
  signal output out;
  component c[N];
  for(var i = 0; i < N; i++){
     c[i] = fun(i);
  }
}

component main = All(5);

/*
pragma circom 2.0.0;

template fun(N){
  signal output out;
  out <== N;
}

template fun2(N){
  signal output out;
  out <== N;
}

template all(N){
  component c[N];
  for(var i = 0; i < N; i++){
        if(i < N)
             c[i] = fun(i);
        else
           c[i] = fun2(i);
  }
}

component main = all(5);
*/
