import { def, def_fake, preview_scope, r, rs } from "../../../defref.ts";
import { code, em, p } from "../../../h.ts";
import { hsection } from "../../../hsection.ts";
import { $, $comma, $dot } from "../../../katex.ts";
import { sidenote } from "../../../marginalia.ts";
import { Struct, hl_builtin } from "../../../pseudocode.ts";
import { pseudocode } from "../../../pseudocode.ts";
import { Expression } from "../../../tsgen.ts";
import { def_parameter, ols, pinformative, site_template } from "../../main.ts";

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
                pinformative("We use consecutive natural numbers as ", rs("resource_handle"), ". For each ", r("handle_type"), ", both peers keep track of the least number that has not yet been assigned as a ", r("resource_handle", "handle"), " of that ", r("handle_type", "type"), ". In order to ", r("handle_bind"), " a value to a ", r("resource_handle"), ", the ", r("handle_client"), " simply transmits the data and its type. The least number that had not been assigned before becomes the ", r("resource_handle"), " of the transmitted data. Both peers add the new mapping into some data structure they can use to later dereference the ", r("resource_handle"), " into its value."),

                pinformative("The main issue in maintaining ", rs("resource_handle"), " is that of coordinating ", r("handle_free", "freeing"), " over an asynchronous communication channel. Suppose one peer removes a handle-to-value binding from their local mapping, sends a message to inform the other peer, but that peer has concurrently sent some message that pertains to the ", r("resource_handle"), " in question. Everything breaks! Hence, ", r("handle_free", "freeing"), " must be a three-step process:"),

                ols(
                    ["one peer sends a message that proposes to ", r("handle_free"), " a ", r("resource_handle"), " (and, in doing so, that peer commits to not referring to that ", r("resource_handle", "handle"), " in any of its future messages),"],
                    ["the other peer, upon receiving that proposal, removes the corresponding handle-to-value binding from its local mapping and sends a confirmation message,"],
                    ["the first peer, upon receiving the confirmation, removes the handle-to-value binding from its local mapping."],
                ),

                pinformative("There is no need to use separate message types for proposals and confirmations of ", r("handle_free", "freeing"), ": peers react to a proposal to ", r("handle_free"), " by sending their own proposal to ", r("handle_free"), " the same ", r("resource_handle"), ". Receiving a proposal to ", r("handle_free"), " a ", r("resource_handle"), " after having sent such a proposal oneself confirms that the handle-to-value binding can be removed from the local mapping. A nice side effect of this approach is that it gracefully handles concurrent proposals to ", r("handle_free"), " the same ", r("resource_handle"), " by both peers."),
            ]),

            hsection("handles_resource_control", "Resource Control", [
                pinformative("Adding handle-to-value bindings to local mappings requires space, so the ", r("handle_server"), " should have a way to throttle the ", r("handle_client"), ". We use a (superficially) simple solution: for each ", r("handle_type"), ", the messages for ", r("handle_bind", "binding"), " new ", rs("resource_handle"), " are sent over their own ", r("logical_channel"), ". Throttling that ", r("logical_channel"), " controls the number of ", rs("resource_handle"), " that can be created."),

                pinformative("Receiving a message that ", r("handle_bind", "binds"), " a ", r("resource_handle"), " and moving this message to a message buffer does not mean that the ", r("resource_handle"), " has actually been ", r("handle_bind", "bound"), ". In fact, there might not be enough memory available to ", r("handle_bind"), " the ", r("resource_handle"), ", so the message has to sit in the message buffer, unprocessed. The ", r("handle_server"), " should strive to allocate buffer space only for messages whose ", rs("resource_handle"), " can be ", r("handle_bind", "bound"), " immediately, but this might not always be possible."),

                pinformative("For this reason, the ", r("handle_server"), " sends a ", def({id: "handle_confirmation", singular: "confirmation"}, "confirmation", ["A ", def_fake("handle_confirmation", "confirmation"), " message lets the ", r("handle_server"), " notify the ", r("handle_client"), " that some ", rs("resource_handle"), " were successfully ", r("handle_bind", "bound"), "."]), " whenever it actually ", r("handle_bind", "binds"), " a ", r("resource_handle"), ". Several such ", rs("handle_confirmation"), " for ", rs("resource_handle"), " of the same ", r("handle_type"), " can be aggregated into a single ", r("handle_confirmation"), " message that specifies the ", r("handle_type"), " in question and the number of ", r("handle_bind", "bound"), " ", rs("resource_handle"), ". After receiving a ", r("handle_confirmation"), ", the ", r("handle_client"), " knows it is safe to refer to the ", r("resource_handle", "resource handle(s)"), " in future messages."),

                pinformative("If the ", r("handle_client"), " always had to wait for ", r("handle_confirmation"), " before using a ", r("resource_handle"), " in future messages, this would introduce additional latency. Hence, we allow ", rs("handle_client"), " to send messages that refer to ", rs("resource_handle"), " optimistically, before the ", rs("resource_handle"), " have been confirmed. This requires us to introduce another retransmission mechanism: When the ", r("handle_server"), " receives a message referring to a ", r("resource_handle"), " that it has not yet ", r("handle_bind", "bound"), ", it must drop this message and all future messages that refer to this ", r("resource_handle"), " or any newer ", rs("resource_handle", "handles"), " of the same ", r("handle_type", "type"), ", until it receives an ", def({id: "handle_apology", singular: "apology", plural: "apologies"}, "apology", ["An ", def_fake("handle_apology", "apology"), " message from the ", r("handle_client"), " informs the ", r("handle_server"), " to stop dropping messages containing ", rs("resource_handle"), " greater than and of the same ", r("handle_type", "type"), " as the ", r("resource_handle"), " specified in the ", r("handle_apology"), "."]), " message for this ", r("handle_type"), ". It must also inform the ", r("handle_client"), " that it has started to drop messages for this ", r("handle_type"), ", and this message includes the numeric ", r("resource_handle", "handle"), " that caused the dropping."),

                pinformative("While dropping messages that contain ", rs("resource_handle"), " that are too large, the ", r("handle_server"), " still continues to process messages that contain smaller ", rs("resource_handle", "handles"), " of the same ", r("handle_type"), ". If such a message contains a ", em("smaller"), " ", r("resource_handle"), " that is ", em("also"), " unassigned, the ", r("handle_server"), " simply notifies the ", r("handle_client"), " again. The ", r("handle_apology"), " messages the ", r("handle_client"), " sends contain the ", r("resource_handle"), " they refer to; the ", r("handle_server"), " only accepts an ", r("handle_apology"), " for the smallest ", r("resource_handle"), " (per ", r("handle_type"), ") it has warned the ", r("handle_client"), " about. Such an ", r("handle_apology"), " then makes the ", r("handle_server"), " process ", em("all"), " messages with ", r("resource_handle", "handles"), " of the ", r("handle_type", "type"), " in question again."),
            ]),

            hsection("handles_message_types", "Message Types", [
                pinformative("The following pseudo-type summarizes the messages for maintaining ", rs("resource_handle"), ". The parameter ", def_parameter("H", "H", ["The type of different ", rs("handle_type"), "."]), " is a type with one value for each ", r("handle_type"), ". Each message pertains to exactly one ", r("handle_type"), ", specified by its ", code("hande_type"), " field. ", r("HandleBind"), " messages belong to ", rs("logical_channel"), " determined by their ", code("handle_type"), " field, all other messages are ", rs("control_message"), " that do not belong to any ", r("logical_channel"), "."),

                pseudocode(
                    new Struct({
                        id: "HandleBind",
                        name: "Bind",
                        comment: ["The ", r("handle_client"), " directs the ", r("handle_server"), " to ", r("handle_bind"), " the next unused numeric ", r("resource_handle"), " to the given value."],
                        fields: [
                            {
                                id: "HandleBindValue",
                                comment: ["An actual protocol probably wants to define dedicated message type for the ", code("Bind"), " messages of every ", r("handle_type"), ", each with their own  associated type of values."],
                                name: "value",
                                rhs: hl_builtin("u64"),
                            },
                            {
                                id: "HandleBindType",
                                name: "handle_type",
                                rhs: r("H"),
                            },
                        ],
                    }),

                    new Struct({
                        id: "HandleFree",
                        name: "Free",
                        comment: ["A peer asks the other peer to ", r("handle_free"), " a ", r("resource_handle"), "."],
                        fields: [
                            {
                                id: "HandleFreeHandle",
                                name: "handle",
                                rhs: hl_builtin("u64"),
                            },
                            {
                                id: "HandleFreeMine",
                                comment: ["Indicates whether the peer sending this message is the one who created the ", r("HandleFreeHandle"), "(", code("true"), ") or not (", code("false"), "). This is needed for symmetric protocols where peers act as both ", r("handle_client"), " and ", r("handle_server"), " simultaneously and ", r("handle_bind"), " ", rs("resource_handle"), " to the same ", rs("handle_type"), "."],
                                name: "mine",
                                rhs: hl_builtin("bool"),
                            },
                            {
                                id: "HandleFreeType",
                                name: "handle_type",
                                rhs: r("H"),
                            },
                        ],
                    }),

                    new Struct({
                        id: "HandleConfirm",
                        name: "Confirm",
                        comment: ["The ", r("handle_server"), " confirms that it has successfully processed the ", r("HandleConfirmNumber"), " oldest ", r("HandleBind"), " messages with ", r("handle_type"), " ", r("HandleConfirmType"), " it received."],
                        fields: [
                            {
                                id: "HandleConfirmNumber",
                                name: "number",
                                rhs: hl_builtin("u64"),
                            },
                            {
                                id: "HandleConfirmType",
                                name: "handle_type",
                                rhs: r("H"),
                            },
                        ],
                    }),

                    new Struct({
                        id: "HandleStartedDropping",
                        name: "StartedDropping",
                        comment: ["The ", r("handle_server"), " notifies the ", r("handle_client"), " that it has started dropping messages that refer to ", rs("resource_handle"), " greater than or equal to ", r("HandleStartedDroppingAt"), " and will continue to do so until it receives an ", r("HandleApology"), " message."],
                        fields: [
                            {
                                id: "HandleStartedDroppingAt",
                                name: "at",
                                rhs: hl_builtin("u64"),
                            },
                            {
                                id: "HandleStartedDroppingType",
                                name: "handle_type",
                                rhs: r("H"),
                            },
                        ],
                    }),

                    new Struct({
                        id: "HandleApology",
                        name: "Apology",
                        comment: ["The ", r("handle_client"), " notifies the ", r("handle_server"), " that it can stop dropping messages that refer to ", rs("resource_handle"), " greater than or equal to ", r("HandleApologyAt"), ". Note that the ", r("handle_server"), " will only accept ", rs("handle_apology"), " for the least ", r("resource_handle"), " (of ", r("handle_type"), " ", r("HandleApologyType"), ") for which it has sent a ", r("HandleStartedDropping"), " message."],
                        fields: [
                            {
                                id: "HandleApologyAt",
                                name: "at",
                                rhs: hl_builtin("u64"),
                            },
                            {
                                id: "HandleApologyType",
                                name: "handle_type",
                                rhs: r("H"),
                            },
                        ],
                    }),
                ),
            ]),

            hsection("delta_handles", "Delta Handles", [
                pinformative("When encoding ", rs("resource_handle"), " as part of a message, we can do better than simply encoding their numeric values. After a ", r("resource_handle"), " has been ", r("handle_free", "freed"), ", we know that its value will never be communicated again. Instead of transmitting actual numeric values, we can instead transmit the difference between the numeric value and the numeric value of the oldest ", r("resource_handle"), " that has not yet been ", r("handle_free", "freed"), ". This way, we transmit smaller numbers, which can be encoded more efficiently. More precisely:"),

                pinformative("Let ", $("h"), " be a ", r("resource_handle"), " (that is, a natural number between zero and ", $("2^{64} - 1", ")"), ". The ", def({id: "delta_handle", singular: "delta handle"}), " of ", $("h"), " is ", $comma("h - l"), " where ", $("l"), " is the numerically least ", r("resource_handle"), " of the same ", r("handle_type"), " and ", r("handle_bind", "bound"), " by the same peer as ", $("h"), " for which the peer who is determining the ", r("delta_handle"), " has not yet sent a ", r("HandleFree"), " message."),
            ]),
        ]),
    ],
);
