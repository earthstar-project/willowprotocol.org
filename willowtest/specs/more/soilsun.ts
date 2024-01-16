import { Expression, Invocation, new_macro } from "macro";
import { link, lis, pinformative, site_template } from "../../main.ts";
import { code, div, em, img, pre, span } from "../../../h.ts";
import { def, r } from "../../../defref.ts";
import { marginale_inlineable } from "../../../marginalia.ts";
import { asset } from "../../../out.ts";
import { hsection } from "../../../hsection.ts";
import { html5 } from "../../../html5.ts";

const spec_md = `# Soilsun Spec

A fairly minimalistic earthstar knock-off.

## Concepts

An **author** consists of a keypair, a sequence of four ascii characters (lower-case letters and numbers only) called the **shortname**, and possibly a sentient entity that wants to distribute some data I guess.

A **share** is a collaboratively maintained, mutable key-value mapping. Every share is identified by a public key, the **share id**. Shares can be modified concurrently by different authors, hence they only exist as an abstraction, not as actual data structures. Those would be *replicas*.

A **replica** is a snapshot of a share at a particular moment in (distributed) time, usually backed by a persistent database. More precisely, a *replica* is a collection of *signed entries*. A **signed entry** consists of an *entry* (to be defined later), a signature over the *entry* with the private key of the share, and a signature over the *entry* with the private key of the author.

An **entry** is a pair of a *record identifier* and a *record*.

A **record identifier** is a tuple of:

- The **share id**, which is the *share id* of the *share*.
- The **author id**, which is the pair of the *public key* and the *shortname* of the author.
- The **timestamp**, which is a 64 bit integer (interpreted as microseconds since the Unix epoch).
- The **path**, a bitstring of length at most 2048.

A **record** is a tuple of:

- The **data**, a bitstring of length at most 2^64 - 1.
- The **expiry**, a 64 bit integer (interpreted as microseconds since the Unix epoch; the number \`0\` indicates that there is no expiry time).

## Merging

A **merge** takes a **share id** \`s\`, two *replicas* \`r1\` and \`r2\`, and a **merge time** \`t\` (microseconds since the Unix epoch) and deterministically maps these inputs to a *replica* \`r\` as follows:

- \`r\` starts as the union of the *signed entries* of \`r1\` and \`r2\`.
- Then, remove all *entries* whose *share id* is not \`s\`.
- Then, for each set of *entries* with equal *author ids* and equal *paths*, remove all but those with the highest *timestamp*.
- Then, for each set of *entries* with equal *author ids*, equal *paths*, and equal *timestamps*, remove all but the one with the largest \`hash(record)\`.
- Then, for each remaining *entry* whose *expiry* is less than or equal to \`t\`, remove that *entry*.

## Cryptographic Primitives and Encodings

All keypairs and signatures use [ed25519](https://ed25519.cr.yp.to/). All hashes are [blake3](https://github.com/BLAKE3-team/BLAKE3). The encodings for signing/hashing the concepts of soilsun are as follows:

- Encode bitstrings (including keys, signatures, hashes, record data) as plain bitstrings - no ascii, no length, no nothing.
- Encode fixed-width integers (including timestamps) as big-endian.
- Encode *records* as the encoding of the *expiry* directly followed by the encoding of the *data*.
- Encode *author ids* as the *shortname* (four bytes of ascii) directly followed by the encoding of the *public key*.
- Encode *record identifiers* as the encoding of the *share id* directly followed by the encoding of the *author id* directly followed by the encoding of the *timestamp* directly followed by the encoding of the *path*.
- Encode *entries* as the encoding of the *record identifier* directly followed by the encoding of the *record*.`;

export const soilsun = html5(
    [],
    [
        div(
            {
                style: `
                white-space: pre-wrap;
                font-family: mono;
                font-size: 1.3em;
                max-width: 40em;
                padding: 0.6em;
                `,
            },
            spec_md,
        ),
    ],
);

