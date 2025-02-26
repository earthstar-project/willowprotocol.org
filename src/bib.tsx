import { BibItemDeclaration } from "macromania-bib";
import { BigOmega, Mathcal, MFrac } from "./macros.tsx";
import { BigO, BigTheta, Curly } from "./macros.tsx";
import { Em, P } from "macromania-html";
import { M } from "macromania-katex";

export const bib: BibItemDeclaration[] = [
  {
    item: `@article{freedman2016efficient,
  title={Efficient set intersection with simulation-based security},
  author={Freedman, Michael J and Hazay, Carmit and Nissim, Kobbi and Pinkas, Benny},
  journal={Journal of Cryptology},
  volume={29},
  number={1},
  pages={115--155},
  year={2016},
  publisher={Springer}
}`,
    asset: ["references", "freedman2016efficient.pdf"],
    blurb: (
      <>
        <P>
          We consider the problem of computing the intersection of private
          datasets of two parties, where the datasets contain lists of elements
          taken from a large domain. This problem has many applications for
          online collaboration. In this work, we present protocols based on the
          use of homomorphic encryption and different hashing schemes for both
          the semi-honest and malicious environments. The protocol for the
          semi-honest environment is secure in the standard model, while the
          protocol for the malicious environment is secure in the random oracle
          model. Our protocols obtain linear communication and computation
          overhead. We further implement different variants of our semi-honest
          protocol. Our experiments show that the asymptotic overhead of the
          protocol is affected by different constants. (In particular, the
          degree of the polynomials evaluated by the protocol matters less than
          the number of polynomials that are evaluated.) As a result, the
          protocol variant with the best asymptotic overhead is not necessarily
          preferable for inputs of reasonable size.
        </P>
      </>
    ),
  },
  {
    item: `@inproceedings{de2010linear,
  title={Linear-complexity private set intersection protocols secure in malicious model},
  author={De Cristofaro, Emiliano and Kim, Jihye and Tsudik, Gene},
  booktitle={International Conference on the Theory and Application of Cryptology and Information Security},
  pages={213--231},
  year={2010},
  organization={Springer}
}`,
    asset: ["references", "de2010linear.pdf"],
    blurb: (
      <>
        <P>
          Private Set Intersection (PSI) protocols allow one party (“client”) to
          compute an intersection of its input set with that of another party
          (“server”), such that the client learns nothing other than the set
          intersection and the server learns nothing beyond client input size.
          Prior work yielded a range of PSI protocols secure under different
          cryptographic assumptions. Protocols operating in the semi-honest
          model offer better (linear) complexity while those in the malicious
          model are often significantly more costly. In this paper, we construct
          PSI and Authorized PSI (APSI) protocols secure in the malicious model
          under standard cryptographic assumptions, with both <Em>linear</Em>
          {" "}
          communication and computational complexities. To the best of our
          knowledge, our APSI is the first solution to do so. Finally, we show
          that our linear PSI is appreciably more efficient than the
          state-of-the-art.
        </P>
      </>
    ),
  },
  {
    item: `@inproceedings{agrawal2004order,
  title={Order preserving encryption for numeric data},
  author={Agrawal, Rakesh and Kiernan, Jerry and Srikant, Ramakrishnan and Xu, Yirong},
  booktitle={Proceedings of the 2004 ACM SIGMOD international conference on Management of data},
  pages={563--574},
  year={2004}
}`,
    asset: ["references", "agrawal2004order.pdf"],
    blurb: (
      <>
        <P>
          Encryption is a well established technology for protecting sensitive
          data. However, once encrypted, data can no longer be easily queried
          aside from exact matches. We present an order-preserving encryption
          scheme for numeric data that allows any comparison operation to be
          directly applied on encrypted data. Query results produced are sound
          (no false hits) and complete (no false drops). Our scheme handles
          updates gracefully and new values can be added without requiring
          changes in the encryption of other values. It allows standard databse
          indexes to be built over encrypted tables and can easily be integrated
          with existing database systems. The proposed scheme has been designed
          to be deployed in application environments in which the intruder can
          get access to the encrypted database, but does not have prior domain
          information such as the distribution of values and annot encrypt or
          decrypt arbitrary values of his choice. The encryption is robust
          against estimation of the true value in such environments.
        </P>
      </>
    ),
  },
  {
    item: `@inproceedings{boneh2015semantically,
  title={Semantically secure order-revealing encryption: Multi-input functional encryption without obfuscation},
  author={Boneh, Dan and Lewi, Kevin and Raykova, Mariana and Sahai, Amit and Zhandry, Mark and Zimmerman, Joe},
  booktitle={Annual International Conference on the Theory and Applications of Cryptographic Techniques},
  pages={563--594},
  year={2015},
  organization={Springer}
}`,
    asset: ["references", "boneh2015semantically.pdf"],
    blurb: (
      <>
        <P>
          Deciding “greater-than” relations among data items just given their
          encryptions is at the heart of search algorithms on encrypted data,
          most notably, non-interactive binary search on encrypted data.
          Order-preserving encryption provides one solution, but provably
          provides only limited security guarantees. Two-input functional
          encryption is another approach, but requires the full power of
          obfuscation machinery and is currently not implementable.
        </P>
        <P>
          We construct the first implementable encryption system supporting
          greater-than comparisons on encrypted data that provides the
          “best-possible” semantic security. In our scheme there is a public
          algorithm that given two ciphertexts as input, reveals the order of
          the corresponding plaintexts and nothing else. Our constructions are
          inspired by obfuscation techniques, but do not use obfuscation. For
          example, to compare two 16-bit encrypted values (e.g., salaries or
          age) we only need a 9-way multilinear map. More generally, comparing
          <M>k</M>-bit values requires only a{" "}
          <M>k/2 + 1</M>-way multilinear map. The required degree of
          multilinearity can be further reduced, but at the cost of increasing
          ciphertext size.
        </P>
        <P>
          Beyond comparisons, our results give an implementable secret-key
          multi-input functional encryption scheme for functionalities that can
          be expressed as (generalized) branching programs of polynomial length
          and width. Comparisons are a special case of this class, where for
          <M>k</M>-bit inputs the branching program is of length <M>k + 1</M>
          {" "}
          and width <M>4</M>.
        </P>
      </>
    ),
  },
  {
    item: `@inproceedings{lewi2016order,
  title={Order-revealing encryption: New constructions, applications, and lower bounds},
  author={Lewi, Kevin and Wu, David J},
  booktitle={Proceedings of the 2016 ACM SIGSAC Conference on Computer and Communications Security},
  pages={1167--1178},
  year={2016}
}`,
    asset: ["references", "lewi2016order.pdf"],
    blurb: (
      <>
        <P>
          In the last few years, there has been significant interest in
          developing methods to search over encrypted data. In the case of range
          queries, a simple solution is to encrypt the contents of the database
          using an order-preserving encryption (OPE) scheme (i.e., an encryption
          scheme that supports comparisons over encrypted values). However,
          Naveed et al. (CCS 2015) recently showed that OPE-encrypted databases
          are extremely vulnerable to "inference attacks."
        </P>
        <P>
          In this work, we consider a related primitive called order-revealing
          encryption (ORE), which is a generalization of OPE that allows for
          stronger security. We begin by constructing a new ORE scheme for small
          message spaces which achieves the "best-possible" notion of security
          for ORE. Next, we introduce a "domain extension" technique and apply
          it to our small-message-space ORE. While our domain-extension
          technique does incur a loss in security, the resulting ORE scheme we
          obtain is more secure than all existing (stateless and
          non-interactive) OPE and ORE schemes which are practical. All of our
          constructions rely only on symmetric primitives. As part of our
          analysis, we also give a tight lower bound for OPE and show that no
          efficient OPE scheme can satisfy best-possible security if the message
          space contains just three messages. Thus, achieving strong notions of
          security for even small message spaces requires moving beyond OPE.
        </P>
        <P>
          Finally, we examine the properties of our new ORE scheme and show how
          to use it to construct an efficient range query protocol that is
          robust against the inference attacks of Naveed et al. We also give a
          full implementation of our new ORE scheme, and show that not only is
          our scheme more secure than existing OPE schemes, it is also faster:
          encrypting a 32-bit integer requires just 55 microseconds, which is
          more than 65 times faster than existing OPE schemes.
        </P>
      </>
    ),
  },
  {
    item: `@inproceedings{naveed2015inference,
  title={Inference attacks on property-preserving encrypted databases},
  author={Naveed, Muhammad and Kamara, Seny and Wright, Charles V},
  booktitle={Proceedings of the 22nd ACM SIGSAC conference on computer and communications security},
  pages={644--655},
  year={2015}
}`,
    asset: ["references", "naveed2015inference.pdf"],
    blurb: (
      <>
        <P>
          Many encrypted database (EDB) systems have been proposed in the last
          few years as cloud computing has grown in popularity and data breaches
          have increased. The state-of-the-art EDB systems for relational
          databases can handle SQL queries over encrypted data and are
          competitive with commercial database systems. These systems, most of
          which are based on the design of CryptDB (SOSP 2011), achieve these
          properties by making use of property-preserving encryption schemes
          such as deterministic (DTE) and order- preserving encryption (OPE). In
          this paper, we study the concrete security provided by such systems.
          We present a series of attacks that recover the plaintext from DTE-
          and OPE-encrypted database columns using only the encrypted column and
          publicly-available auxiliary information. We consider well-known
          attacks, including frequency analysis and sorting, as well as new
          attacks based on combinatorial optimization.
        </P>
        <P>
          We evaluate these attacks empirically in an electronic medical records
          (EMR) scenario using real patient data from 200 U.S. hospitals. When
          the encrypted database is operating in a steady-state where enough
          encryption layers have been peeled to permit the application to run
          its queries, our experimental results show that an alarming amount of
          sensitive information can be recovered. In particular, our attacks
          correctly recovered certain OPE-encrypted attributes (e.g., age and
          disease severity) for more than 80% of the patient records from 95% of
          the hospitals; and certain DTE- encrypted attributes (e.g., sex, race,
          and mortality risk) for more than 60% of the patient records from more
          than 60% of the hospitals.
        </P>
      </>
    ),
  },
  {
    item: `@article{fan2004prefix,
  title={Prefix-preserving IP address anonymization: measurement-based security evaluation and a new cryptography-based scheme},
  author={Fan, Jinliang and Xu, Jun and Ammar, Mostafa H and Moon, Sue B},
  journal={Computer Networks},
  volume={46},
  number={2},
  pages={253--272},
  year={2004},
  publisher={Elsevier}
}`,
    asset: ["references", "fan2004prefix.pdf"],
    blurb: (
      <>
        <P>
          Real-world traffic traces are crucial for Internet research, but only
          a very small percentage of traces collected are made public. One major
          reason why traffic trace owners hesitate to make the traces publicly
          available is the concern that confidential and private information may
          be inferred from the trace. In this paper we focus on the problem of
          anonymizing IP addresses in a trace. More specifically, we are
          interested in <Em>prefix-preserving anonymization</Em>{" "}
          in which the prefix relationship among IP addresses is preserved in
          the anonymized trace, making such a trace usable in situations where
          prefix relationships are important. The goal of our work is two fold.
          First, we develop a cryptography-based, prefix-preserving
          anonymization technique that is provably as secure as the existing
          well-known TCPdpriv scheme, and unlike TCPdpriv, provides consistent
          prefix-preservation in large scale distributed setting. Second, we
          evaluate the security properties inherent in all prefix-preserving IP
          address anonymization schemes (including TCPdpriv). Through the
          analysis of Internet backbone traffic traces, we investigate the
          effect of some types of attacks on the security of any
          prefix-preserving anonymization algorithm. We also derive results for
          the optimum manner in which an attack should proceed, which provides a
          bound on the effectiveness of attacks in general.
        </P>
      </>
    ),
  },
  {
    item: `@inproceedings{li2005efficiency,
  title={Efficiency and security trade-off in supporting range queries on encrypted databases},
  author={Li, Jun and Omiecinski, Edward R},
  booktitle={IFIP Annual Conference on Data and Applications Security and Privacy},
  pages={69--83},
  year={2005},
  organization={Springer}
}`,
    asset: ["references", "li2005efficiency.pdf"],
    blurb: (
      <>
        <P>
          The database-as-a-service (DAS) model is a newly emerging computing
          paradigm, where the DBMS functions are outsourced. It is desirable to
          store data on database servers in encrypted form to reduce security
          and privacy risks since the server may not be fully trusted. But this
          usually implies that one has to sacrifice functionality and efficiency
          for security. Several approaches have been proposed in recent
          literature for efficiently supporting queries on encrypted databases.
          These approaches differ from each other in how the index of attribute
          values is created. Random one-to-one mapping and order-preserving are
          two examples. In this paper we will adapt a prefix-preserving
          encryption scheme to create the index. Certainly, all these approaches
          look for a convenient trade-off between efficiency and security. In
          this paper we will discuss the security issues and efficiency of these
          approaches for supporting range queries on encrypted numeric data.
        </P>
      </>
    ),
  },
];
