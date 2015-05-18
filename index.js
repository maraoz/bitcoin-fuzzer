'use strict';

var bitcore = require('bitcore');
var _ = bitcore.deps._;
var p2p = require('bitcore-p2p');
var Messages = new p2p.Messages();
var Peer = p2p.Peer;
var Transaction = bitcore.Transaction;
var Networks = bitcore.Networks;
var network = Networks.livenet;

var Insight = require('bitcore-explorers').Insight;
var insight = new Insight();


var peer = new Peer('localhost', network);
var txcount = 0;

peer.on('tx', function(m) {
  var b = m.transaction.toBuffer();
  for (var i = 0; i < b.length * 8; i++) {
    // flip bit i
    var copy = new Buffer(b.length);
    b.copy(copy);
    var j = Math.floor(i / 8);
    var n = copy[j] ^ (1 << (7 - i % 8));
    //console.log(i, j, copy[j], n);
    copy[j] = n;
    txcount += 1;
    var pt, pts;
    try {
      pt = new Transaction(copy);
      pts = pt.uncheckedSerialize();
    } catch (exc) {
      // nada
    }
    if (!pts) {
      continue;
    }
    insight.broadcast(pts, function(err, txid) {
      if (err) {
        console.log('err', err);
        return;
      }
      console.log(m.transaction.id, txid);
    });
  }
});

setInterval(function() {
  console.log(txcount);
}, 5000);

peer.on('inv', function(m) {
  peer.sendMessage(Messages.GetData(m.inventory));
});
peer.connect();
