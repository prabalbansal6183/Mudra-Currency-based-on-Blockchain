# Project Description
This Project is based on the implementation of Blockchain in real time environment with the help of JavaScript. This project contains the implementaion of Blockchain algorithms like Proof of Work and Consensus Algorithms. We have also implemented varios Blockchain features like distributed ledger ,decentralised network with the help of Node.js and exposed them as API's. So if you are begineer looking to learn the Blockchain Technology then this is a perfect begineer's project to follow along.

# API'S
We have implemented varios endpoints in the network.js file. And the various endpoint descriptions are:-
### 1. '/transaction'
This is the Post API whose work is to take the new transaction data and add it to the pending transactions object in our Blockchain DataStructure and return the current content of the Blockchain.
### 2. '/transaction/broadcast'
This is also a Post API, That is used to broadcast the updated transaction to all the network nodes connected with each other and uses the javaScript promisies to bind the all the request into and array and send it.
### 3. '/mine' 
This is a Get endpoint whose work is to mine the block and to update the transactions form pending transaction to the transaction object. Inside this the **'/transaction/broadcast'** endpoint also hit to update all the decentralised network nodes.
### 4. '/register-and-broadcast-node'
Through this endpoint we can register new network node into our decnetralised network and broadcast it into all the network nodes inside this endpoint two more endpoints got hit , for register a node on each node **'/register-node'** and for bulk registration when a new node is entered we encounter the **'/register-nodes-bulk'**.
### 5. '/consensus'
Consensus algorihtm is used when a new node is registered then for updating the contents of all the nodes to this new node they all have to come to an aggrement and then the value gets updated. Here in this project we have use a Longest chian Algorithm.

# Blockchain DataStructure

# Run in you Local System
For installing all the dependancy we can initially run this command
```
npm install 
```
For creating a decentralised network we eposed the same code through different port numbers. And for it smoothly we derive some scripts in package.json file.
So for running these nodes we can simply run these command in different terminals simultaneously.
  Run Nodes 
  ```
  npm run node_1
  npm run node_2
  npm run node_3
  npm run node_4
  npm run node_5
  ```
Now we can expose the html file through vscode live server extension of simply run the index.html file to run the Block Explorer for searching the transactions through BlockhashId, BlockAddress and Transacttion id.
Then using Postman we can talk with all the endpoints and update, insert Transactions according to our requirements.



  
 




 
