import { BibItemDeclaration } from "macromania-bib";
import { BigOmega, Mathcal, MFrac } from "./macros.tsx";
import { BigO, BigTheta, Curly } from "./macros.tsx";
import { Em, P } from "macromania-html";

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
];
