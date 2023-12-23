import { def, r, rs } from "../../../defref.ts";
import { em, p, s } from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { link_name } from "../../../linkname.ts";
import { marginale, sidenote } from "../../../marginalia.ts";
import { Expression } from "../../../tsgen.ts";
import { link, pinformative, quotes, site_template } from "../../main.ts";

export const timestamps_really: Expression = site_template(
    {
        title: "Timestamps, really?",
        name: "timestamps_really",
    },
    [
        pinformative("Willow implements a key-value store (up to prefix-based overwrites), and a key-value store can map any one key to at most one value. Willow uses simple numeric ", rs("Timestamp"), " to resolve conflicting mappings. This design decision might trigger some healthy scepticism, so this text walks you through our reasoning for building them into the protocol."),

        hsection("why_no_timestamps", "Healthy Scepticism", [
            pinformative("We start by laying out why unreflected usage of timestamps is a bad idea; both to give a solid foundation to our arguments in favour of using them regardless, and to give you a clear picture of which blind spots we might have (please reach out and tell us about them)."),

            pinformative("Peer-to-peer systems operate in an asynchronous model of communication: peers cannot know how long it takes until a communication of theirs reaches its recipient. This networking model is full of ", s("depressing"), " ", em("fun"), " impossibility results, such as the impossibility of ", link("reaching consensus", "https://en.wikipedia.org/wiki/Consensus_(computer_science)#The_FLP_impossibility_result_for_asynchronous_deterministic_consensus"), ". If it was possible to reach consensus in a peer-to-peer system, it could collectively act like a large, centralised system, simplifying many design issues."),

            pinformative("Assuming that everyone agrees on the same numeric representation of time at a given instant would mean that everyone reached ", em("consensus"), " on the time. Which is impossible. So any system that ", em("relies"), " on accurate timestamps is a centralised system in disguise."),

            pinformative("But isn’t time a physical phenomenon that resides outside these mathematical formalisms and that can be accurately tracked by fully independent devices? Unfortunately not. Any physical clock will exhibit ", link("clock drift", "https://en.wikipedia.org/wiki/Clock_drift"), ", no two clocks can be assumed to stay in perfect sync forever. Relativity throws in a few more wrenches, earth satellites already have to account for time dilation."),

            pinformative("The gist is that there can be no globally shared understanding of time, we can only reason about the local understanding of time of each participant in a distributed system. ", link("Clock synchronisation", "https://en.wikipedia.org/wiki/Clock_synchronisation"), " can go a long way, but requires connectivity and limits on how long it takes to transmit messages. A ", quotes("proper"), " distributed system opts for ", link("logical clocks", "https://en.wikipedia.org/wiki/Logical_clock"), ", tracking the ", link("happened-before", "https://en.wikipedia.org/wiki/Happened-before"), " relation of events using ", link("vector clocks", "https://en.wikipedia.org/wiki/Vector_clock"), " (or any of their many relatives)."),

            pinformative("Relying on timestamps has another problem: we cannot trust our peers to be truthful. Any participant might claim its entries to have arbitrary timestamps, whether from the distant future or the distant past. And while we might be fine with simply shunning obvious liars from our set of peers, even a non-malicious peer might accidentally create entries with bogus timestamps if their operating system has funny ideas about their current time."),
        ]),

        hsection("why_timestamps_anyways", "Why We Use Timestamps Anyways", [
            pinformative("Vector clocks that track the happened-before relation are real, and absolute timestamps are not. Why not use vector clocks then? First, tracking the happened-before relation accurately requires space proportional to the greatest number of concurrent events, a number we cannot bound in a peer-to-peer system. And second, it simply doesn’t help us: many entries will still be created concurrently, and we still have ", sidenote("to", ["We ", quotes("have to"), " in order to guarantee ", link("eventual consistency", "https://en.wikipedia.org/wiki/Eventual_consistency"), ", which is a non-negotiable aim of Willow."]), " deterministically choose a winner."),

            pinformative("Mapping a set of concurrently created ", rs("Entry"), " to a single winner cannot be done in a fully satisfactory way, but we can at least try to improve the situation: by annotating every ", r("Entry"), " with its ", r("entry_timestamp"), ". ", em("If"), " the issuers are truthful and have sufficiently synchronised clocks, we get the expected outcome of the newest ", r("Entry"), " winning. That’s a lot better than taking a purist view and choosing, for example, the ", r("Entry"), " with the lowest ", r("entry_payload_digest"), ". In case of tied ", rs("entry_timestamp"), ", we can safely fall back to the hash option (and distinct ", rs("Payload"), " never hash to the same digest by assumption)."),

            pinformative("If an author is malicious, that author can deliberately choose a high timestamp to make its ", r("Entry"), " the winner. But that’s not a useful argument against timestamps, because ", em("any"), " deterministic solution (that gives all authors a fair treatment) can be gamed. If we decided by lowest hash, the malicious author could make semantically meaningless changes to their data until it hashed to a sufficiently low value."),

            pinformative("Willow does not rely on timestamps to be accurate — we still get well-defined, eventually-consistent behaviour even if authors choose their timestamps arbitrarily. They simply provide a significant improvement in terms of the intuitively expected behaviour in the happy case. And we can argue that the happy case is quite common."),

            pinformative(marginale("You might have more stringent requirements in terms of accuracy, in which case another, specialised system would be superior for your use-case. That’s okay, a rather general-purpose protocol like Willow cannot fit everybody’s needs."), "While clock drift is an issue in theory, most clocks are actually quite good in practise (as are the clock synchronisation algorithms your operating system employs without you knowing). When is the last time you missed an appointment because of digital clock drift? If you have a clear intuitive sense of which of two ", rs("Entry"), " is ", quotes("newer"), ", chances are the devices that produced those ", rs("Entry"), " have given them ", rs("entry_timestamp"), " that reflect your perception."),
        ]),

        hsection("rouge_timestamps", "Handling Rogue Timetamps", [
            pinformative("These arguments hopefully are convincing, yet we cannot justify using timestamps by exclusively focusing on the happy case. So now we discuss the effects of maliciously (or buggily) crafted timestamps."),

            pinformative("Willow automatically separates ", rs("Entry"), " by ", r("entry_subspace_id"), ". An ", r("Entry"), " with a high ", r("entry_timestamp"), " only overwrites ", rs("Entry"), " in the same ", r("subspace"), ". If you do not allow anyone else to write to your ", r("subspace"), ", it does not matter how devilishly clever they choose their timestamps — your data remains unaffected."),

            pinformative("You can still collaborate with untrusted peers by aggregating data from different subspaces into a coherent view, whether through ", link("CRDTs", "https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type"), ", ", link("operational transformations", "https://en.wikipedia.org/wiki/Operational_transformation"), ", or ", link("abstract nonsense", "https://arxiv.org/abs/1311.3903"), "."),

            pinformative("User interfaces that rely on timestamps might still be coaxed into undesired behaviour, but that would be just as true if the timestamps came from an ", r("Entry"), "’s ", r("Payload"), " rather than its metadata. The issue of trusting timestamps in UI design (or using more secure alternatives) is removed from the underlying protocol."),

            pinformative("But what if you yourself create an ", r("Entry"), " with an outlandish ", r("entry_timestamp"), "? That’s where things become more problematic."),

            pinformative("If you accidentally backdate an ", r("Entry"), ", it will vanish once it comes into contact with your own non-buggy ", rs("Entry"), " (whose ", r("entry_path"), " is a non-strict prefix). Frustrating, but no real way around it. Fortunately, the consequences are rather limited."),

            pinformative("If you accidentally assign a large ", r("entry_timestamp"), ", things are more problematic: it will overwrite all non-buggy ", rs("Entry"), " (whose ", r("entry_path"), " it is a non-strict prefix), and the buggy ", r("Entry"), " will replicate through the network, deleting the non-buggy ", rs("Entry"), " everywhere. To add insult to injury, you cannot create any new ", rs("Entry"), " with accurate ", rs("entry_timestamp"), " (under the buggy ", r("entry_path"), ") until the buggily assigned time has passed. The only remedy is to get every device that stores the buggy ", r("Entry"), " (or ", rs("Entry"), ") to locally delete them at the same time, before resuming data replication. This is quite an effort for small networks, and completely infeasible for large networks."),

            pinformative("This is bad. It should only happen very rarely, but it still makes sense to implement additional countermeasures. First, any API to create ", rs("Entry"), " of the current time can be hardcoded to raise an error if its time source reports a timestamp that unrealistically diverges from the implementation time. And second, peers can and should simply reject incoming ", rs("Entry"), " that were created too far in the future compared to their local time. This way, buggy ", rs("Entry"), " stay isolated on the offending device rather than polluting the network."),

            pinformative("An appropriate definition of ", quotes("too far in the future"), " depends on the expected clock-drift and can hence be fairly accurate. Rejecting ", rs("Entry"), " ten minutes from the future should be more than enough to account for any clock drift that can be considered non-buggy. But there are good reasons for future-dating ", rs("Entry"), " in the context of moderation, which brings us to the next topic: capabilities."),
        ]),

        hsection("timestamps_meadowcap", "Timestamps in Meadowcap", [
            marginale("Meadowcap is a security component. There will be no happy-case reasoning here, only adversarially chosen timestamps."),

            pinformative("Willow allows write-access control via the ", r("is_authorised_write"), " function, which receives a full ", r("Entry"), " as input — including its ", r("entry_timestamp"), ". ", link_name("meadowcap", "Meadowcap"), " (the recommended access-control system for Willow) allows to incorporate ", rs("entry_timestamp"), " into access control. In the following, we discuss issues of timestamps with respect to Meadowcap. We assume familiarity with (the introduction of) the ", link_name("meadowcap", "Meadowcap specification"), "."),

            pinformative("When a Meadowcap capability restricts ", r("Entry"), " creation based on timestamps, this has ", em("absolutely nothing"), " to do with the (physical) time at which ", rs("Entry"), " are ", em("created"), ". It merely restricts which times can be ", em("claimed"), " as the ", rs("entry_timestamp"), " of ", rs("Entry"), "."),

            pinformative("If you give me a capability to write ", rs("Entry"), " to your ", r("subspace"), " on the 18th of July 2024, I can still create ", rs("Entry"), " in 2032 and add them to your ", r("subspace"), ", but only if I give them a ", r("entry_timestamp"), " for the 18th of July 2024. And you can make sure that no such ", r("Entry"), " will be propagated by creating your own ", rs("Entry"), " whose ", r("entry_timestamp"), " is higher than that of the 18th of July 2024."),

            pinformative("Repeatedly handing out capabilities that grant access for a small time span imitates the concept of revoking rights in a more centralised environment: you simply do not renew someone’s capability, and they cannot create accurately timestamped ", rs("Entry"), " once their last capability has expired. And by creating newer ", rs("Entry"), ", you make sure that someone with an expired capability cannot make their writes propagate anymore."),

            pinformative("There is an inherent tension between latency and offline-firstness here. Low latency in access revocation requires short-lived capabilities, but those need to be continuously renewed by contacting the authority that issues the capabilities. If I can only connect to the Internet once every three months, I need long-lived capabilities."),

            pinformative("The correct trade-off depends on the specific situation, it might even be impossible to know in advance. If this sounds discouraging, remember that centralised systems cannot tolerate ", em("any"), " period of disconnectivity."),

            pinformative("Write capabilities also happen to provide another layer of protection against accidentally future-dating your own ", rs("Entry"), ". If my write capability reaches only one week into the future, I can start mitigating the damage done by an accidental future-dating after a single week. Furthermore, the buggy clock has to produce a time in the valid range, whereas other buggy timestamps will be filtered out immediately, leaving the ", r("subspace"), " unpolluted."),

            pinformative("The system of expiring capabilities does provide a good reason for future-dating entries: a moderator can irrevocably (for the original author) delete an ", r("Entry"), " by overwriting it with another ", r("Entry"), " whose ", r("entry_timestamp"), " is greater than the greatest time at which the original author can date their ", rs("Entry"), ". Hence, peers should adjust the safeguard time difference they allow between new ", rs("Entry"), " and their local clock to allow for moderation (for example by only rejecting ", rs("Entry"), " whose time difference exceeds the longest issued capability lifetime by one extra minute)."),
        ]),

        hsection("timestamps_conclusion", "Conclusion", [
            pinformative("Relying on accurate timestamps is a recipe for disaster. Thankfully, Willow doesn’t."),

            pinformative("If you feel like we are missing some vital points or rely on faulty arguments, please ", link("reach out", "mailto:mail@aljoscha-meyer.de,sam@gwil.garden"), "."),
        ]),
    ],
);