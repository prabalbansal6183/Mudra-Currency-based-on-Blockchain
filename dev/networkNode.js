var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { Hash } = require('crypto');
const rp = require('request-promise');
const port = process.argv[2];

const { v4: uuidv4 } = require('uuid');
const nodeAddress = uuidv4().split('-').join('');
// const uuid = require('uuid/v1.js');

// const nodeAddress = uuid;

const bitcoin = new Blockchain();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get('/blockchain',function(req,res){
   res.send(bitcoin);
});

app.post('/transaction',function(req,res){
   const newTransaction = req.body;
   const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
   res.json({
       note: `Transaction will be added in the block${blockIndex}.`
   });
});

app.post('/transacion/broadcast',function(req,res){
    const newTransaction = bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipient);
    bitcoin.addTransactionToPendingTransaction(newTransaction);
    const requestPromises = [];
    bitcoin.netwrokNodes.forEach(networkNodeUrl =>{
        const requestOptions = {
            uri: networkNodeUrl+'/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises)
    .then(data =>{
        res.json({note: "Transaction created and broadcast Successfully"});
    });
});

app.get('/mine', function(req,res){
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];

    const currentBlockData = {
        transaction: bitcoin.pendingTransactions,
        index: lastBlock['index']+1
    }

    const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
     const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);
    // bitcoin.createNewTransaction(12.5,"00",nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce,previousBlockHash,blockHash);

    const requestPromises = [];

    bitcoin.netwrokNodes.forEach(networkNodeUrl =>{
        const requestOptions = {
            uri: networkNodeUrl+'/receive-new-block',
            method: 'POST',
            body: {newBlock: newBlock },
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data =>{
        const requestOptions = {
            uri:bitcoin.currentNodeUrl+'/transacion/broadcast',
            method: 'POST',
            body: {
                amount:12.5,
                sender:"00",
                recipient: nodeAddress
            },
            json: true
        };
        return rp(requestOptions);
    })
    .then(data =>{
        res.json({
            note: "new Block mine and broadcast successfully",
            block : newBlock
        });
    });

});

app.post('/receive-new-block',function(req,res){
    const newBlock = req.body.newBlock;
    const lastBlock =  bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if(correctHash && correctIndex)
    {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: "New Block received and Accepted",
            newBlock: newBlock
        });
    }
    else{
        res.json({
            note: "New Block rejected",
            newBlock:newBlock
        });
    }
});

//register a node and broadcast it the network
app.post('/register-and-broadcast',function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.netwrokNodes.indexOf(newNodeUrl) == -1)bitcoin.netwrokNodes.push(newNodeUrl);

    const regNodesPromises = [];

    bitcoin.netwrokNodes.forEach(networkNodeUrl => {
        // '/register-node'
        const requestOptions = {
            uri:  networkNodeUrl + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl },
            json : true
        };   
        
        regNodesPromises.push(rp(requestOptions));
    });
   const pp =  Promise.all(regNodesPromises)
    .then(data =>{
        // use the data ... 
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-node-bulk',
            method: 'POST',
            body: {allNetworkNodes : [...bitcoin.netwrokNodes,bitcoin.currentNodeUrl]},
            json: true
        };
        return rp(bulkRegisterOptions);
    })
.then(data =>{
    res.json({note: 'New Node register with network successfully'});
});

pp.catch((error) => {
    console.error(error);
  });
 });


// register a node to the network
app.post('/register-node',function(req,res){
    const newNodeUrl = req.body.newNodeUrl;
    const  nodeNotAlreadyPresent = bitcoin.netwrokNodes.indexOf(newNodeUrl)==-1;
    const notCureentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlreadyPresent && notCureentNode) bitcoin.netwrokNodes.push(newNodeUrl);
    res.json({note:'new Node registered successfully with node'});
});

//register multiple node at once
app.post('/register-node-bulk',function(req,res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl =>{
        const nodeNotAlreadyPresent = bitcoin.netwrokNodes.indexOf(networkNodeUrl) == -1;
        const nodeCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
       if(nodeNotAlreadyPresent && nodeCurrentNode) bitcoin.netwrokNodes.push(networkNodeUrl);
    });
    res.json({node: 'Bulk Registration Successful.'});
});

app.listen(port,function(){
    console.log(`listening on port ${port}`);
});