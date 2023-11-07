import { p } from "../../../h.ts";
import { Expression } from "../../../tsgen.ts";
import { site_template } from "../../main.ts";

export const psi: Expression = site_template(
    {
        title: "Private Set Intersection",
        name: "psi",
    },
    [
        p("TODO"),
    ],
);

// As of writing (November 2023), the [X25519](https://en.wikipedia.org/wiki/Curve25519) elliptic curve is a suitable and secure cryptographic primitive. In terms of its implementation in the popular [libsodium](https://doc.libsodium.org/) library, `PsiGroup` is the type of integers of width `crypto_scalarmult_BYTES`, `PsiScalar` is the type of integers of width `crypto_scalarmult_SCALARBYTES`, and `psi_scalar_mutiplication` is libsodium's `crypto_scalarmult`.