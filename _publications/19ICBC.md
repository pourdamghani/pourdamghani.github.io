---
title: "Probabilistic smart contracts: Secure randomness on the blockchain"
collection: publications
permalink: /publication/ICBC19
excerpt: 'We propose a novel game-theoretic approach for generating provably unmanipulatable pseudorandom numbers on the blockchain.'
date: 2019-05-14
venue: 'IEEE International Conference on Blockchain and Cryptocurrency (ICBC)
'
paperurl: 
with: 'Krishnendu Chatterjee and Amir Kafshdar Goharshady'
---
In today's programmable blockchains, smart contracts are limited to being deterministic and non-probabilistic. This lack of randomness is a consequential limitation, given that a wide variety of real-world financial contracts, such as casino games and lotteries, depend entirely on randomness. As a result, several ad-hoc random number generation approaches have been developed to be used in smart contracts. These include ideas such as using an oracle or relying on the block hash. However, these approaches are manipulatable, i.e. their output can be tampered with by parties who might not be neutral, such as the owner of the oracle or the miners.We propose a novel game-theoretic approach for generating provably unmanipulatable pseudorandom numbers on the blockchain. Our approach allows smart contracts to access a trustworthy source of randomness that does not rely on potentially compromised miners or oracles, hence enabling the creation of a new generation of smart contracts that are not limited to being non-probabilistic and can be drawn from the much more general class of probabilistic programs.

[Download paper here](https://ieeexplore.ieee.org/abstract/document/8751326/)

Recommended citation: 
@inproceedings{ICBC19Pourdamghani,
  author    = {Krishnendu Chatterjee and
               Amir Kafshdar Goharshady and
               Arash Pourdamghani},
  title     = {Probabilistic Smart Contracts: Secure Randomness on the Blockchain},
  booktitle = {Proc. of the {IEEE} International Conference on Blockchain and Cryptocurrency,
               {ICBC}},
  year      = {2019}
}