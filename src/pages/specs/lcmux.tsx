import { Dir, File } from "macromania-outfs";
import { C64Standalone, RawBytes, ValAccess } from "../../encoding_macros.tsx";
import {
  bitfieldConstant,
  C64Encoding,
  c64Tag,
  Encoding,
  EncodingRelationTemplate,
  MinTags,
  ValName,
} from "../../encoding_macros.tsx";
import {
  AE,
  Alj,
  Blue,
  Curly,
  Gwil,
  NoWrap,
  Orange,
  Path,
  Purple,
  Quotes,
  SkyBlue,
  Vermillion,
} from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import {
  A,
  B,
  Br,
  Code,
  Em,
  Figcaption,
  Figure,
  Hr,
  I,
  Img,
  Li,
  P,
  Ul,
} from "macromania-html";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs, Rsb } from "macromania-defref";
import { PreviewScope } from "macromania-previews";
import { ResolveAsset } from "macromania-assets";
import { M } from "macromania-katex";
import { Loc, Pseudocode } from "macromania-pseudocode";
import { DefVariant, SliceType, StructDef } from "macromania-rustic";
import { StylesheetDependency } from "macromania-html-utils";

export const lcmux = (
  <Dir name="lcmux">
    <File name="index.html">
      <PageTemplate
        htmlTitle="LCMUX"
        headingId="lcmux"
        heading={"LCMUX"}
        status="proposal"
        statusDate="24.01.2025"
        toc
      >
        <StylesheetDependency dep={["lcmux", "icon_defs.css"]} />
        <P>
          LCMUX (<B>L</B>ogical <B>C</B>hannel{" "}
          <B>Mu</B>ltiple<B>x</B>ing) is a transport protocol to allow
          transmitting several, logically independent streams of data over a
          single, reliable underlying data stream.
        </P>

        <P>
          There exist several multiplexing protocols with this goal already, as
          well as countless of their higher-level cousins, the{" "}
          <AE href="https://en.wikipedia.org/wiki/Remote_procedure_call">
            RPC protocols
          </AE>. Most of these tag messages with ids to distinguish which
          logical data stream the messages belong to, and call it a day. We
          argue that this mostly misses the point.
        </P>

        <P>
          The difficult part is not to partition messages into disjoint streams;
          the difficult part is to ensure <Em>independent</Em>{" "}
          processing of those streams on a <Em>shared</Em>{" "}
          pool of resources (network, CPU-time, main memory). Multiplexed
          streams must remain logically{" "}
          <Sidenote
            note={
              <>
                Giving a precise notion of <I>logical independence</I>{" "}
                is difficult, but intuitively, traffic on some data stream
                should neither cause unbounded delays nor dropping of messages
                on another data stream.
              </>
            }
          >
            independent
          </Sidenote>{" "}
          despite their competition for limited physical resources. Hence, the
          design of LCMUX starts from considerations of resource management.
        </P>

        <Hsection n="mux_and_resources" title="Multiplexing and Resources">
          <P>
            Suppose we want to send many individual messages or requests over a
            single, fifo communication channel. If processing a message takes a
            long time, it makes little sense to wait for the message to be fully
            processed before accessing the next message from the communication
            channel — especially if the next message can (or{" "}
            <Em>must</Em>) be processed independently from the first one.
            Instead, one usually moves the first message elsewhere in
            memory,<Marginale>
              This trades time usage for space usage. Time is dynamic and
              ephemeral, whereas space is comparatively static and reusable.
              This simplification is what makes the approach we describe here
              feasible.
            </Marginale>{" "}
            freeing up the communication channel and allowing to pop the next
            message almost immediately. The actual, slow message processing can
            then be done by another thread or via non-blocking IO.
          </P>

          <P>
            Unfortunately, memory is finite, there is a limit on how many
            messages can be copied elsewhere. Leaving messages in the buffer of
            the underlying communication channel would induce delays on
            processing independent successive messages. Crashing the process
            would also affect the processing of independent successive messages.
            The only acceptable solution is to drop messages that cannot be
            moved to a buffer.
          </P>

          <P>
            Since we must allow a receiver to drop incoming messages, the
            receiver must inform the sender which messages got processed, and
            which got dropped. A sender can adjust its rate of sending according
            to that feedback. Sound familiar? We are reinventing{" "}
            <AE href="https://en.wikipedia.org/wiki/Transmission_Control_Protocol">
              TCP
            </AE>{" "}
            from first{" "}
            <Sidenote
              note={
                <>
                  And any multiplexing protocol which doesn't reinvent TCP
                  should have good, explicitly documented reasons.
                </>
              }
            >
              principles
            </Sidenote>.
          </P>

          <P>
            Transmitting a message only to have it dropped by the receiver is
            rather{" "}
            <Sidenote
              note={
                <>
                  Spending bandwidth on a message that gets ignored on delivery
                  is obviously wasteful. Less obviously, the sender must devote
                  computational resources to the contingency that every message
                  it sends might be dropped (for example, a retransmission
                  buffer).
                </>
              }
            >
              inefficient
            </Sidenote>. LCMUX goes beyond what TCP can do by allowing the
            receiver to communicate how much buffer space it has left, acting as
            a promise that as many bytes of messages will not be{" "}
            <Sidenote
              note={
                <>
                  Moving this concept to TCP would not make sense: preemptive
                  acknowledgements would require a reliable underlying transport
                  channel.
                </>
              }
            >
              dropped
            </Sidenote>. This can allow for operation where no messages are ever
            dropped. Such systems are often called{" "}
            <Quotes>credit-based</Quotes>.
          </P>

          <P>
            While never sending messages that end up dropped conserves bandwidth
            usage, it introduces latency: the sender might need to wait for
            notifications of buffer capacity. Hence, LCMUX does allow for
            optimistic sending of messages, messages which then might end up
            being dropped if buffer capacity at the time of receiving is
            insufficient.
          </P>

          <P>
            There are two equally valid viewpoints of LCMUX: as an
            acknowledgement-based system with preemptive acknowledgements, or as
            a credit-based system with speculative sending. Our remaining
            presentation takes the latter viewpoint: we first establish a system
            for communicating messages that can be sent without any danger of
            dropping, and then extend it with optimistic sending and failure
            notification.
          </P>
        </Hsection>

        <Hsection n="resouce_control_requirements" title="Requirements">
          <PreviewScope>
            <P>
              To describe LCMUX more precisely, we first need to introduce some
              terminology. One peer — the{" "}
              <Def n="lcmux_c" r="client" rs="clients" />{" "}
              — whishes to send messages to the other peer — the{" "}
              <Def n="lcmux_s" r="server" rs="servers" />. Some messages can be
              reliably processed by the <R n="lcmux_s" />{" "}
              without ever requiring buffering; these messages we call{" "}
              <Def n="global_message" r="global message" rs="global messages">
                global messages
              </Def>. Messages that might require buffering are called{" "}
              <Def
                n="channel_message"
                r="channel message"
                rs="channel messages"
              >
                channel messages
              </Def>. Each <R n="channel_message" /> belongs to exactly one{" "}
              <Def
                n="logical_channel"
                r="logical channel"
                rs="logical channels"
              />. Many different (kinds of) messages may belong to the same{" "}
              <R n="logical_channel" />. For each <R n="logical_channel" />, the
              {" "}
              <R n="lcmux_s" />{" "}
              maintains a fifo buffer, into which it immediately moves all
              corresponding <Rs n="channel_message" /> upon arrival.
            </P>
          </PreviewScope>

          <Figure>
            <Img
              src={<ResolveAsset asset={["lcmux", "logical_channels.png"]} />}
              alt={`A sequence of boxes in four different colours on the left, the result of dividing them up by colour on the right. The one yellow box is missing on the right side.`}
            />
            <Figcaption>
              <Rsb n="channel_message" />{" "}
              being moved from a shared fifo input to the buffers of their
              respective <Rs n="logical_channel" />. The yellow message is a
              {" "}
              <R n="global_message" /> that does not get buffered at all.
            </Figcaption>
          </Figure>

          <P>
            We now list some properties we need our multiplexing protocol to
            fulfil.
          </P>

          <P>
            The <R n="lcmux_s" /> should be able to inform the <R n="lcmux_c" />
            {" "}
            about its remaining buffer capacities for its{" "}
            <Rs n="logical_channel" />, and keep these values up to date as it
            buffers and processes (thus freeing buffer space){" "}
            <Rs n="channel_message" />. The <R n="lcmux_c" />{" "}
            should be able to rely on this information: if the <R n="lcmux_s" />
            {" "}
            promises buffer capability, it must deliver.
          </P>

          <P>
            The <R n="lcmux_s" />{" "}
            should be able to resize its buffers to cope with competing resource
            demands. Increasing buffer capacity is unproblematic, but we will
            see that decreasing buffer capacity requires cooperation with the
            {" "}
            <R n="lcmux_c" /> in some situations.
          </P>

          <P>
            Both the <R n="lcmux_c" /> and the <R n="lcmux_s" />{" "}
            should be able to voluntarily impose and communicate limits on how
            many bytes of <Rs n="channel_message" />{" "}
            they will at most send or receive over a <R n="logical_channel" />
            {" "}
            in the future. Once that limit reaches zero, the other peer can
            consider the channel as being closed.
          </P>

          <P>
            Finally, the <R n="lcmux_c" /> should be able to optimistically send
            {" "}
            <Rs n="channel_message" />{" "}
            even though their corresponding buffer might be full — by the time
            the messages arrive at the{" "}
            <R n="lcmux_s" />, the buffer space might have become available
            after all. The <R n="lcmux_s" />{" "}
            must be able to reject and drop such optimistically transmitted
            messages, however. When it does, it must inform the{" "}
            <R n="lcmux_c" />, because the <R n="lcmux_c" />{" "}
            always needs to maintain accurate (if delayed) information about all
            buffer states.
          </P>
        </Hsection>

        <Hsection n="resource_control_overview" title="Solution Overview">
          <P>
            To satisfy these requirements, our solution builds on the concept of
            {" "}
            <Def
              n="guarantee"
              rs="guarantees"
              preview={
                <P>
                  A <Def fake n="guarantee" />{" "}
                  constitutes a binding promise that <R n="lcmux_s" />{" "}
                  will be able to buffer messages for a particular{" "}
                  <R n="logical_channel" />. One <R n="guarantee" />{" "}
                  corresponds to one byte of buffer space.
                </P>
              }
            >
              guarantees
            </Def>. The <R n="lcmux_s" /> sends per-<R n="logical_channel" />
            {" "}
            <Rs n="guarantee" /> of available buffer space to the{" "}
            <R n="lcmux_c" />; the <R n="lcmux_c" /> tracks its available{" "}
            <Rs n="guarantee" /> and knows that all of its{" "}
            <Rs n="channel_message" /> that do not exceed the available{" "}
            <Rs n="guarantee" /> for their <R n="logical_channel" />{" "}
            will be buffered.
          </P>

          <Figure>
            <Img
              src={<ResolveAsset asset={["lcmux", "rc_simplest_case.png"]} />}
              alt={`The first of several diagrams depicting the state kept by a server and a client. States are arranged in two rows — one for the server, and one for the client — with time progressing from left to right. Initially, the server has a buffer with six remaining slots. The server has already given guarantees for four of these slots, two guarantees remain unissued. The client has a budget of four remaining guarantees to work with. After sending a three-byte channel message, the remaining guarantees of the client decrease to one. The server buffers the received message, its number of issuable guarantees remains unchanged.`}
            />
            <Marginale>
              This diagram shows the statekeeping for only a single{" "}
              <R n="logical_channel" />. The full session state consists of an
              independent copy for every different <R n="logical_channel" />
              {" "}
              a protocol uses.
            </Marginale>
            <Figcaption>
              Statekeeping for <R n="lcmux_s" /> and <R n="lcmux_c" /> when the
              {" "}
              <R n="lcmux_c" /> sends a <R n="channel_message" />. The{" "}
              <R n="lcmux_s" />{" "}
              tracks for how many unoccupied buffer slots it has not yet issued
              {" "}
              <Rs n="guarantee" />, the <R n="lcmux_c" /> tracks how many{" "}
              <Rs n="guarantee" /> it has available. Sending a{" "}
              <R n="channel_message" /> reduces the <Rs n="guarantee" />{" "}
              available to the <R n="lcmux_c" />.
            </Figcaption>
          </Figure>

          <P>
            When the <R n="lcmux_s" />{" "}
            increases a buffer’s capacity, it gives that many{" "}
            <Rs n="guarantee" /> (measured in bytes) for the corresponding{" "}
            <R n="logical_channel" /> to the{" "}
            <R n="lcmux_c" />. When establishing the connection, the{" "}
            <R n="lcmux_c" /> has no <Rs n="guarantee" />, and the{" "}
            <R n="lcmux_s" /> typically starts by sending <Rs n="guarantee" />
            {" "}
            equal to its initial buffer capacities. Conceptually, the{" "}
            <R n="lcmux_s" />{" "}
            begins its operation by increasing its buffer capacities from zero
            to their actual starting amounts.
          </P>

          <Figure>
            <Img
              src={
                <ResolveAsset
                  asset={["lcmux", "increasing_buffer_capacity.png"]}
                />
              }
              alt={`A server-client diagram. Initially, the server has zero issuable guarantees, and a buffer of size zero. The client starts with zero remaining guarantees. In the next step, the server increases its buffer size to five, leaving it with five unissued guarantees. Then, it issues those five guarantees. In the resulting state, the server has zero issuable guarantees left, whereas the available guarantees of the client increase to five.`}
            />
            <Figcaption>
              The <R n="lcmux_s" />{" "}
              increases its buffer capacity and then issues as many{" "}
              <Rs n="guarantee" />.
            </Figcaption>
          </Figure>

          <P>
            The second way of giving <Rs n="guarantee" /> occurs when the{" "}
            <R n="lcmux_s" /> has processed a buffered <R n="channel_message" />
            {" "}
            and thus frees up buffer space. It then communicates the amount of
            freed buffer space, and for which <R n="logical_channel" />. The
            {" "}
            <R n="lcmux_s" />{" "}
            need not communicate this immediately, it is free to send only the
            occasional update that aggregates <Rs n="guarantee" />{" "}
            that stem from processing several <Rs n="channel_message" />{" "}
            from the same <R n="logical_channel" />.
          </P>

          <Figure>
            <Img
              src={
                <ResolveAsset asset={["lcmux", "processing_messages.png"]} />
              }
              alt={`A server-client diagram. The server starts out with a buffer containing two empty slots, a message of size two, a message of size one, and a final message of size two. It has zero issuable guarantees, so the client has two remaining guarantees that correspond to the two unused buffer slots. The server processes its rightmost buffered message, leaving it with two more messages, and four empty buffer slots. For the two new open slots, no guarantees have been given yet, so the server’s issuable guarantees increase to two. Next, the server processes another message, increasing the issuable guarantees to three, and leaving only a single, two-byte message in its buffer. Finally, the server sends three guarantees to the client: the issuable guarantees go do to zero, and the client’s available guarantees go up from two to five.`}
            />
            <Figcaption>
              The <R n="lcmux_s" /> processes a{" "}
              <Vermillion>message</Vermillion>, it later processes another{" "}
              <Blue>message</Blue>, and then decides to issue{" "}
              <Rs n="guarantee" /> for the freed buffer slots.
            </Figcaption>
          </Figure>

          <P>
            When the <R n="lcmux_s" />{" "}
            wishes to reduce the capacity of some buffer, it can simply process
            messages from that buffer without informing the{" "}
            <R n="lcmux_c" />. This decreases the overall amount of{" "}
            <Rs n="guarantee" /> in the system by the correct amount.
          </P>

          <Figure>
            <Img
              src={<ResolveAsset asset={["lcmux", "reducing_capacity.png"]} />}
              alt={`A server-client diagram. The server starts out with a buffer containing two empty slots, and two messages of two bytes each. It has zero issuable guarantees, putting the client at two remaining guarantees. The server then processes a message and decreases its total buffer size by the message’s size. All other state remains unchanged.`}
            />
            <Figcaption>
              Processing a message without issuing <Rs n="guarantee" />{" "}
              for it allows the <R n="lcmux_s" /> to shrink its buffer.
            </Figcaption>
          </Figure>

          <P>
            This technique is only applicable when the <R n="lcmux_s" />{" "}
            has some buffered messages; it does not allow it to reduce buffer
            capacity for empty buffers. But the <R n="lcmux_s" />{" "}
            cannot simply decrease the buffer size and then inform the{" "}
            <R n="lcmux_c" />{" "}
            when a buffer is empty: while that information is travelling to the
            {" "}
            <R n="lcmux_c" />, the <R n="lcmux_c" /> might send messages on this
            {" "}
            <R n="logical_channel" />, fully expecting them to be buffered by
            the <R n="lcmux_s" />.
          </P>

          <P>
            To solve this problem, we introduce a mechanism for the{" "}
            <R n="lcmux_c" /> to{" "}
            <Def
              n="absolution"
              preview={
                <P>
                  When the <R n="lcmux_c" />{" "}
                  <Def n="absolution" fake>absolves</Def> the <R n="lcmux_s" />
                  {" "}
                  of some amount of <Rs n="guarantee" /> for some{" "}
                  <R n="logical_channel" />, the <R n="lcmux_s" />{" "}
                  can act as if it had receives messages that consumed that many
                  {" "}
                  <Rs n="guarantee" /> on that <R n="logical_channel" />.
                </P>
              }
            >
              absolve
            </Def>{" "}
            the <R n="lcmux_s" /> of some absolute amount of its unused{" "}
            <Rs n="guarantee" /> on some{" "}
            <R n="logical_channel" />, and we add a way for the{" "}
            <R n="lcmux_s" /> to ask for such <R n="absolution" />. Asking for
            {" "}
            <R n="absolution" /> takes the form of specifying the{" "}
            <R n="logical_channel" /> and the number of <Rs n="guarantee" /> the
            {" "}
            <R n="lcmux_s" /> would like the <R n="lcmux_c" />{" "}
            to keep. Upon receiving this request, the <R n="lcmux_c" />{" "}
            <R n="absolution">absolves</R> the <R n="lcmux_s" />{" "}
            of exactly the amount needed to reach the desired number of{" "}
            <Rs n="guarantee" />. If the <R n="lcmux_c" /> already has fewer
            {" "}
            <Rs n="guarantee" /> by the time the request for{" "}
            <R n="absolution" /> arrives, the <R n="lcmux_c" />{" "}
            simply ignores the request.
          </P>

          <Figure>
            <Img
              src={<ResolveAsset asset={["lcmux", "good_shrinking.png"]} />}
              alt={`A server-client diagram. The server starts with seven empty buffer slots and zero issuable guarantees; the client starts with seven remaining guarantees. In the first step, the server asks for absolution down to a number of three remaining guarantees. When the client receives the request, it answers by absolving four guarantees, and reduces its remaining guarantees by four down to three. The server receives the absolution and then shrinks its buffer by four slots down to three.`}
            />
            <Figcaption>
              Buffer downscaling without any concurrency issues: the{" "}
              <R n="lcmux_s" /> asks for <R n="absolution" />, the{" "}
              <R n="lcmux_c" /> grants it.
            </Figcaption>
          </Figure>

          <Figure>
            <Img
              src={<ResolveAsset asset={["lcmux", "complex_shrinking.png"]} />}
              alt={`A server-client diagram. The server starts with nine buffer slots, two of which are occupied by a message. Its issuable guarantees are zero, the client starts with seven remaining guarantees. In the first step, the server asks for absolution down to four remaining guarantees, and concurrently, the clients sends a message of size one. Hence, the client’s remaining guarantees are six when the server’s request for absolution arrives. The server receives the one-byte message and buffers it. The client then absolves two guarantees, reducing its remaining guarantees to four. The server receives the absolution and can shrink its buffer by two slots, leaving it with a total buffer capacity of seven (three slots occupied by the two buffered messages, and four unused slots).`}
            />
            <Figcaption>
              Concurrently to the <R n="lcmux_s" /> asking for{" "}
              <R n="absolution" />, the <R n="lcmux_c" />{" "}
              sends a message. The protocol is designed so that nothing goes
              wrong.
            </Figcaption>
          </Figure>

          <P>
            Next, we consider the ability to close{" "}
            <Rs n="logical_channel" />. More precisely, we consider a
            generalization of closing: the communication of an upper bound on
            future usage.
          </P>

          <P>
            At any point, the <R n="lcmux_c" />{" "}
            may communicate an upper bound on how many bytes of{" "}
            <Rs n="channel_message" /> it wants to communicate over a{" "}
            <R n="logical_channel" />{" "}
            in the future. Both peers can track this number and subtract from it
            whenever the <R n="lcmux_s" />{" "}
            accepts (i.e., receives and does not drop) bytes accross the{" "}
            <R n="logical_channel" />, or when the <R n="lcmux_c" /> provides
            {" "}
            <R n="absolution" /> for it. The <R n="lcmux_c" />{" "}
            must not send any messages that could turn the tracked number
            negative. The <R n="lcmux_c" />{" "}
            may send new upper bounds over time, but only if they strictly
            tighten the limit. Any bounds that would allow the <R n="lcmux_c" />
            {" "}
            to send more bytes than promised in a previous bound are forbidden.
          </P>
          
          <Figure>
            <Img
              src={
                <ResolveAsset
                  asset={["lcmux", "client_limiting.png"]}
                />
              }
              alt={`A server-client diagram. The server starts with five empty buffer slots and zero issuable guarantees, and the client starts with five remaining guarantees. In the first step, the client sends a message to the server that it will only send two more bytes. In the second step, the server has blocked off three of its buffer's slots, leaving only two available. The client's original five remaining guarantees have been reduced to the two it limited itself to. The client sends a two-byte message. In the third step, the server has filled the open slots of its buffer, and the client has zero remaining guarantees.`}
            />
            <Figcaption>
              The <R n="lcmux_c"/> communicates an upper bound on the number of bytes it will communicate to the <R n="lcmux_s" /> in the future.
            </Figcaption>
          </Figure>

          <P>
            Fully analogously, the <R n="lcmux_s" />{" "}
            may communicate an upper bound on how many more bytes of messages it
            will accept over a <R n="logical_channel" />{" "}
            in the future. After accepting that many bytes, all future bytes
            must be dropped. In particular, this bound thus also gives an upper
            bound on how many more <Rs n="guarantee" /> the <R n="lcmux_s" />
            {" "}
            might issue for that <R n="logical_channel" /> in the future. The
            {" "}
            <R n="lcmux_s" />{" "}
            may communicate new upper bounds over time, but only if they stictly
            tighten the limit.
          </P>
          
          <Figure>
            <Img
              src={
                <ResolveAsset
                  asset={["lcmux", "server_limiting.png"]}
                />
              }
              alt={`A server-client diagram. The server starts with five empty buffer slots and zero issuable guarantees, and the client starts with five remaining guarantees. In the first step, the server sends a message to the client that it will only accept two more bytes. In the second step, the server has blocked off three of its buffer's slots, leaving only two available. The client's original five remaining guarantees have been reduced to the two the server indicated it would limit itself to. The client sends a two-byte message. In the third step, the server has filled the open slots of its buffer, and the client has zero remaining guarantees.`}
            />
            <Figcaption>
              <Figcaption>
                The <R n="lcmux_s"/> communicates an upper bound on the number of bytes it will communicate to the <R n="lcmux_c" /> in the future.
              </Figcaption>
            </Figcaption>
          </Figure>

          <P>
            Taken together, these techniques make for a stable system where the
            {" "}
            <R n="lcmux_c" /> never overwhelms the buffer capacity of the{" "}
            <R n="lcmux_s" />. As a final addition, however, we want to allow
            the <R n="lcmux_c" />{" "}
            to optimistically send data even without corresponding{" "}
            <Rs n="guarantee" />. The <R n="lcmux_s" />{" "}
            may, after all, have freed up buffer space by the time the
            optimistically transmitted <Rs n="channel_message" /> arrive.
          </P>

          <Figure>
            <Img
              src={<ResolveAsset asset={["lcmux", "optimistic_sending.png"]} />}
              alt={`A server-client diagram. The server starts with a buffer containing one empty slot, a message of size two, and a message of size four. Its issuable guarantees are one, the client starts with zero remaining guarantees. In the first step, the server processes the four-byte message, leaving it with five empty buffer slots and as many issuable guarantees; the client state remains unchanged. Next, the client optimistically sends a three-byte message, leaving its remaining guarantees at negative three. The server receives and buffers the message, its issuable guarantees remain unchanged at five, despite now having only two free buffer slots. Finally, the server issues five guarantees, leaving it with zero issuable guarantees. The client’s remaining guarantees increase by five to positive two.`}
            />
            <Figcaption>
              The <R n="lcmux_c" /> optimistically sends a{" "}
              <R n="channel_message" />, pushing its available{" "}
              <Rs n="guarantee" /> below zero. When it arrives, the{" "}
              <R n="lcmux_s" />{" "}
              has buffer space available; it simply buffers the message without
              taking any special action.
            </Figcaption>
          </Figure>

          <P>
            If the <R n="lcmux_s" />{" "}
            has insufficient buffer capacity when an optimistically transmitted
            message arrives, the <R n="lcmux_s" />{" "}
            drops it without any processing. We must add feedback mechanism to
            the protocol, since the <R n="lcmux_c" />{" "}
            must be informed of the message dropping.
          </P>

          <PreviewScope>
            <P>
              To keep the complexity of the feedback mechanism minimal, we adopt
              a simplistic solution: when the <R n="lcmux_s" /> drops an{" "}
              <Sidenote
                note={
                  <>
                    The <R n="lcmux_s" /> is <Em>not</Em>{" "}
                    allowed to drop messages for which it had previously
                    guaranteed buffer capacity.
                  </>
                }
              >
                optimistically
              </Sidenote>{" "}
              transmitted <R n="channel_message" />, it must{" "}
              <Em>keep dropping</Em> all <Rs n="channel_message" /> on the same
              {" "}
              <R n="logical_channel" />, until it receives an{" "}
              <Def n="apology" /> for that <R n="logical_channel" /> from the
              {" "}
              <R n="lcmux_c" />. When the <R n="lcmux_s" />{" "}
              starts dropping messages on some{" "}
              <R n="logical_channel" />, it must notify the{" "}
              <R n="lcmux_c" />. After receiving the notification, the{" "}
              <R n="lcmux_c" /> can send an <R n="apology" />, knowing that the
              {" "}
              <R n="lcmux_s" /> will revert back to normal operation for that
              {" "}
              <R n="logical_channel" /> after receiving it.
            </P>
          </PreviewScope>

          <Figure clazz="wide">
            <Img
              src={
                <ResolveAsset
                  asset={["lcmux", "optimistic_sending_gone_awry.png"]}
                />
              }
              alt={`An extra-wide server-client diagram. The server starts with a buffer containing one empty slot and one message of size six. The issuable guarantees are zero, the client’s remaining guarantees are one. Unlike the previous diagrams, the server has a small emoji to indicate whether it is dropping messages; initially, the emoji is happy. In the first step, the client optimistically sends a message of three bytes, putting it at negative two remaining guarantees. The server cannot buffer the message, so it drops the message. Its state remains unchanged, except for the emoji turning angry. Next, the client sends a message of size one, putting it at negative three remaining guarantees. The server drops the message, its state remains completely unchanged. In the next step, the server sends a message to notify the client of the dropping. The emoji turns slightly less angry, otherwise the server state remains unchanged. Upon receiving the notification, the client sets its remaining guarantees to one. Finally, it sends an apology. Receiving the apology resets the server’s emoji to the initial, happy expression.`}
            />
            <Figcaption>
              When the <R n="lcmux_s" /> receives an optimistic{" "}
              <Vermillion>message</Vermillion>{" "}
              it cannot buffer, it drops it and all further messages, even any
              {" "}
              <Purple>message</Purple>{" "}
              for which it has sufficient buffer capacity. Only after receiving
              an <R n="apology" />{" "}
              does it switch state and become able to accept further messages.
              The{" "}
              <R n="lcmux_c" />, when notified of message dropping, increments
              its counter of remaining <Rs n="guarantee" />{" "}
              by the number of message bytes that got dropped.
            </Figcaption>
          </Figure>

          <P>
            This approach comes with two subtleties. First, the{" "}
            <R n="lcmux_s" />{" "}
            must never buffer partial messages — if it can buffer all but one
            byte of a message, it must still drop the full message and all
            subsequent ones until the <R n="apology" />. Second, the{" "}
            <R n="lcmux_s" /> must issue <Rs n="guarantee" />{" "}
            for all the optimistic message bytes that it did manage to buffer,
            before informing the <R n="lcmux_c" />{" "}
            that it has started to drop messages. This is necessary so that the
            {" "}
            <R n="lcmux_c" />{" "}
            can reconstruct exactly which of its messages got dropped, and which
            still made it through.
          </P>

          <Figure clazz="wide">
            <Img
              src={
                <ResolveAsset
                  asset={["lcmux", "optimistic_sending_gone_really_awry.png"]}
                />
              }
              alt={`An extra-wide server-client diagram. The server starts with a happy expression, and a buffer containing four empty slots and one message of size three. The issuable guarantees are three, the client’s remaining guarantees are one. In this diagram, the client also maintains a buffer, initially consisting of six unused slots. In the first step, the client optimistically sends a message of two bytes, putting it at negative one remaining guarantees. The client places the message in its buffer, and tracks that only one byte of the message was optimistic. The server buffers the message, staying happy and remaining with three unissued guarantees. Its buffer now contains two free slots, a message of size two, and a message of size three. Next, the client sends a message of size three, placing a copy in its buffer, and putting it at negative four guarantees. The server has to drop this message, turning angry but otherwise keeping its state. Then, the server issues a single guarantee, putting its issuable guarantees at two. When the client receives this guarantee, it not only increases its remaining guarantees to negative three, but it also removes the two-byte message from its buffer, leaving the buffer with three unused slots and the three-byte message. Next, the server sends a notification that it dropped messages. The client empties its buffer of the three-byte message, and increases its remaining guarantees by that amount back to zero. It then replies with an apology, turning the server happy again. In this final state, the happy server has two issuable guarantees and a buffer containing two unused slots — the client’s message of size two, and the size-three message that occupied the buffer from the very beginning. The client ends the interaction with an empty buffer and zero remaining guarantees.`}
            />
            <Figcaption>
              Before the <R n="lcmux_s" />{" "}
              announces that it is dropping messages, it issues{" "}
              <Rs n="guarantee" /> for the optimistic messages bytes it{" "}
              <Em>did</Em> manage to buffer. The <R n="lcmux_c" />{" "}
              maintains a queue of its optimistically transmitted messages, and
              tracks how many of their bytes it knows to have been processed.
              When the <R n="lcmux_c" /> receives <Rs n="guarantee" />{" "}
              for all bytes of a message, it can be <Purple>dequeued</Purple>.
              <Br />
              In this example, the <R n="lcmux_c" />{" "}
              empties its queue, whereas a realistic implementation would
              probably keep the queue to (transparently) retransmit all dropped
              messages before sending new ones. Note further that the{" "}
              <R n="lcmux_s" /> had to issue at least <Em>one</Em>{" "}
              <R n="guarantee" />{" "}
              before sending the dropping notification, but it would also have
              been allowed to issue <Em>more</Em> <Rs n="guarantee" />{" "}
              — a realistic <R n="lcmux_s" />{" "}
              would have issued all three issuable <Rs n="guarantee" />.
            </Figcaption>
          </Figure>

          <P>
            <Marginale>
              When a <R n="lcmux_s" /> preemptively issues{" "}
              <Rs n="guarantee" />, the <R n="lcmux_c" />{" "}
              can defer flow control fully to the <R n="lcmux_s" />{" "}
              by never sending optimistically, eliminating the need to buffer
              messages for retransmission. This behaviour would lead to a
              deadlock however with a <R n="lcmux_s" /> that uses{" "}
              <Rs n="guarantee" /> as acknowledgements only.
            </Marginale>
            Some <Rs n="lcmux_s" />{" "}
            might implement a credit-based scheme and preemptively issue{" "}
            <Rs n="guarantee" />, whereas other servers might use{" "}
            <Rs n="guarantee" />{" "}
            purely as a retroactive acknowledgement mechanism and expect their
            {" "}
            <Rs n="lcmux_c" /> to send optimistically. Some <Rs n="lcmux_s" />
            {" "}
            might even have different policies for different{" "}
            <Rs n="logical_channel" />. A <R n="lcmux_c" />{" "}
            that knows which behaviour to except can adjust its own behaviour
            accordingly.
          </P>

          <P>
            We prose an informal, non-normative coordination mechanism: by
            default, <Rs n="lcmux_c" />{" "}
            should assume that they need to send optimistically. On each{" "}
            <R n="logical_channel" /> on which a <R n="lcmux_s" />{" "}
            wants to commit to handling flow control via preemptive{" "}
            <Rs n="guarantee" />, it should issue zero guarantees as its first
            action related to that channel.
          </P>
        </Hsection>

        <Hsection n="lcmux_spec" title="LCMUX Specification">
          <P>
            Having introduced all these concepts and terminology, we can now
            define how LCMUX expresses them over a reliable, ordered,
            byte-oriented, bidirectional communication channel. LCMUX allows
            multiplexing <Rs n="global_message" /> and{" "}
            <Rs n="channel_message" /> on up to{" "}
            <M>
              2^<Curly>64</Curly>
            </M>{" "}
            <Rs n="logical_channel" />.
          </P>

          <PreviewScope>
            <P>
              LCMUX is a message-oriented protocol. To avoid confusion with{" "}
              <Rs n="global_message" /> and{" "}
              <Rs n="channel_message" />, the units of information transfer in
              LCMUX are called <Def n="frame" rs="frames">frames</Def>. Some
              {" "}
              <Rs n="frame" /> encapsulate <Rs n="global_message" /> or{" "}
              <R n="channel_message" />, while others transmit metadata only.
            </P>
          </PreviewScope>

          <P>
            There are nine different kinds of{" "}
            <Rs n="frame" />. The first four are sent by the <R n="lcmux_s" />
            {" "}
            to the <R n="lcmux_c" />:
          </P>

          <Pseudocode n="lcmux_server_frames">
            <StructDef
              comment={
                <>
                  The <R n="lcmux_s" /> makes a binding promise of{" "}
                  <R n="IssueGuaranteesFrameAmount" />{" "}
                  many bytes of available buffer capacity for the channel{" "}
                  <R n="IssueGuaranteesFrameChannel" /> to the{" "}
                  <R n="lcmux_c" />.
                </>
              }
              id={[
                "IssueGuaranteesFrame",
                "IssueGuaranteesFrame",
                "IssueGuaranteesFrames",
              ]}
              fields={[
                [["channel", "IssueGuaranteesFrameChannel"], <R n="U64" />],
                [["amount", "IssueGuaranteesFrameAmount"], <R n="U64" />],
              ]}
            />
            <Loc />
            <StructDef
              comment={
                <>
                  The <R n="lcmux_s" /> kindly asks the <R n="lcmux_c" />{" "}
                  to send an <R n="AbsolveFrame" /> such that the{" "}
                  <R n="lcmux_c" />’s remaining <Rs n="guarantee" /> will be
                  {" "}
                  <R n="PleadFrameTarget" /> (or less) for the channel{" "}
                  <R n="PleadFrameChannel" />.
                </>
              }
              id={["PleadFrame", "PleadFrame", "PleadFrames"]}
              fields={[
                [["channel", "PleadFrameChannel"], <R n="U64" />],
                [["target", "PleadFrameTarget"], <R n="U64" />],
              ]}
            />
            <Loc />
            <StructDef
              comment={
                <>
                  The <R n="lcmux_s" /> promises to the <R n="lcmux_c" />{" "}
                  that after processing (i.e., receiving and not dropping){" "}
                  <R n="LimitReceivingFrameBound" />{" "}
                  ( or possibly fewer) bytes of <Rs n="channel_message" />{" "}
                  on the channel{" "}
                  <R n="LimitReceivingFrameChannel" />, it will drop all future
                  {" "}
                  <R n="channel_message" /> bytes on that channel.
                </>
              }
              id={[
                "LimitReceivingFrame",
                "LimitReceivingFrame",
                "LimitReceivingFrames",
              ]}
              fields={[
                [["channel", "LimitReceivingFrameChannel"], <R n="U64" />],
                [["bound", "LimitReceivingFrameBound"], <R n="U64" />],
              ]}
            />
            <Loc />
            <StructDef
              comment={
                <>
                  The <R n="lcmux_s" /> notifies the <R n="lcmux_c" />{" "}
                  that it has started dropping <Rs n="channel_message" />{" "}
                  on the channel{" "}
                  <R n="AnnounceDroppingFrameChannel" />, and that it will
                  continue to do so until receiving an <R n="ApologiseFrame" />
                  {" "}
                  from the <R n="lcmux_c" />. The <R n="lcmux_s" />{" "}
                  <Em>must</Em> <R n="IssueGuaranteesFrame">issue</R>{" "}
                  any outstanding <Rs n="guarantee" /> for{" "}
                  <R n="AnnounceDroppingFrameChannel" /> before sending this
                  {" "}
                  <R n="frame" />.
                </>
              }
              id={[
                "AnnounceDroppingFrame",
                "AnnounceDroppingFrame",
                "AnnounceDroppingFrames",
              ]}
              fields={[
                [["channel", "AnnounceDroppingFrameChannel"], <R n="U64" />],
              ]}
            />
          </Pseudocode>

          <P>
            The remaining five kinds of <Rs n="frame" /> are sent by the{" "}
            <R n="lcmux_c" /> to the <R n="lcmux_s" />.
          </P>

          <Pseudocode n="lcmux_client_frames">
            <StructDef
              comment={
                <>
                  The <R n="lcmux_c" /> sends a <R n="channel_message" />{" "}
                  as a bytestring <R n="SendChannelFrameContent" /> of length
                  {" "}
                  <R n="SendChannelFrameLength" /> to the <R n="lcmux_s" />{" "}
                  on the channel <R n="SendChannelFrameChannel" />.
                </>
              }
              id={["SendChannelFrame", "SendChannelFrame", "SendChannelFrames"]}
              fields={[
                [["channel", "SendChannelFrameChannel"], <R n="U64" />],
                [["length", "SendChannelFrameLength"], <R n="U64" />],
                [
                  ["content", "SendChannelFrameContent"],
                  <SliceType>
                    <R n="U8" />
                  </SliceType>,
                ],
              ]}
            />
            <Loc />
            <StructDef
              comment={
                <>
                  The <R n="lcmux_c" /> <R n="absolution">absolves</R> the{" "}
                  <R n="lcmux_s" /> of <R n="AbsolveFrameAmount" />{" "}
                  many bytes for the channel <R n="AbsolveFrameChannel" />.
                </>
              }
              id={["AbsolveFrame", "AbsolveFrame", "AbsolveFrames"]}
              fields={[
                [["channel", "AbsolveFrameChannel"], <R n="U64" />],
                [["amount", "AbsolveFrameAmount"], <R n="U64" />],
              ]}
            />
            <Loc />
            <StructDef
              comment={
                <>
                  The <R n="lcmux_c" /> promises to the <R n="lcmux_s" />{" "}
                  that after the server has processed (i.e., received and not
                  dropped) <R n="LimitSendingFrameBound" />{" "}
                  (or possibly fewer) bytes of <Rs n="channel_message" />{" "}
                  on the channel <R n="LimitSendingFrameChannel" />, the{" "}
                  <R n="lcmux_c" /> will not send any more{" "}
                  <R n="channel_message" /> bytes on that channel.
                </>
              }
              id={[
                "LimitSendingFrame",
                "LimitSendingFrame",
                "LimitSendingFrames",
              ]}
              fields={[
                [["channel", "LimitSendingFrameChannel"], <R n="U64" />],
                [["bound", "LimitSendingFrameBound"], <R n="U64" />],
              ]}
            />
            <Loc />
            <StructDef
              comment={
                <>
                  The <R n="lcmux_c" /> notifies the <R n="lcmux_s" />{" "}
                  that it can stop dropping messages on the channel{" "}
                  <R n="ApologiseFrameChannel" />.
                </>
              }
              id={["ApologiseFrame", "ApologiseFrame", "ApologiseFrames"]}
              fields={[
                [["channel", "ApologiseFrameChannel"], <R n="U64" />],
              ]}
            />
            <Loc />
            <StructDef
              comment={
                <>
                  The <R n="lcmux_c" /> sends a <R n="global_message" />{" "}
                  as a bytestring <R n="SendGlobalFrameContent" /> of length
                  {" "}
                  <R n="SendGlobalFrameLength" /> to the <R n="lcmux_s" />.
                </>
              }
              id={["SendGlobalFrame", "SendGlobalFrame", "SendGlobalFrames"]}
              fields={[
                [["length", "SendGlobalFrameLength"], <R n="U64" />],
                [
                  ["content", "SendGlobalFrameContent"],
                  <SliceType>
                    <R n="U8" />
                  </SliceType>,
                ],
              ]}
            />
          </Pseudocode>

          <P>
            Note that the bytes in a <R n="SendChannelFrame" /> or{" "}
            <R n="SendGlobalFrame" />{" "}
            need not form a full message of a higher-level protocol. LCMUX can
            be used to transparently fragment and interleave arbitrarily large
            higher-level messages by splitting their transmission over several
            {" "}
            <Rs n="frame" />.
          </P>

          <P>
            An LCMUX session consists of both peers exchanging{" "}
            <Rs n="frame" />, encoded with the <Rs n="encoding_relation" />{" "}
            we define next. Note that the <Rs n="code" /> of <Rs n="frame" />
            {" "}
            sent by a <R n="lcmux_c" /> and <Rs n="frame" /> sent by a{" "}
            <R n="lcmux_s" />{" "}
            are disjoint and can be distinguished by their first byte. This
            allows both peers to take on both roles — a typical LCMUX-based
            higher-level protocol runs two LCMUX sessions with reversed roles
            concurrently over a single underlying transport channel.
          </P>

          <Hsection n="lcmux_encodings_server" title="Server Frame Encodings">
            <EncodingRelationTemplate
              n="EncodeIssueGuaranteesFrame"
              valType={<R n="IssueGuaranteesFrame" />}
              bitfields={[
                bitfieldConstant([1, 1, 1, 1]),
                c64Tag(
                  "channel",
                  4,
                  <ValAccess field="IssueGuaranteesFrameChannel" />,
                ),
              ]}
              contents={[
                <C64Encoding id="channel" />,
                <C64Standalone>
                  <ValAccess field="IssueGuaranteesFrameAmount" />
                </C64Standalone>,
              ]}
            />

            <Hr />

            <EncodingRelationTemplate
              n="EncodePleadFrame"
              valType={<R n="PleadFrame" />}
              bitfields={[
                bitfieldConstant([1, 1, 1, 0]),
                c64Tag("channel", 4, <ValAccess field="PleadFrameChannel" />),
              ]}
              contents={[
                <C64Encoding id="channel" />,
                <C64Standalone>
                  <ValAccess field="PleadFrameTarget" />
                </C64Standalone>,
              ]}
            />

            <Hr />

            <EncodingRelationTemplate
              n="EncodeLimitReceivingFrame"
              valType={<R n="LimitReceivingFrame" />}
              bitfields={[
                bitfieldConstant([1, 1, 0, 1]),
                c64Tag(
                  "channel",
                  4,
                  <ValAccess field="LimitReceivingFrameChannel" />,
                ),
              ]}
              contents={[
                <C64Encoding id="channel" />,
                <C64Standalone>
                  <ValAccess field="LimitReceivingFrameBound" />
                </C64Standalone>,
              ]}
            />

            <Hr />

            <EncodingRelationTemplate
              n="EncodeAnnounceDroppingFrame"
              valType={<R n="AnnounceDroppingFrame" />}
              bitfields={[
                bitfieldConstant([1, 1, 0, 0]),
                c64Tag(
                  "channel",
                  4,
                  <ValAccess field="AnnounceDroppingFrameChannel" />,
                ),
              ]}
              contents={[
                <C64Encoding id="channel" />,
              ]}
            />
          </Hsection>

          <Hsection n="lcmux_encodings_client" title="Client Frame Encodings">
            <EncodingRelationTemplate
              n="EncodeAbsolveFrame"
              valType={<R n="AbsolveFrame" />}
              bitfields={[
                bitfieldConstant([1, 0, 1, 1]),
                c64Tag("channel", 4, <ValAccess field="AbsolveFrameChannel" />),
              ]}
              contents={[
                <C64Encoding id="channel" />,
                <C64Standalone>
                  <ValAccess field="AbsolveFrameAmount" />
                </C64Standalone>,
              ]}
            />

            <Hr />

            <EncodingRelationTemplate
              n="EncodeLimitSendingFrame"
              valType={<R n="LimitSendingFrame" />}
              bitfields={[
                bitfieldConstant([1, 0, 1, 0]),
                c64Tag(
                  "channel",
                  4,
                  <ValAccess field="LimitSendingFrameChannel" />,
                ),
              ]}
              contents={[
                <C64Encoding id="channel" />,
                <C64Standalone>
                  <ValAccess field="LimitSendingFrameBound" />
                </C64Standalone>,
              ]}
            />

            <Hr />

            <EncodingRelationTemplate
              n="EncodeApologiseFrame"
              valType={<R n="ApologiseFrame" />}
              bitfields={[
                bitfieldConstant([1, 0, 0, 1]),
                c64Tag(
                  "channel",
                  4,
                  <ValAccess field="ApologiseFrameChannel" />,
                ),
              ]}
              contents={[
                <C64Encoding id="channel" />,
              ]}
            />

            <Hr />

            <EncodingRelationTemplate
              n="EncodeSendGlobalFrame"
              valType={<R n="SendGlobalFrame" />}
              bitfields={[
                bitfieldConstant([1, 0, 0, 0]),
                c64Tag(
                  "length",
                  4,
                  <ValAccess field="SendGlobalFrameLength" />,
                ),
              ]}
              contents={[
                <C64Encoding id="length" />,
                <RawBytes>
                  <ValAccess field="SendGlobalFrameContent" />
                </RawBytes>,
              ]}
            />

            <Hr />

            <EncodingRelationTemplate
              n="EncodeSendChannelFrame"
              valType={<R n="SendChannelFrame" />}
              bitfields={[
                bitfieldConstant([0]),
                c64Tag(
                  "length",
                  3,
                  <ValAccess field="SendChannelFrameLength" />,
                ),
                c64Tag(
                  "channel",
                  4,
                  <ValAccess field="SendChannelFrameChannel" />,
                ),
              ]}
              contents={[
                <C64Encoding id="channel" />,
                <C64Encoding id="length" />,
                <RawBytes>
                  <ValAccess field="SendChannelFrameContent" />
                </RawBytes>,
              ]}
            />
          </Hsection>
        </Hsection>

        <Hsection n="resource_handles" title="Resource Handles">
          <P>
            <Marginale>
              While this section is not part of the LCMUX specification proper,
              it does inform implementation, particularly implementations to be
              useful for Willow.
            </Marginale>
            In this section, we discuss how to implement a common special case
            of resource control on top of LCMUX: that of maintaining numeric
            identifiers for shared context between two peers. For example, a
            peer might send a large piece of data, give it a numeric identifier,
            and then reference the data through its identifier rather than
            repeatedly including the data in future messages.
          </P>

          <P>
            Depositing data like this with the other peer requires them to spend
            resources (memory), so immediately questions of resource control and
            throttling arise. The freeing of bound resources also introduces
            some concurrency concerns. We first sketch a lightweight approach to
            maintaining data handles without considering resource control, and
            then show how to implement that approach on top of{" "}
            <Rs n="logical_channel" />{" "}
            such that resource concerns are addressed.
          </P>

          <PreviewScope>
            <P>
              We consider a <Def n="handle_c" r="client" rs="clients" />{" "}
              who asks a <Def n="handle_s" r="server" rs="servers" /> to{" "}
              <Def n="handle_bind" r="bind" /> some data to numeric{" "}
              <Def
                n="resource_handle"
                r="resource handle"
                rs="resource handles"
              >
                resource handles
              </Def>. The same protocol might use multiple types of data, each
              with its own independent{" "}
              <Def n="handle_type" r="handle type" rs="handle types">
                handle types
              </Def>{" "}
              (and independent resource control).
            </P>
          </PreviewScope>

          <PreviewScope>
            <P>
              Since both the <R n="handle_c" /> and the <R n="handle_s" />{" "}
              must keep track of all{" "}
              <Rs n="resource_handle" />, they should both be able to recover
              resources by removing bindings. We call this operation{" "}
              <Def n="handle_free" r="free">freeing</Def> a{" "}
              <R n="resource_handle" />.
            </P>
          </PreviewScope>

          <P>
            Note that we only discuss <Rs n="resource_handle" />{" "}
            that live during a particular protocol run between two peers. We do
            not consider the problem of persisting peer-specific state across
            sessions.
          </P>

          <Hsection
            n="resources_handles_managing"
            title="Managing Resource Handles"
          >
            <P>
              We use consecutive natural numbers as{" "}
              <Rs n="resource_handle" />. For each{" "}
              <R n="handle_type" />, both peers keep track of the least number
              that has not yet been assigned as a{" "}
              <R n="resource_handle">handle</R> of that{" "}
              <R n="handle_type">type</R>. In order to <R n="handle_bind" />
              {" "}
              a value to a <R n="resource_handle" />, the <R n="handle_c" />
              {" "}
              simply transmits the data and its type. The least number that had
              not been assigned before becomes the <R n="resource_handle" />
              {" "}
              of the transmitted data. Both peers add the new mapping into some
              data structure they can use to later dereference the{" "}
              <R n="resource_handle" /> into its value.
            </P>

            <P>
              The main issue in maintaining <Rs n="resource_handle" />{" "}
              is that of coordinating <R n="handle_free">freeing</R>{" "}
              over an asynchronous communication channel. Suppose one peer
              removes a handle-to-value binding from their local mapping, sends
              a message to inform the other peer, but that peer has concurrently
              sent some message that pertains to the <R n="resource_handle" />
              {" "}
              in question. Everything breaks!
            </P>

            <P>
              Hence, <R n="handle_free">freeing</R>{" "}
              is a multi-phase process. When Alfie wants to{" "}
              <R n="handle_free" /> a <R n="resource_handle" />, he sends a{" "}
              <R n="global_message" />{" "}
              to inform his peer (Betty). This message acts as a promise that
              Alfie will not reference that <R n="resource_handle" />{" "}
              in any of his future messages. He does not locally delete the
              handle yet, however. Betty, upon receiving the message, should
              send her own message in return, which will act as a promise that
              she will not reference the <R n="resource_handle" />{" "}
              in her future messages either.
            </P>

            <P>
              When a peer has both sent <Em>and</Em> received a message to{" "}
              <R n="handle_free" /> a <R n="resource_handle" />, it{" "}
              <Em>still cannot</Em>{" "}
              remove the data from memory: it might still have buffered some
              older messages on some <R n="logical_channel" />{" "}
              that reference the{" "}
              <R n="resource_handle" />. Only once it knows that no more old
              messages reference the <R n="resource_handle" />{" "}
              can it release the data.
            </P>

            <PreviewScope>
              <P>
                To this end, every peer counts how many messages it sends that
                refer to any one{" "}
                <R n="resource_handle" />. When a peer whishes to{" "}
                <R n="handle_free" /> a{" "}
                <R n="resource_handle">handle</R>, it includes its (then final)
                {" "}
                <Def
                  n="handle_refcount"
                  r="reference count"
                  rs="reference counts"
                />{" "}
                with that message. Similarly, every peer counts how many
                messages it receives that pertain to any one{" "}
                <R n="resource_handle" />. Only once that count matches the
                received <R n="handle_refcount" />
                in the <R n="handle_free">freeing message</R>{" "}
                does it release the bound data.
              </P>
            </PreviewScope>

            <PreviewScope>
              <P>
                Because it helps to have consistent terminology, we give
                explicit names to the distinct states in the process of freeing.
              </P>

              <Ul>
                <Li>
                  Initially, a <R n="resource_handle" /> is{" "}
                  <DefVariant
                    defClass="lcmux-dr fully-bound-dr"
                    refClass="lcmux-dr fully-bound-dr"
                    n="FullyBound"
                  />.
                </Li>
                <Li>
                  After a peer <Em>sends</Em> a message asking to{" "}
                  <R n="handle_free" /> a <R n="FullyBound" />{" "}
                  <R n="resource_handle" />, that peer marks it as{" "}
                  <DefVariant
                    defClass="lcmux-dr me-freed-dr"
                    refClass="lcmux-dr me-freed-dr"
                    n="MeFreed"
                  />.
                </Li>
                <Li>
                  When a peer <Em>receives</Em> a message asking to{" "}
                  <R n="handle_free" /> a <R n="FullyBound" />{" "}
                  <R n="resource_handle" />, that peer marks it as{" "}
                  <DefVariant
                    defClass="lcmux-dr you-freed-dr"
                    refClass="lcmux-dr you-freed-dr"
                    n="YouFreed"
                  />
                </Li>
                <Li>
                  Once both peers have sent their messages for{" "}
                  <R n="handle_free">freeing</R>, a <R n="MeFreed" /> or{" "}
                  <R n="YouFreed" /> <R n="resource_handle" /> is{" "}
                  <DefVariant
                    defClass="lcmux-dr awaiting-deletion-dr"
                    refClass="lcmux-dr awaiting-deletion-dr"
                    n="AwaitingDeletion"
                  />.
                </Li>
                <Li>
                  Once a peer knows for sure that it will not process any old
                  messages that reference a <R n="resource_handle" /> that is
                  {" "}
                  <R n="AwaitingDeletion" /> in the future, the{" "}
                  <R n="resource_handle" /> is{" "}
                  <DefVariant
                    defClass="lcmux-dr fully-deleted-dr"
                    refClass="lcmux-dr fully-deleted-dr"
                    n="FullyDeleted"
                  />. This state typically requires no explicit representation
                  in memory, because the peer would actually release the
                  storage.
                </Li>
              </Ul>
            </PreviewScope>

            <Figure>
              <Alj>
                We need to define what 'flush' means somewhere.
              </Alj>
              <Img
                src={
                  <ResolveAsset
                    asset={["lcmux", "handles", "simple_graph.png"]}
                  />
                }
                alt={`A state-transition diagram of the freeing process for data handles.`}
              />
              <Figcaption>
                The lifecycle of a{" "}
                <R n="resource_handle" />, with state transitions mostly
                triggered by the{" "}
                <Vermillion>
                  sending (<Code>!</Code>)
                </Vermillion>{" "}
                and{" "}
                <SkyBlue>
                  receiving (<Code>?</Code>)
                </SkyBlue>{" "}
                of messages.
              </Figcaption>
            </Figure>
          </Hsection>

          <Hsection n="handles_resource_control" title="Resource Control">
            <P>
              <Rb n="resource_handle" />{" "}
              allocation requires peers to use some of their finite pool of
              memory. Managing this resource involves exactly the same
              considerations as LCMUX <Rs n="logical_channel" />{" "}
              do. This allows for a simple — at least in principle — solution:
              for each <R n="handle_type" />, use a dedicated{" "}
              <R n="logical_channel" /> for the messages that{" "}
              <R n="handle_bind" /> those{" "}
              <Rs n="resource_handle" />. The issuing of <Rs n="guarantee" />
              {" "}
              can correspond to the memory available for{" "}
              <Rs n="resource_handle" /> of that <R n="handle_type" />.
            </P>

            <P>
              In practice, this turns out to be slightly more complicated than
              one might hope. First off, moving the incoming messages for
              binding <Rs n="resource_handle" />{" "}
              into a buffer makes little sense, since <Rs n="guarantee" />{" "}
              should correspond to actual <Rs n="resource_handle" />{" "}
              storage space, not the space for buffering merely{" "}
              <Em>the instructions</Em> for allocation of{" "}
              <Rs n="resource_handle" />. LCMUX implementations should be
              flexible enough to immediately process these incoming messages,
              allocating <Rs n="resource_handle" />{" "}
              storage, and using that for driving the issuing of{" "}
              <Rs n="guarantee" />.
            </P>

            <P>
              When <Rs n="resource_handle" />{" "}
              are to be stored in a data structure that allows for efficient
              queries on all stored{" "}
              <Rs n="resource_handle">handles</Rs>, predicting available storage
              space for proactively issuing <Rs n="guarantee" />{" "}
              can be difficult or impossible. It might be possible to provide
              conservative{" "}
              <Sidenote
                note={
                  <>
                    At the cost of more complicated data structure
                    implementations.
                  </>
                }
              >
                estimates
              </Sidenote>, but most peers will simply not issue{" "}
              <Rs n="guarantee" />, using them only as acknowledgements for
              optimistically transmitted handle-binding messages.
            </P>

            <P>
              Optimistic binding of <Rs n="resource_handle" />{" "}
              complicates the state space of each individual binding: receiving
              {" "}
              <Rs n="guarantee" />{" "}
              gives confirmation that a binding can be worked with, but
              receiving an <R n="AnnounceDroppingFrame" />{" "}
              means that the binding has to be discarded.
            </P>

            <PreviewScope>
              <P>
                The following additional states are possible:
              </P>

              <Ul>
                <Li>
                  When binding a <Rs n="resource_handle" />{" "}
                  optimistically, it starts out{" "}
                  <DefVariant
                    n="HopefullyBound"
                    defClass="lcmux-dr hopefully-bound-dr"
                    refClass="lcmux-dr hopefully-bound-dr"
                  />; sufficient <Rs n="guarantee" /> lead to a transition to
                  {" "}
                  <R n="FullyBound" />.
                </Li>
                <Li>
                  A peer can request <R n="handle_free">freeing</R> of a{" "}
                  <R n="resource_handle" />{" "}
                  that it itself had bound optimistically, the resulting state
                  is called{" "}
                  <DefVariant
                    defClass="lcmux-dr hopefully-me-freed-dr"
                    refClass="lcmux-dr hopefully-me-freed-dr"
                    n="HopefullyMeFreed"
                  />. Suffcient <Rs n="guarantee" /> lead to a transition to
                  {" "}
                  <R n="MeFreed" />.
                </Li>
                <Li>
                  An <R n="AnnounceDroppingFrame" /> for a{" "}
                  <R n="HopefullyBound" /> or <R n="HopefullyMeFreed" />{" "}
                  indicates that the <R n="resource_handle" />{" "}
                  was never bound it the first place, it got{" "}
                  <DefVariant
                    defClass="lcmux-dr dropped-dr"
                    refClass="lcmux-dr dropped-dr"
                    n="Dropped"
                  />. Implementations probably do not need to represent this
                  variant explicitly.
                </Li>
              </Ul>
            </PreviewScope>

            <Figure>
              <Img
                clazz="wide"
                src={
                  <ResolveAsset
                    asset={["lcmux", "handles", "optimistic_graph_sender.png"]}
                  />
                }
                alt={`The full state-transition diagram for optimistically bound data handles.`}
              />
              <Figcaption>
                The lifecycle of an optimistically bound{" "}
                <R n="resource_handle" />, from the perspective of the{" "}
                <R n="handle_c" />.{" "}
                <A
                  href={
                    <ResolveAsset
                      asset={[
                        "lcmux",
                        "handles",
                        "optimistic_graph_receiver.png",
                      ]}
                    />
                  }
                >
                  The server’s perspective
                </A>{" "}
                has identical states and transitions, except all sending and
                receiving of messages is reversed.
              </Figcaption>
            </Figure>

            <P>
              After optimistically binding a{" "}
              <R n="resource_handle" />, a peer may immediately reference that
              handle in its subsequent messages, without waiting for the
              acknowledging <Rs n="guarantee" />. If the{" "}
              <R n="resource_handle" />{" "}
              could not be bound by the other peer, those messages become
              meaningless. Hence, every peer simply discards all incoming
              messages that reference <Rs n="resource_handle" />{" "}
              that are not bound at that point in{" "}
              <Sidenote
                note={
                  <>
                    The whole system design ensures that messages are never
                    discarded if the sender followed all rules and the
                    optimistically bound <R n="resource_handle" />{" "}
                    did actually get processed by the receiver.
                  </>
                }
              >
                time
              </Sidenote>. This applies both to application-level messages and
              to messages for <R n="handle_free">freeing</R>{" "}
              an optimistically bound{" "}
              <R n="resource_handle" />. The soundness of this approach depends
              on handle creation messages to not be buffered, but to be
              processed immediately, despite technically belonging to a{" "}
              <R n="logical_channel" />.
            </P>

            <P>
              Senders that do not wish to incorporate complex retransmission
              logic into their implementation can simply issue their{" "}
              <Rs n="resource_handle" />{" "}
              optimistically, and then wait for acknowledging{" "}
              <Rs n="guarantee" /> (i.e., a transistion to the{" "}
              <R n="FullyBound" /> state) before actually working with the{" "}
              <R n="resource_handle">handles</R>.
            </P>
          </Hsection>
        </Hsection>
      </PageTemplate>
    </File>
  </Dir>
);
