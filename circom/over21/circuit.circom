pragma circom 2.1.6;

template IsOver21() {
    signal input age;
    signal output oldEnough;
    
    if (age >= 21) {
        oldEnough <== 1;
    } else {
        oldEnough <== 0;
    }
}

component main = IsOver21();
