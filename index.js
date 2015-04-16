'use strict';

var bitcore = require('bitcore');
var _ = bitcore.deps._;
var p2p = require('bitcore-p2p');
var Messages = new p2p.Messages();
var Peer = p2p.Peer;
var Transaction = bitcore.Transaction;
var Networks = bitcore.Networks;
var network = Networks.livenet;


var peer = new Peer('localhost', network);
peer.on('tx', function(m) {
  console.log(m.transaction.id);
  var b = m.transaction.toBuffer();
  console.log(b.toString('hex'));
});
peer.on('inv', function(m) {
  peer.sendMessage(Messages.GetData(m.inventory));
});
peer.connect();
