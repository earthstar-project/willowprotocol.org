import { R, def, def_fake, r, rs } from "../../../defref.ts";
import { br, code, em, figcaption, figure, img, span } from "../../../h.ts";
import { hsection, table_of_contents } from "../../../hsection.ts";
import { $, $comma } from "../../../katex.ts";
import { marginale, sidenote } from "../../../marginalia.ts";
import { asset } from "../../../out.ts";
import { hl_builtin, Struct } from "../../../pseudocode.ts";
import { pseudocode } from "../../../pseudocode.ts";
import { Expression } from "macro";
import {
blue,
  def_parameter_type,
  def_value,
  ols,
  pinformative,
  purple,
  site_template,
  vermillion,
} from "../../main.ts";

const apo = "’";

export const resource_control: Expression = site_template(
  {
    title: "Resource Management",
    name: "resource_control",
  },
  [
    table_of_contents(7),
    
    pinformative(
      "Many communication protocols operate by sending individual messages or requests over a single, fifo communication channel. If processing a message takes a long time, it makes little sense to wait for the message to be fully processed before accessing the next message from the communication channel. Instead, one usually moves the message elsewhere in memory, freeing up the communication channel and allowing to pop the next message almost immediately. The actual, slow message processing can then be done by another thread or via non-blocking IO.",
    ),

    pinformative(
      "Unfortunately, memory is finite, so there has to be a limit on how many messages can be copied elsewhere. Once that limit is reached, the process can either crash (not good), or it must wait for messages to finish processing, essentially leaving us with the same problem as we started with.",
    ),

    pinformative(
      "In some sense, there is no way around that. However, we would prefer if the communication partner ", em("knew"), " when this was about to happen; it could then throttle its more expensive messages, so that its cheaper messages could still be processed without delay. This is crucial to implementing logically independent communication channels on top of a single physical communication channel.",
    ),

    pinformative(
      "Here, we describe a simple way of maintaining independent message buffers for each logical communication channel. When receiving a message that will take a long time to process, a peers moves it into the message buffer for that kind of messages. This keeps the main communication channel responsive. If a message buffer has insufficient capacity for new messages, the other peer is informed in advance, so that it does not send messages that cannot be buffered.",
    ),

    hsection("resouce_control_requirements", "Requirements", [
      pinformative(
        "To describe our approach more precisely, we need to introduce some terminology. One peer — the ", def({id: "resources_client", singular: "client"}, "client", [
          "The ", def_fake("resources_client", "client"), " is the peer who wishes to send messages to a ", r("resources_server"), " that applies flow control.",
        ]),
        " — sends messages to the other peer — the ", def({ id: "resources_server", singular: "server" }, "server", [
          "The ", def_fake("resources_server", "server"), " is the peer who wishes to apply flow control to the messages it receives.",
        ]), ". Messages belong to ", def({id: "logical_channel", singular: "logical channel"}, "logical communication channels", [
            "A ", def_fake("logical_channel", "logical channel"), " allows application of backpressure to its messages, independent from other ", rs("logical_channel"), " that might be concurrently running over the same physical communication channel.",
          ],
        ), ", and the server maintains a fifo buffer for each ", r("logical_channel"), ". Some messages do not belong to any ", r("logical_channel"), " — those are messages that can always be processed immediately and in negligible time, so they are never moved to any buffer. In particular, our approach adds its own message kinds for exchanging metadata about the buffers. All of these ", def({id: "control_message", singular: "control message"}, "control messages", [
            "A ", def_fake("control_message", "control message"), " is a message that does not belong to any ", r("logical_channel"),".",
          ],
        )," do not belong to any channel — if buffer management required buffer capacity in the first place, things could quickly go wrong.",
      ),

      figure(
        img(asset("resource_control/logical_channels.png")),
        figcaption("Messages being moved from a shared fifo input channel to the buffers of their respective ", rs('logical_channel'), ".")
      ),

      pinformative(
        "We now present some properties we would like our solution to fulfil.",
      ),

      pinformative("The ", r("resources_server"), " should be able to inform the ", r("resources_client"), " about its remaining buffer capacities for its ", rs("logical_channel"), ", and keep these values up to date as it buffers and processes (thus freeing buffer space) messages. The ", r("resources_client"), " should be able to rely on this information: if the ", r("resources_server"), " promises buffer capability, it must deliver."),

      pinformative("The ", r("resources_server"), " should be able to resize its buffers to cope with competing resource demands. Increasing buffer capacity is unproblematic, but we will see that decreasing buffer capacity requires cooperation with the ", r("resources_client"), " in some situations."),

      pinformative("Finally, the ", r("resources_client"), " should be able to optimistically send messages even though their corresponding buffer might be full — by the time the messages arrive at the ", r("resources_server"), ", the buffer space might have become available after all. The ", r("resources_server"), " must be able to reject and drop such optimistically transmitted messages, however. When it does, it must inform the ", r("resources_client"), ", because the ", r("resources_client")," always needs to maintain accurate (if delayed) information about all buffer states."),
    ]),

    hsection("resource_control_overview", "Solution Overview", [
      pinformative(
        "To satisfy these requirements, our solution builds on the concept of ",
        def("guarantee", "guarantees", [
          "A ", def_fake("guarantee"), " constitutes a binding promise that server will be able to buffer messages for a particular ", r("logical_channel"), ". One ", r("guarantee"), " corresponds to one byte of buffer space.",
        ]),
        ". The ", r("resources_server"), " sends ", rs("guarantee"), " of available buffer space to the ", r("resources_client"), " per ", r("logical_channel"), "; the ", r("resources_client"), " tracks its available ", rs("guarantee"), " and knows that all of its messages that do not exceed the ", rs("guarantee"), " will be buffered."
      ),
      
      figure(
        img(asset("resource_control/rc_simplest_case.png")),
        marginale(["This diagram shows the statekeeping for only a single ", r("logical_channel"), ". The full session state consists of an independent copy for every different ", r("logical_channel"), " a protocol defines."]),
        figcaption("Statekeeping for ", r("resources_server"), " and ", r("resources_client"), " when the ", r("resources_client"), " sends a message. The ", r("resources_server"), " tracks for how many unoccupied buffer slots it has not yet issued ", rs("guarantee"), ", the ", r("resources_client"), " tracks how many ", rs("guarantee"), " it has available. Sending a message reduces the guarantees available to the client."),
      ),

      pinformative("When the ", r("resources_server"), " increases a buffer’s capacity, it gives that many ", rs("guarantee"), " (measured in bytes) for the corresponding ", r("logical_channel"), " to the ", r("resources_client"), ". When establishing the connection, the ", r("resources_client"), " has no ", rs("guarantee"), ", and the ", r("resources_server"), " typically starts by sending ", rs("guarantee"), " equal to its initial buffer capacities. Conceptually, the ", r("resources_server"), " begins its operation by increasing its buffer capacities from zero to their actual starting amounts."),
      
      figure(
        img(asset("resource_control/increasing_buffer_capacity.png")),
        figcaption("The ", r("resources_server"), " increases its buffer capacity and then issues as many ", rs("guarantee"), "."),
      ),

      pinformative("The second way of giving ", rs("guarantee"), " occurs when the ", r("resources_server"), " has processed a buffered message and thus frees up buffer space. It then communicates the amount of buffer space that was freed up, and for which ", r("logical_channel"), ". The ", r("resources_server"), " need not communicate this immediately, it is free to send only the occasional update that aggregates ", rs("guarantee"), " that stem from processing several messages from the same ", r("logical_channel"), "."),
      
      figure(
        img(asset("resource_control/processing_messages.png")),
        figcaption("The ", r("resources_server"), " processes a ", vermillion("message"), ", it later processes another ", blue("message"), ", and then decides to issue ", rs("guarantee"), " for the freed buffer slots."),
      ),

      pinformative("When the ", r("resources_server"), " wishes to reduce the capacity of some buffer, it simply processes messages from that buffer without informing the ", r("resources_client"), ". This decreases the overall amount of ", rs("guarantee"), " in the system by the correct amount."),
      
      figure(
        img(asset("resource_control/reducing_capacity.png")),
        figcaption("Processing a message without issuing ", rs("guarantee"), " for it allows the ", r("resources_server"), " to shrink its buffer."),
      ),

      pinformative("This technique is only applicable when the ", r("resources_server"), " has some buffered messages; it does not allow it to reduce buffer capacity for empty buffers. But the ", r("resources_server"), " cannot simply decrease the buffer size and then inform the ", r("resources_client"), ": while that information is travelling to the ", r("resources_client"), ", the ", r("resources_client"), " might send messages on this ", r("logical_channel"), ", fully expecting them to be buffered by the ", r("resources_server"), ". "),

      pinformative(
        "To solve this problem, we introduce a mechanism for the ", r("resources_client"), " to ",
        def("absolution", "absolve", [
          "When the ", r("resources_client"), " ", def_fake("absolution", "absolves"), " the ", r("resources_server"), " of some amount of ", rs("guarantee"), " for some ", r("logical_channel"), ", the ", r("resources_server"), " can act as if it had receives messages that consumed that many ", rs("guarantee"), " on that ", r("logical_channel"), ".",
        ]),
        " the ", r("resources_server"), " of some absolute amount of its unused ", rs("guarantee"), " on some ", r("logical_channel"), ", and we add a way for the ", r("resources_server"), " to ask for such ", r("absolution"), ". Asking for ", r("absolution"), " takes the form of specifying the ", r("logical_channel"), " and the number of ", rs("guarantee"), " the ", r("resources_server"), " would like the ", r("resources_client"), " to keep. Upon receiving this request, the ", r("resources_client"), " ", r("absolution", "absolves"), " the ", r("resources_server"), " of exactly the amount needed to reach the desired number of ", rs("guarantee"), ". If the ", r("resources_client"), " already has fewer ", rs("guarantee"), " by the time the request for ", r("absolution"), " arrives, the ", r("resources_client"), " simply ignores the request.",
      ),

      figure(
        img(asset("resource_control/good_shrinking.png")),
        figcaption("Buffer downscaling without any concurrency issues: the ", r("resources_server"), " asks for ", r("absolution"), ", the ", r("resources_client"), " grants it."),
      ),
      
      figure(
        img(asset("resource_control/complex_shrinking.png")),
        figcaption("Concurrent to the ", r("resources_server"), " asking for ", r("absolution"), ", the ", r("resources_client"), " sends a message. The protocol is designed so that nothing goes wrong."),
      ),

      pinformative(
        "Taken together, these techniques make for a stable system where the ", r("resources_client"), " never overwhelms the buffer capacity of the ", r("resources_server"), ". As a final addition, however, we want to allow the ", r("resources_client"), " to optimistically send data even though it might have no corresponding guarantees. The ", r("resources_server"), " may, after all, have freed up buffer space by the time the optimistically transmitted messages arrive.",
      ),
      
      figure(
        img(asset("resource_control/optimistic_sending.png")),
        figcaption("The ", r("resources_client"), " optimistically sends a message, pushing its available ", rs("guarantee"), " below zero. The ", r("resources_server"), " has buffer space available; it simply buffers the message without taking any special action."),
      ),

      pinformative(
        "If the ", r("resources_server"), " has insufficient buffer capacity when an optimistically transmitted message arrives, the ", r("resources_server"), " drops it without any processing. This requires us to add a certain degree of retransmission logic to the protocol, since the ", r("resources_client"), " must be informed of the message dropping.",
      ),

      pinformative(
        "To keep the complexity of the retransmission logic minimal, we adopt a simplistic solution: when the ", r("resources_server"), " drops an ",
        sidenote("optimistically", [
          "The ", r("resources_server"), " is still ", em("not"), " allowed to drop messages for which it had previously guaranteed buffer capacity."
        ]),
        " transmitted message, it must ", em("keep dropping"), " all messages on the same ", r("logical_channel"), ", until it receives an ",
        def("apology", "apology", [
          "An ", r("apology"), " message is a message from the ", r("resources_client"), " that tells the ", r("resources_server"), " to stop dropping messages on some ", r("logical_channel"), ".",
        ]),
        " message for that ", r("logical_channel"), " from the ", r("resources_client"), ". The ", r("resources_server"), " informs the ", r("resources_client"), " that it has started to drop messages, at which point the ", r("resources_client"), " can send an ", r("apology"), " and can then resume normal operation.",
      ),
      
      figure(
        {class: 'wide'},
        img(asset("resource_control/optimistic_sending_gone_awry.png")),
        figcaption("When the ", r("resources_server"), " receives an optimistic ", vermillion("message"), " it cannot buffer, it drops it and all further messages, even any ", purple("message"), " for which it has sufficient buffer capacity. Only after receiving an ", r("apology"), " does it switch state and become able to accept further messages. The ", r("resources_client"), ", when notified of message dropping, increments its counter of remaining ", rs("guarantee"), " by the number of message bytes that got dropped."),
      ),
      
      pinformative(
        "This approach comes with two subtleties. First, the ", r("resources_server"), " must never buffer partial messages — if it can buffer all but one byte of a message, it must still drop the full message and all subsequent ones until the ", r("apology"), ". Second, the ", r("resources_server"), " must issue ", rs("guarantee"), " for all the optimistic message bytes that it did manage to buffer, before informing the ", r("resources_client"), " that it has started to drop messages. This is necessary so that the ", r("resources_client"), " can reconstruct exactly which of its messages got dropped, and which still made it through.",
      ),

      figure(
        {class: 'wide'},
        img(asset("resource_control/optimistic_sending_gone_really_awry.png")),
        figcaption(
          "Before the ", r("resources_server"), " announces that it is dropping messages, it issues ", rs("guarantee"), " for the optimistic messages bytes it did manage to buffer. The ", r("resources_client"), " maintains a queue of its optimistically transmitted messages, and tracks how many of their bytes it knows to have been processed. When the ", r("resources_client"), " receives ", rs("guarantee"), " for all bytes of a message, it can be ", purple("dequeued"), ".",
          br(),
          "In this example, the ", r("resources_client"), " empties its queue, whereas a realistic implementation would probably keep the queue to (transparently) retransmit all dropped messages before sending new ones. Note further that the ", r("resources_server"), " has to issue a ", r("guarantee"), " before sending the dropping notification, but it would also have been allowed to issue further ", rs("guarantee"), " — a realistic ", r("resources_server"), " would have issued all three issuable ", rs("guarantee"), "."
        ),
      ),
    ]),

    hsection("resources_message_types", "Message Types", [
      pinformative(
        "The following pseudo-types summarise the different kinds of ", rs("control_message"), " that this approach introduces. The parameter ",
        def_parameter_type("C", "C", [
          "The type of different ", rs("logical_channel"), ".",
        ]),
        " is a type with one value for each ", r("logical_channel"), ". Each message pertains to exactly one ", r("logical_channel"), ", specified by its ", code("channel"), " field.",
      ),

      pseudocode(
        new Struct({
          id: "ResourceControlGuarantee",
          name: "IssueGuarantee",
          comment: [
            "The ", r("resources_server"), " makes a binding promise of ", r("ResourceControlGuaranteeAmount"), " many bytes of available buffer capacity to the ", r("resources_client"), ".",
          ],
          fields: [
            {
              id: "ResourceControlGuaranteeAmount",
              name: "amount",
              rhs: r("U64"),
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
          comment: [
            "The ", r("resources_client"), " allows the ", r("resources_server"), " to reduce its total buffer capacity by ", r("ResourceControlAbsolveAmount"), ".",
          ],
          fields: [
            {
              id: "ResourceControlAbsolveAmount",
              name: "amount",
              rhs: r("U64"),
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
          name: "Plead",
          comment: [
            "The ", r("resources_server"), " asks the ", r("resources_client"), " to send an ", r("ResourceControlAbsolve"), " message such that the client’s remaining ", rs("guarantee"), " will be ", r("ResourceControlOopsTarget"), ".",
          ],
          fields: [
            {
              id: "ResourceControlOopsTarget",
              name: "target",
              rhs: r("U64"),
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
          name: "AnnounceDropping",
          comment: [
            "The ", r("resources_server"), " notifies the ", r("resources_client"), " that it has started dropping messages and will continue to do so until it receives an ", r("ResourceControlApology"), " message. The ", r("resources_server"), " must send any outstanding ", rs("guarantee"), " of the ", r("logical_channel"), " before sending a ", r("ResourceControlStartedDropping"), " message.",
          ],
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
          name: "Apologise",
          comment: [
            "The ", r("resources_client"), " notifies the ", r("resources_server"), " that it can stop dropping messages on this ", r("logical_channel"), ".",
          ],
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
      pinformative(
        "In this section, we discuss a common special case of resource control: that of maintaining numeric identifiers for shared context between two peers. For example, a peer might send a large piece of data, give it a numeric identifier, and then reference the data through its identifier rather than repeatedly including the data in future messages.",
      ),

      pinformative(
        "Depositing data like this with the other peer requires them to spend resources (memory), so immediately questions of resource control and throttling arise. We first sketch a lightweight approach to maintaining data handles without considering resource concerns, and then show how to implement that approach on top of ",
        rs("logical_channel"),
        " such that resource concerns are addressed.",
      ),

      hsection("resources_handles_requirements", "Requirements", [
        pinformative(
          "We consider a ",
          def({ id: "handle_client", singular: "client" }, "client", [
            "The ", def_fake("handle_client", "client"), " is the peer who wishes to ", r("handle_bind"), " some data to a ", r("resource_handle"), ".",
          ]),
          " who asks a ",
          def({ id: "handle_server", singular: "server" }, "server", [
            "The ", def_fake("handle_server", "server"), " is the peer who receives requests to ", r("handle_bind"), " some data to a ", r("resource_handle"), ".",
          ]),
          " to ",
          def({ id: "handle_bind", singular: "bind" }),
          " some data of some type to numeric ",
          def(
            { id: "resource_handle", singular: "resource handle" },
            "resource handles",
          ),
          ". The same protocol might use multiple types of data, each with its own independent ",
          def({ id: "handle_type", singular: "handle type" }, "handle types"),
          " (and independent resource control).",
        ),

        pinformative(
          "Since both the ", r("handle_client"), " and the ", r("handle_server"), " must keep track of all ", rs("resource_handle"), ", they should both be able to remove bindings. We call this operation ", def({ id: "handle_free", singular: "free" }, "freeing"), " a ", r("resource_handle"), ".",
        ),

        pinformative(
          "Note that we only discuss ", rs("resource_handle"), " that live during a particular protocol run between two peers. We do not consider the problem of persisting peer-specific state across sessions.",
        ),
      ]),

      hsection("resources_handles_managing", "Managing Resource Handles", [
        pinformative("We use consecutive natural numbers as ", rs("resource_handle"), ". For each ", r("handle_type"), ", both peers keep track of the least number that has not yet been assigned as a ", r("resource_handle", "handle"), " of that ", r("handle_type", "type"), ". In order to ", r("handle_bind"), " a value to a ", r("resource_handle"), ", the ", r("handle_client"), " simply transmits the data and its type. The least number that had not been assigned before becomes the ", r("resource_handle"), " of the transmitted data. Both peers add the new mapping into some data structure they can use to later dereference the ", r("resource_handle"), " into its value."),

        pinformative("The main issue in maintaining ", rs("resource_handle"), " is that of coordinating ", r("handle_free", "freeing"), " over an asynchronous communication channel. Suppose one peer removes a handle-to-value binding from their local mapping, sends a message to inform the other peer, but that peer has concurrently sent some message that pertains to the ", r("resource_handle"), " in question. Everything breaks! Hence, ", r("handle_free", "freeing"), " must be a three-step process:"),

        ols(
          ["one peer sends a message that proposes to ", r("handle_free"), " a ", r("resource_handle"), " (and, in doing so, that peer commits to not referring to that ", r("resource_handle", "handle"), " in any of its future messages),"],
          ["the other peer, upon receiving that proposal, marks the corresponding handle-to-value binding in its local mapping for ", sidenote("deletion", ["We explain below why the binding cannot be deleted immediately."]), " and sends a confirmation message,"],
          ["the first peer, upon receiving the confirmation, can then also mark the handle-to-value binding in its local mapping for deletion."],
        ),

        pinformative("There is no need to use separate message types for proposals and confirmations of ", r("handle_free", "freeing"), ": peers react to a proposal to ", r("handle_free"), " by sending their own proposal to ", r("handle_free"), " the same ", r("resource_handle"), ". Receiving a proposal to ", r("handle_free"), " a ", r("resource_handle"), " after having sent such a proposal oneself confirms that the handle-to-value binding can be removed from the local mapping. A nice side effect of this approach is that it gracefully handles concurrent proposals to ", r("handle_free"), " the same ", r("resource_handle"), " by both peers."),

        pinformative("Why do the peers merely mark mappings for deletion rather than immediately removing them?  Because they might still buffer unprocessed messages for some ", rs("logical_channel"), " that reference the ", r("resource_handle"), " being ", r("handle_free", "freed"), ". To deal with this, a peer can keep a counter with every ", r("resource_handle"), " that gets incremented whenever a message that references the ", r("resource_handle"), " is moved to a buffer. Whenever such a message has been fully processed, the counter is decremented again. The peer locally deletes a binding if it is marked for deletion while its counter is zero, or if its counter reaches zero after it has been marked for deletion."),
      ]),

      hsection("handles_resource_control", "Resource Control", [
        pinformative("Adding handle-to-value bindings to local mappings requires space, so the ", r("handle_server"), " should have a way to throttle the ", r("handle_client"), ". We use a simple solution: for each ", r("handle_type"), ", the messages for ", r("handle_bind", "binding"), " new ", rs("resource_handle"), " are sent over their own ", r("logical_channel"), ". Throttling that ", r("logical_channel"), " controls the number of ", rs("resource_handle"), " that can be created."),

        pinformative("Crucially, ", rs("guarantee"), " for the ", r("logical_channel"), " for issuing ", rs("resource_handle"), " of some ", r("handle_type"), " must guarantee not only that the messages will be buffered, but that they will be processed and the ", rs("resource_handle"), " will be ", r("handle_bind", "bound"), marginale([
          "If bindings are to be stored in a complex data structure with a fragmented memory layout, the server must issue ", rs("guarantee"), " based on conservative approximations of memory usage."
        ]), ". This ensures that the ", r("handle_client"), " knows which ", rs("resource_handle"), " are safe to reference."),

        pinformative("The ", r("handle_client"), " may send optimistic messages on such a ", r("logical_channel"), ". The ", r("handle_client"), " may even reference these optimistically ", r("handle_bind", "bound"), " ", rs("resource_handle"), " in arbitrary other messages. When the ", r("handle_server"), " receives a message that references a ", r("resource_handle"), " that is greater than the greatest ", r("resource_handle"), " it has ", r("handle_bind", "bound"), " of that ", r("handle_type"), ", it must first check whether it has unprocessed messages for ", r("handle_bind", "binding"), " ", rs("resource_handle"), " of this type, and process as many of them as possible."),

        pinformative("If processing those messages ", rs("handle_bind"), " the ", r("resource_handle"), " in question, the ", r("handle_server"), " can then resume processing the optimistic reference to that ", r("resource_handle"), " as if nothing had happened. If, however, it then still has not ", r("handle_bind", "bound"), " the ", r("resource_handle"), " in question, then the message for ", r("handle_bind", "binding"), " the ", r("resource_handle"), " must have been dropped, and the ", r("handle_server"), " has already sent a ", r("ResourceControlStartedDropping"), " message, from which the ", r("handle_client"), " can infer that its optimistic reference to the ", r("resource_handle"), " could not be processed either. The ", r("handle_server"), " then simply drops the message without any further processing."),

      ]),

      hsection("handles_message_types", "Message Types", [
        pinformative("The following pseudo-types summarise the messages for maintaining ", rs("resource_handle"), ". The parameter ", def_parameter_type("H", "H", ["The type of different ", rs("handle_type"), "."]), " is a type with one value for each ", r("handle_type"), ". Each message pertains to exactly one ", r("handle_type"), ", specified by its ", code("handle_type"), " field. ", r("HandleBind"), " messages belong to ", rs("logical_channel"), " determined by their ", code("handle_type"), " field, ", r("HandleFree"), " messages are ", rs("control_message"), " that do not belong to any ", r("logical_channel"), "."),

        pseudocode(
          new Struct({
            id: "HandleBind",
            name: "BindHandle",
            comment: [
              "The ", r("handle_client"), " directs the ", r("handle_server"), " to ", r("handle_bind"), " the next unused numeric ", r("resource_handle"), " to the given value.",
            ],
            fields: [
              {
                id: "HandleBindValue",
                comment: [
                  "An actual protocol probably wants to define dedicated message types for the ", code("Bind"), " messages of every ", r("handle_type"), ", each with their own associated type of values.",
                ],
                name: "value",
                rhs: r("U64"),
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
            name: "FreeHandle",
            comment: [
              "A peer asks the other peer to ", r("handle_free"), " a ", r("resource_handle"), ".",
            ],
            fields: [
              {
                id: "HandleFreeHandle",
                name: "handle",
                rhs: r("U64"),
              },
              {
                id: "HandleFreeMine",
                marginale: ["This is needed for symmetric protocols where peers act as both ", r("handle_client"), " and ", r("handle_server"), " simultaneously and ", r("handle_bind"), " ", rs("resource_handle"), " to the same ", rs("handle_type"), "."],
                comment: [
                  "Indicates whether the peer sending this message is the one who created the ", r("HandleFreeHandle"), " (", code("true"), ") or not (", code("false"), ").",
                ],
                name: "mine",
                rhs: r("Bool"),
              },
              {
                id: "HandleFreeType",
                name: "handle_type",
                rhs: r("H"),
              },
            ],
          }),
        ),
      ]),
      
    ]),
  ],
);
