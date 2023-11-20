import { def, def_fake, preview_scope, r, rs } from "../../../defref.ts";
import { code, em, p } from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { sidenote } from "../../../marginalia.ts";
import { Struct, hl_builtin } from "../../../pseudocode.ts";
import { pseudocode } from "../../../pseudocode.ts";
import { Expression } from "../../../tsgen.ts";
import { def_parameter, pinformative, site_template } from "../../main.ts";

export const resource_control: Expression = site_template(
    {
        title: "Resource Management",
        name: "resource_control",
    },
    [
        pinformative("Many communication protocols operate by sending individual messages or requests over a single, fifo communication channel. If processing a message takes a long time, it makes little sense to wait for the message to be fully processed before accessing the next message from the communication channel. Instead, one usually moves the message elsewhere in memory, freeing up the communication channel and allowing to pop the next message almost immediately. The actual, slow message processing can then be done by another thread or via non-blocking IO."),

        pinformative("Unfortunately, memory is finite, so there has to be a limit on how many messages can be copied elsewhere. Once that limit is reached, the process can either crash (not good), or it must wait for messages to finish processing, essentially leaving us with the same problem as we started with."),

        pinformative("In some sense, there's no way around that. However, we would prefer if the communication partner ", em("knew"), " when this was about to happen; it could then throttle its more expensive messages, so that its cheaper messages could still be processed without delay. This is crucial to implementing logically independent communication channels on top of a single physical communication channel."),

        pinformative("Here, we describe a simple way of maintaining independent message buffers for each logical communication channel. When receiving a message that will take a long time to process, a peers moves it into the message buffer for that kind of messages. This keeps the main communication channel responsive. If a message buffer has insufficient capacity for new messages, the other peer is informed in advance so that it does not send messages that cannot be buffered."),

        hsection("resouce_control_requirements", "Requirements", [
            pinformative("To describe our approach more precisely, we need to introduce some terminology. One peer — the ", def({id: "resources_client", singular: "client"}, "client", ["The ", def_fake("resources_client", "client"), " is the peer who wishes to send messages to a ", r("resources_server"), " that applies flow control."]), " — sends messages to the other peer — the ", def({id: "resources_server", singular: "server"}, "server", ["The ", def_fake("resources_server", "server"), " is the peer who wishes to apply flow control to the messages it receives."]), ". Messages belong to ", def({id: "logical_channel", singular: "logical channel"}, "logical communication channels", ["A ", def_fake("logical_channel", "logical channel"), " allows application of backpressure to its messages, independent from other ", rs("logical_channel"), " that might be concurrently running over the same physical communication channel."]), ", and the server maintains a fifo buffer for each ", r("logical_channel"), ". Some messages do not belong to any ", r("logical_channel"), " — those are messages that can always be processed immediately and in negligible time, so they are never moved to any buffer. In particular, our approach adds its own message kinds for exchanging metadata about the buffers. All of these ", def({id: "control_message", singular: "control message"}, "control messages", ["A ", def_fake("control_message", "control message"), " is a message that does not belong to any ", r("logical_channel"), "."]), " do not belong to any channel — if buffer management required buffer capacity in the first place, things could quickly go wrong."),

            pinformative("We now present some properties we would like our solution to fullfil."),

            pinformative("The ", r("resources_server"), " should be able to inform the ", r("resources_client"), " about its remaining buffer capacities for its ", rs("logical_channel"), ", and keep these values up to date as it buffers and processes (thus freeing buffer space) messages. The ", r("resources_client"), " should be able to rely on this information: if the ", r("resources_server"), " promises buffer capability, it must deliver."),

            pinformative("The ", r("resources_server"), " should be able to resize its buffers to cope with competing resource demands. Increasing buffer capacity is unproblematic, but we will see that decreasing buffer capacity requires cooperation with the ", r("resources_client"), " in some situations."),

            pinformative("Finally, the ", r("resources_client"), " should be able to optimistically send messages even though their corresponding buffer might be full — by the time the messages arrive at the ", r("resources_server"), ", the buffer space might have become available after all. The ", r("resources_server"), " must be able to reject and drop such optimistically transmitted messages, however. When it does, it must inform the ", r("resources_client"), ", because the ", r("resources_client"), " always needs to maintain accurate (if delayed) information about all buffer states."),
        ]),

        hsection("resource_control_overview", "Solution Overview", [
            pinformative("To satisfy these requirements, our solution builds on the concept of ", def("guarantee", "guarantees", ["A ", def_fake("guarantee"), " constitutes a binding promise that server will be able to buffer messages for a particular ", r("logical_channel"), ". One ", r("guarantee"), " corresponds to one byte of buffer space."]), ". The ", r("resources_server"), " sends ", rs("guarantee"), " of available buffer space to the ", r("resources_client"), " per ", r("logical_channel"), "; the ", r("resources_client"), " tracks its available ", rs("guarantee"), " and knows that all of its messages that do not exceed the ", rs("guarantee"), " will be buffered."),

            pinformative("When the ", r("resources_server"), " increases a buffer's capacity, it gives that many ", rs("guarantee"), " (measured in bytes) for the corresponding ", r("logical_channel"), " to the ", r("resources_client"), ". When establishing the connection, the ", r("resources_client"), " has no ", rs("guarantee"), ", and the ", r("resources_server"), " typically starts by sending ", rs("guarantee"), " equal to its initial buffer capacities. Conceptually, the ", r("resources_server"), " begins its operation by increasing its buffer capacities from zero to their actual starting amounts."),

            pinformative("The second way of giving ", rs("guarantee"), " occurs when the ", r("resources_server"), " has processed a buffered message and thus frees up buffer space. It then communicates the amount of buffer space that was freed up, and for which ", r("logical_channel"), ". The ", r("resources_server"), " need not communicate this immediately, it is free to send only the occasional update that aggregates ", rs("guarantee"), " that stem from processing several messages from the same ", r("logical_channel"), "."),

            pinformative("When the ", r("resources_server"), " wishes to reduce the capacity of some buffer, it simply processes messages from that buffer without informing the ", r("resources_client"), ". This decreases the overall amount of ", rs("guarantee"), " in the system by the correct amount."),

            pinformative("This technique is only applicable when the ", r("resources_server"), " has some buffered messages; it does not allow it to reduce buffer capacity for empty buffers. But the ", r("resources_server"), " cannot simply decrease the buffer size and then inform the ", r("resources_client"), ": while that information is traveling to the ", r("resources_server"), ", the ", r("resources_client"), " might send messages on this ", r("logical_channel"), ", fully expecting them to be buffered by the ", r("resources_server"), ". "),

            pinformative("To solve this problem, we introduce a mechanism for the ", r("resources_client"), " to ", def("absolution", "absolve", ["When the ", r("resources_client"), " ", def_fake("absolution", "absolves"), " the ", r("resources_server"), " of some amount of ", rs("guarantee"), " for some ", r("logical_channel"), ", the ", r("resources_server"), " can act as if it had receives messages that consumed that many ", rs("guarantee"), " on that ", r("logical_channel"), "."]), " the ", r("resources_server"), " of some absolute amount of its unused ", rs("guarantee"), " on some ", r("logical_channel"), ", and we add a way for the ", r("resources_server"), " to ask for such ", r("absolution"), ". Asking for ", r("absolution"), " takes the form of specifying the ", r("logical_channel"), " and the new buffer size the ", r("resources_server"), " would like to set. Upon receiving this request, the ", r("resources_client"), " ", r("absolution", "absolves"), " the ", r("resources_server"), " of exactly the amount needed to reach the desired size."),

            pinformative("Taken together, these techniques make for a stable system where the ", r("resources_client"), " never overwhelms the buffer capacity of the ", r("resources_server"), ". As a final addition, however, we want to give the ability to optimistically send data, at the risk of overwhelming the ", r("resources_server"), ". To allow this, the ", r("resources_server"), " must be able to drop optimistically sent messages without processing them. This requires us to add a certain degree of retransmission logic to the protocol, since the ", r("resources_client"), " must be informed of the message dropping."),

            pinformative("To keep the complexity of the retransmission logic minimal, we adopt a very simple solution: when the ", r("resources_server"), " drops an optimistically transmitted message (it is still ", em("not"), " allowed to drop messages for which it had previously guaranteed buffer capacity), it must ", em("keep dropping"), " all messages on the same ", r("logical_channel"), ", until it receives an ", def("apology", "apology", ["An ", r("apology"), " message is a message from the ", r("resources_client"), " that tells the ", r("resources_server"), " to stop dropping messages on some ", r("logical_channel"), "."]), " message for that ", r("logical_channel"), " from the ", r("resources_client"), ". The ", r("resources_server"), " informs the ", r("resources_client"), " that it has started to drop messages, at which point the ", r("resources_client"), " can send an ", r("apology"), " and can then resume normal operation."),

            pinformative("This approach comes with two subtleties. First, the ", r("resources_server"), " must never buffer partial messages — if it can buffer all but one byte of a message, it must still drop the full message and all subsequent ones until the ", r("apology"), ". Second, the ", r("resources_server"), " must issue any ", rs("guarantee"), " for all the messages that it did manage to process before informing the ", r("resources_client"), " that it has started to drop messages. This is necessary so that the ", r("resources_client"), " can reconstruct exactly which of its messages got dropped. "),

            pinformative("An example: Suppose the ", r("resources_server"), " has issued ", rs("guarantee"), " for 100 bytes of buffer capacity, and the ", r("resources_client"), " has sent 80 bytes worth of messages. The ", r("resources_client"), " now decides to send 60 bytes more. While these messages travel through the network, the ", r("resources_server"), " processes 7 bytes, but decides not to give the corresponding seven ", rs("guarantee"), " to the ", r("resources_client"), " yet. Now the 60 bytes arrive at the ", r("resources_server"), ", while the ", r("resources_server"), " has 27 bytes of free buffer capacity. So the ", r("resources_server"), " buffers 27 bytes and drops the remaining 33 ", sidenote("bytes", ["For simplicity, we assume that there just happens to be a message boundary there."]), ". If its next message was to inform the ", r("resources_client"), " that it started dropping, the ", r("resources_client"), " would believe that only its first 20 bytes of the second batch got buffered, not the first 27. This is why the ", r("resources_server"), " must first issue ", rs("guarantee"), " for the seven bytes it had successfully processed before notifying the ", r("resources_client"), " that it started dropping."),
        ]),

        hsection("resources_message_types", "Message Types", [
            pinformative("The following pseudo-type summarizes the different kinds of ", rs("control_message"), " that this approach introduces. The parameter ", def_parameter("C", "C", ["The type of different ", rs("logical_channel"), "."]), " is a type with one value for each ", r("logical_channel"), ". Each message pertains to exactly one ", r("logical_channel"), ", specified by its ", code("channel"), " field."),

            pseudocode(
                new Struct({
                    id: "ResourceControlGuarantee",
                    name: "Guarantee",
                    comment: ["The ", r("resources_server"), " makes a binding promise of available buffer capacity to the ", r("resources_client"), "."],
                    fields: [
                        {
                            id: "ResourceControlGuaranteeAmount",
                            name: "amount",
                            // comment: ["A number of bytes the ", r("resources_server"), " promises to be able to buffer."],
                            rhs: hl_builtin("u64"),
                        },
                        {
                            id: "ResourceControlGuaranteeChannel",
                            name: "channel",
                            rhs: r("C"),
                        },
                    ],
                }),

                new Struct({
                    id: "ResourceControlAbsolve",
                    name: "Absolve",
                    comment: ["The ", r("resources_client"), " allows the ", r("resources_server"), " to reduce its total buffer capacity by ", r("ResourceControlAbsolveAmount"), "."],
                    fields: [
                        {
                            id: "ResourceControlAbsolveAmount",
                            name: "amount",
                            rhs: hl_builtin("u64"),
                        },
                        {
                            id: "ResourceControlAbsolveChannel",
                            name: "channel",
                            rhs: r("C"),
                        },
                    ],
                }),

                new Struct({
                    id: "ResourceControlOops",
                    name: "Oops",
                    comment: ["The ", r("resources_server"), " asks the ", r("resources_client"), " to send an ", r("ResourceControlAbsolve"), " message such that the remaining buffer capacity will be ", r("ResourceControlOopsTarget"), "."],
                    fields: [
                        {
                            id: "ResourceControlOopsTarget",
                            name: "target",
                            rhs: hl_builtin("u64"),
                        },
                        {
                            id: "ResourceControlOopsChannel",
                            name: "channel",
                            rhs: r("C"),
                        },
                    ],
                }),

                new Struct({
                    id: "ResourceControlStartedDropping",
                    name: "StartedDropping",
                    comment: ["The ", r("resources_server"), " notifies the ", r("resources_client"), " that it has started dropping messages and will continue to do so until it receives an ", r("ResourceControlApology"), " message. Note that the ", r("resources_server"), " must send any outstanding ", rs("guarantee"), " of the ", r("logical_channel"), " before sending a ", r("ResourceControlStartedDropping"), " message."],
                    fields: [
                        {
                            id: "ResourceControlStartedDroppingChannel",
                            name: "channel",
                            rhs: r("C"),
                        },
                    ],
                }),

                new Struct({
                    id: "ResourceControlApology",
                    name: "Apology",
                    comment: ["The ", r("resources_client"), " notifies the ", r("resources_server"), " that it can stop dropping messages of this ", r("logical_channel"), "."],
                    fields: [
                        {
                            id: "ResourceControlApologyChannel",
                            name: "channel",
                            rhs: r("C"),
                        },
                    ],
                }),
            ),
        ]),

        hsection("resources_data_handles", "Data Handles", [
            pinformative("In this section, we discuss a common special case of resource control: that of maintaining numeric identifiers for shared context between two peers. For example, a peer might send a large piece of data, give it a numeric identifier, and then reference the data through its identifier rather than repeatedly including the data in future messages."),

            pinformative("Depositing data like this with the other peer requires them to spend resources (memory), so immediately questions of resource control and throttling arise. We first sketch a lightweight approach to maintaining data handles without considering resource concerns, and then show how to implement that approach on top of ", rs("logical_channel"), " such that resource concerns are addressed."),

            hsection("resources_handles_requirements", "Requirements", [
                pinformative("We consider a ", def({id: "handle_client", singular: "client"}, "client", ["The ", def_fake("handle_client", "client"), " is the peer who wishes to ", r("handle_bind"), " some data to a ", r("resource_handle"), "."]), " who asks a ", def({id: "handle_server", singular: "server"}, "server", ["The ", def_fake("handle_server", "server"), " is the peer who receives requests to ", r("handle_bind"), " some data to a ", r("resource_handle"), "."]), " to ", def({ id: "handle_bind", singular: "bind"}), " some data of some type to numeric ", def({id: "resource_handle", singular: "resource handle"}, "resource handles"), ". The same protocol might use multiple types of data, each with its own independent ", def({ id: "handle_type", singular: "handle type"}, "handle types"), " (and independent resource control)."),

                pinformative("Since both the ", r("handle_client"), " and the ", r("handle_server"), " must keep track of all ", rs("resource_handle"), ", they should both be able to remove a binding. We call this operation ", def({ id: "handle_free", singular: "free"}, "freeing"), " a ", r("resource_handle"), "."),

                pinformative("Note that we only discuss ", rs("resource_handle"), " that live during a particular protocol run between two peers. We do not consider the setting of persisting peer-specific state across sessions."),
            ]),

            hsection("resources_handles_managing", "Managing Resource Handles", [

            ]),
        ]),
        
        p("wip"),
    ],
);

// We use consecutive natural numbers as handles. For each type of handle, both peers keep track of the least number that has not been assigned as a handle of that type yet. In order to bind a value to handle, the client simply transmits the data and its type. The least number that had not been assigned before becomes the handle of the transmitted data. Both peers add the new mapping into some data structure they can use to later dereference the handle into its value.

// The main issue in maintaining handles is that of coordinating freeing over an asynchronous communication channel. Suppose one peer removes a binding from their local mapping, sends a message to inform the other peer, but that peer has concurrently sent some message that pertains to the handle. Everything breaks! Hence, freeing must be a three-step process:

// 1. one peer sends a message that proposes to free an identifier (and, in doing so, that peer commits to not referring to that id in any of its future messages),
// 2. the other peer, upon receiving that proposal, removes the corresponding entry from its local mapping and sends a confirmation message,
// 3. the first peer, upon receiving the confirmation, removes the entry from its local mapping.

// There is no need to use separate message types for proposals and confirmations of freeing: peers react to a proposal to free by sending their own proposal to fere the same handle. Receiving a proposal to free a handle after having sent such a proposal oneself confirms that the entry can be removed from the local mapping. A nice side effect of this approach is that it gracefully handles concurrent proposals to free the same binding by both peers.

// ### Resource Control

// Adding bindings to local mappings requires space (whether in main memory or on secondary storage), so the server should have a way to throttle the client. We use a (superficially) simple solution: for each type of handle, the messages for binding new ones are sent over their own logical channel. Throttling that channel controls the amount of bindings that can be created.

// Receiving a message that creates a binding and moving it to a message buffer does not mean however that the binding has actually been created. In fact, that might not be enough memory available to create the binding, so the message has to sit in the message buffer, unprocessed. The server should strive to allocate buffer space only for messages whose bindings can be created immediately. But this might not always be possible.

// For this reason, the servers sends a confirmation whenever it actually adds a binding. Several such confirmations for bindings of the same type can be aggregated into a single confirmation message that specifies the type in question and the number of added bindings. After receiving a confirmation, the client knows it is safe to use a binding in future messages.

// If the client always had to wait for confirmation before using a binding in a future message, this would introduce additional latency. Hence, we allow clients to send messages that refer to bindings optimistically, before the binding has been confirmed. This requires us to introduce another retransmission mechanism: When the server receives a message referring to a binding that it has not yet created, it must drop this message and all future messages that refer to this binding or any newer bindings of the same type, until it receives an *apology message* for this type of binding. It must also inform the client that it has started to drop messages for this type of binding, and this message includes the numeric handle that caused the dropping.

// While dropping messages that contain handles that are too large, the server still continues to process messages that contain smaller handles of the same type. If such a message contains a smaller handle that is also unassigned, the server simply notifies the client again. The apology messages the client sends contain the handle they refer to; the server only accepts an apology for the smallest handle it has warned the client about. Such an apology then makes the server process *all* messages with handles of the type in question again.

// ### Message Types

// The following pseudo-type summarizes the different kinds of messages that this approach introduces. The parameter `T` is a type with one value for each handle type. Each message pertains to exactly one handle type, specified by its `handle_type` field. `Bind` messages belong to logical channels determined by their `handle_type` field, all other messages are control messages that do not belong to any logical channel.

// ```rust
// enum Message<T /* the type of different handle types */> {
//     // The client directs the server to bind the next unused numeric handle to the given Value.
//     Bind {
//         handle_type: T,
//         value: SomeValue, // You'd probably define a dedicated message type for the binding messages of every handle type, with its own associated type of data
//     },
//     // A peer asks the other peer to free a handle.
//     Free {
//         handle: u64,
//         mine: bool, // true if the peer sending this message is the one who created the binding, false otherwise. This is needed for symmetric protocols where both peers act as both client and server and issue handles to the same types of resources.
//         handle_type: T,
//     },
//     // The server confirms that it has successfully processed the `number` oldest `Bind` messages`.
//     Confirmation {
//         number: u64,
//         handle_type: T,
//     },
//     // The server notifies the client that it has started dropping messages that refer to handles greater than or equal to `at` and will continue to do so until it receives an `Apology` message.
//     StartedDropping {
//         at: u64,
//         handle_type: T,
//     },
//     // The client notifies the server that it can stop dropping messages that refer to handles greater than or equal to `at`. Note that the server will only accept apologies for the least handle (of the hadle type in question) for which it has sent a `StartedDropping` request.
//     Apology {
//         at: u64,
//         handle_type: T,
//     },
// }
// ```
