---
title: "Hybrid Mining: Exploiting Blockchain`s Computational Power for Distributed Problem Solving"
collection: publications
permalink: /publication/SAC19
excerpt: 'We propose a new mining protocol that combines solving real-world useful problems with Hashcash.'
date: 2019-04-08
venue: 'ACM/SIGAPP Symposium on Applied Computing (SAC)'
paperurl: 
with: 'Krishnendu Chatterjee and Amir Kafshdar Goharshady'
---
In today's cryptocurrencies, Hashcash proof of work is the most commonly-adopted approach to mining. In Hashcash, when a miner decides to add a block to the chain, she has to solve the difficult computational puzzle of inverting a hash function. While Hashcash has been successfully adopted in both Bitcoin and Ethereum, it has attracted significant and harsh criticism due to its massive waste of electricity, its carbon footprint and environmental effects, and the inherent lack of usefulness in inverting a hash function. Various other mining protocols have been suggested, including proof of stake, in which a miner's chance of adding the next block is proportional to her current balance. However, such protocols lead to a higher entry cost for new miners who might not still have any stake in the cryptocurrency, and can in the worst case lead to an oligopoly, where the rich have complete control over mining.

In this paper, we propose Hybrid Mining: a new mining protocol that combines solving real-world useful problems with Hashcash. Our protocol allows new miners to join the network by taking part in Hashcash mining without having to own an initial stake. It also allows nodes of the network to submit hard computational problems whose solutions are of interest in the real world, e.g. protein folding problems. Then, miners can choose to compete in solving these problems, in lieu of Hashcash, for adding a new block. Hence, Hybrid Mining incentivizes miners to solve useful problems, such as hard computational problems arising in biology, in a distributed manner. It also gives researchers in other areas an easy-to-use tool to outsource their hard computations to the blockchain network, which has enormous computational power, by paying a reward to the miner who solves the problem for them. Moreover, our protocol provides strong security guarantees and is at least as resilient to double spending as Bitcoin.

[Download paper here](https://dl.acm.org/doi/abs/10.1145/3297280.3297319)

Recommended citation: 

@inproceedings{SAC19Pourdamghani,
  author    = {Krishnendu Chatterjee and
               Amir Kafshdar Goharshady and
               Arash Pourdamghani},
  title     = {Hybrid mining: exploiting blockchain's computational power for distributed
               problem solving},
  booktitle = {Proc. of the {ACM/SIGAPP} Symposium on Applied Computing,
               {SAC}},
  year      = {2019}
}
