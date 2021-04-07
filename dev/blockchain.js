const sha256 = require('sha256');
const { v4: uuidv4 } = require('uuid');
// can be developed with classes and which i will going to do it after
const currentNodeUrl = process.argv[3];

function Blockchain(){
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.netwrokNodes = [];
    this.createNewBlock(100,'0','0'); // Genesis Block 
}

Blockchain.prototype.createNewBlock = function (nonce,previousBlockHash,hash) {
    const newBlock = {
        index: this.chain.length+1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, // proof of work , number 
        hash: hash, // data from our new Block  // compressed
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = []; // clears the current transactions
    this.chain.push(newBlock);
    
    return newBlock;
}


Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length -1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId:  uuidv4().split('-').join('')
    };

    // this.pendingTransactions.push(newTransaction);

    // return this.getLastBlock()['index']+1;

    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransaction = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index']+1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash,currentBlockData, nonce){
    
const dataAsString = previousBlockHash+nonce.toString()+ JSON.stringify(currentBlockData);
const hash = sha256(dataAsString);
return hash;
}


Blockchain.prototype.proofOfWork = function(previousBlockHash,currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash,currentBlockData,nonce); // random hashes sha 256
    // 0000ASDFASDFASDFASDF
    while(hash.substring(0,4)!='0000')
    {
        nonce++;
        hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
    }
    return nonce;
}

module.exports = Blockchain;

