---
title: "Polynomial-Time Fence Insertion for Structured Programs"
collection: publications
permalink: /publication/DISC19
excerpt: 'We consider the class of programs with structured branch and loop statements and present a greedy and polynomial-time optimum fence insertion algorithm. In addition, we show that the minimum fence insertion problem with multiple types of fence instructions is NP-hard even for straight-line programs.'
date: 2019-10-08
venue: 'International Symposium on Distributed Computing (DISC)'
paperurl: 
with: 'Mohammad Taheri and Mohsen Lesani'
---
To enhance performance, common processors feature relaxed memory models that reorder instructions. However, the correctness of concurrent programs is often dependent on the preservation of the program order of certain instructions. Thus, the instruction set architectures offer memory fences. Using fences is a subtle task with performance and correctness implications: using too few can compromise correctness and using too many can hinder performance. Thus, fence insertion algorithms that given the required program orders can automatically find the optimum fencing can enhance the ease of programming, reliability, and performance of concurrent programs. In this paper, we consider the class of programs with structured branch and loop statements and present a greedy and polynomial-time optimum fence insertion algorithm. The algorithm incrementally reduces fence insertion for a control-flow graph to fence insertion for a set of paths. In addition, we show that the minimum fence insertion problem with multiple types of fence instructions is NP-hard even for straight-line programs.

[Download paper here](https://drops.dagstuhl.de/opus/volltexte/2019/11341/)

Recommended citation: 

@inproceedings{DISC19Pourdamghani,
  author    = {Mohammad Taheri and
               Arash Pourdamghani and
               Mohsen Lesani},
  editor    = {Jukka Suomela},
  title     = {Polynomial-Time Fence Insertion for Structured Programs},
  booktitle = {Proc. of the International Symposium on Distributed Computing, {DISC}},
  year      = {2019}
}
