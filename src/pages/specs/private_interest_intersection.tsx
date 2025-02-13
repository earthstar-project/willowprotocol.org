import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import {
  Code,
  Em,
  Img,
  Li,
  P,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
  Ul,
} from "macromania-html";
import { ResolveAsset } from "macromania-assets";
import { Marginale, Sidenote } from "macromania-marginalia";
import { Hsection } from "macromania-hsection";
import { Def, R, Rb, Rs } from "macromania-defref";
import {
  AccessStruct,
  ChoiceType,
  DefFunction,
  DefType,
  DefValue,
  SliceType,
  StructDef,
  TupleType,
} from "macromania-rustic";
import { M } from "macromania-katex";
import { PreviewScope } from "macromania-previews";
import { Pseudocode } from "macromania-pseudocode";

export const private_interest_intersection = (
  <Dir name="pii">
    <File name="index.html">
      <PageTemplate
        htmlTitle="WGPS Confidentiality"
        headingId="private_interest_intersection"
        heading={"WGPS Confidentiality"}
        toc
      >
        <P>
          Data synchronisation via the <R n="sync">WGPS</R>{" "}
          faces a dilemma: on the one hand, we want to opportunistically
          synchronise data with as many peers as we can, on the other hand, we
          want to preserve confidentiality of all data that is guarded by{" "}
          <R n="access_control">access control</R>. This document presents in
          detail how we balance those needs.
        </P>

        <P>
          Data confidentiality goes much further than withholding{" "}
          <Rs n="Payload" />. We need to protect <Rs n="NamespaceId" />,{" "}
          <Rs n="SubspaceId" />, and{" "}
          <Rs n="Path" />. To make things more difficult, we want to keep these
          confidential even when an{" "}
          <AE href="https://en.wikipedia.org/wiki/Man-in-the-middle_attack">
            active eavesdropper
          </AE>{" "}
          listens in on a sync connection. We want to allow for synchronisation
          with anonymous peers, but we cannot protect against active
          eavesdropping in those sessions. Hence, we need to be careful which
          information we disclose even to a peer who has read access to some
          certain data.
        </P>

        <P>
          <Rs n="NamespaceId" />, <Rs n="SubspaceId" />, and <Rs n="Path" />
          {" "}
          do not only occur as part of authenticated{" "}
          <Rs n="Entry" />, but they also inform which data two peers want to
          sync in the first place. While two peers discover their common
          interests, we do not want to leak any of these either. To simplify our
          presentation, we introduce some definitions around these concepts,
          starting with the notion of a <R n="PrivateInterest" />.
        </P>

        <Pseudocode n="pi_definition">
          <StructDef
            comment={
              <>
                Confidential data that relates to determining the{" "}
                <Rs n="AreaOfInterest" />{" "}
                that peers might be interested in synchronising.
              </>
            }
            id={["PrivateInterest", "PrivateInterest", "PrivateInterests"]}
            fields={[
              [
                ["namespace_id", "pi_ns"],
                <R n="NamespaceId" />,
              ],
              {
                commented: {
                  comment: (
                    <>
                      <R n="area_any" /> denotes interest in <Em>all</Em>{" "}
                      <Rs n="subspace" /> of the <R n="namespace" />.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["subspace_id", "pi_ss"],
                    <ChoiceType
                      types={[<R n="SubspaceId" />, <R n="area_any" />]}
                    />,
                  ],
                },
              },
              [
                ["path", "pi_path"],
                <R n="Path" />,
              ],
            ]}
          />
        </Pseudocode>

        <PreviewScope>
          <P>
            Let <DefValue n="pi1" r="p1" /> and <DefValue n="pi2" r="p2" /> be
            {" "}
            <Rs n="PrivateInterest" />.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            We say <R n="pi1" /> is{" "}
            <Def n="pi_more_specific" r="more specific" /> than <R n="pi2" /> if
          </P>
          <Ul>
            <Li>
              <Code>
                <AccessStruct field="pi_ns">
                  <R n="pi1" />
                </AccessStruct>{" "}
                =={" "}
                <AccessStruct field="pi_ns">
                  <R n="pi2" />
                </AccessStruct>
              </Code>, and
            </Li>
            <Li>
              <Code>
                <AccessStruct field="pi_ss">
                  <R n="pi2" />
                </AccessStruct>{" "}
                == <R n="area_any" />
              </Code>{" "}
              or{" "}
              <Code>
                <AccessStruct field="pi_ss">
                  <R n="pi1" />
                </AccessStruct>{" "}
                =={" "}
                <AccessStruct field="pi_ss">
                  <R n="pi2" />
                </AccessStruct>
              </Code>, and
            </Li>
            <Li>
              <AccessStruct field="pi_path">
                <R n="pi1" />
              </AccessStruct>{" "}
              is an <R n="path_extension" /> of{" "}
              <AccessStruct field="pi_ss">
                <R n="pi2" />
              </AccessStruct>.
            </Li>
          </Ul>
        </PreviewScope>

        <PreviewScope>
          <P>
            We say that <R n="pi1" /> is{" "}
            <Def n="pi_strictly_more_specific" r="strictly more specific" />
            {" "}
            than <R n="pi2" /> if <R n="pi1" /> is <R n="pi_more_specific" />
            {" "}
            than <R n="pi2" /> and they are not equal.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            We say that <R n="pi1" /> is{" "}
            <Def n="pi_less_specific" r="less specific" /> than <R n="pi2" /> if
            {" "}
            <R n="pi2" /> is <R n="pi_more_specific" /> than <R n="pi1" />.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            We say that <R n="pi1" /> and <R n="pi2" /> are{" "}
            <Def n="pi_comparable" r="comparable" /> if <R n="pi1" /> is{" "}
            <R n="pi_more_specific" /> than <R n="pi2" />or <R n="pi2" /> is
            {" "}
            <R n="pi_more_specific" /> than <R n="pi1" />.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            We say that <R n="pi1" />{" "}
            <Def n="pi_include_entry" r="include">includes</Def> an{" "}
            <R n="Entry" /> <DefValue n="pi_e" r="e" /> if
          </P>
          <Ul>
            <Li>
              <Code>
                <AccessStruct field="pi_ns">
                  <R n="pi1" />
                </AccessStruct>{" "}
                =={" "}
                <AccessStruct field="entry_namespace_id">
                  <R n="pi_e" />
                </AccessStruct>
              </Code>, and
            </Li>
            <Li>
              <Code>
                <AccessStruct field="pi_ss">
                  <R n="pi1" />
                </AccessStruct>{" "}
                == <R n="area_any" />
              </Code>{" "}
              or{" "}
              <Code>
                <AccessStruct field="pi_ss">
                  <R n="pi1" />
                </AccessStruct>{" "}
                =={" "}
                <AccessStruct field="entry_subspace_id">
                  <R n="pi_e" />
                </AccessStruct>
              </Code>, and
            </Li>
            <Li>
              <AccessStruct field="pi_path">
                <R n="pi1" />
              </AccessStruct>{" "}
              is a <R n="path_prefix" /> of{" "}
              <AccessStruct field="entry_path">
                <R n="pi_e" />
              </AccessStruct>.
            </Li>
          </Ul>
        </PreviewScope>

        <PreviewScope>
          <P>
            We say that <R n="pi1" /> and <R n="pi2" /> are{" "}
            <Def n="pi_disjoint" r="disjoint" /> there can be no <R n="Entry" />
            {" "}
            which is <R n="pi_include_entry">included</R> in both <R n="pi1" />
            {" "}
            and <R n="pi2" />.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            We say that <R n="pi1" /> and <R n="pi2" /> are{" "}
            <Def n="pi_awkward" r="awkward" /> if they are neither{" "}
            <R n="pi_comparable" /> nor{" "}
            <R n="pi_disjoint" />. This is the case if and only if one of them
            has <R n="pi_ss" /> <R n="area_any" /> and a <R n="pi_path" />{" "}
            <DefValue n="pi_awkward_p" r="p" />, and the other has a
            non-<R n="area_any" /> <R n="pi_ss" /> and a <R n="pi_path" />{" "}
            which is a strict <R n="path_prefix" /> of <R n="pi_awkward_p" />.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            We say that <R n="pi1" />{" "}
            <Def n="pi_include_area" r="include">includes</Def> an{" "}
            <R n="Area" /> <DefValue n="pi_a" r="a" /> if
          </P>
          <Ul>
            <Li>
              <Code>
                <AccessStruct field="pi_ss">
                  <R n="pi1" />
                </AccessStruct>{" "}
                == <R n="area_any" />
              </Code>{" "}
              or{" "}
              <Code>
                <AccessStruct field="pi_ss">
                  <R n="pi1" />
                </AccessStruct>{" "}
                =={" "}
                <AccessStruct field="AreaSubspace">
                  <R n="pi_a" />
                </AccessStruct>
              </Code>, and
            </Li>
            <Li>
              <AccessStruct field="pi_path">
                <R n="pi1" />
              </AccessStruct>{" "}
              is a <R n="path_prefix" /> of{" "}
              <AccessStruct field="AreaPath">
                <R n="pi_a" />
              </AccessStruct>.
            </Li>
          </Ul>
        </PreviewScope>

        <Hsection n="wgps_security_model" title="Security Model">
          <P>
            We can now lay out out the security model of the WGPS: which data
            does the WGPS expose in which scenarios? We do not have formal
            proofs for any of these claims, these are merely our design goals
            (which we believe to have achieved).
          </P>

          <P>
            Throughout the following, Alfie and Betty are honest peers, Muriarty
            is a malicious peer who may deviate arbitrarily from the WGPS, and
            Epson is an active eavesdropper on the networking layer who can
            read, modify, drop, or insert arbitrary bytes on a WGPS
            communication channel.
          </P>

          <Hsection n="wgps_threat_model" title="Threat Model">
            <P>
              We consider two primary scenarios:
            </P>

            <Ul>
              <Li>
                Alfie and Muriarty sync, and Muriarty tries to glean as much
                information from/about Alfie as possible.
              </Li>
              <Li>
                Alfie and Betty sync without knowing any long-term secrets of
                each other, and Epson attacks the session and tries to glean as
                much information from/about Alfie and Betty.
              </Li>
            </Ul>

            <P>
              Note that Epson can simulate a Muriarty, or they could even be the
              same person. Epson is only interesting for cases where Alfie syncs
              with somebody who has more knowledge than Epson, so we do not
              consider the cases where Muriarty and Epson collaborate.
            </P>

            <P>
              If Alfie and Betty know longterm public keys, they can exclude an
              active attacker during the handshake. If only one of them knows a
              longterm secret of the other, Epson is less powerful than in the
              setting where neither knows a longterm secret of the other; hence
              we only analyze the prior scenario.
            </P>
          </Hsection>

          <Hsection n="pii_scope" title="Scope">
            <P>
              We now list the information we wish to keep confidential. We group
              it in four levels, based on which kind of peer or attacker is
              allowed to glean which information.
              <Alj>
                Worst table styling ever, please send help. Might need multiple
                rows instead of nested lists?
              </Alj>
            </P>

            <PreviewScope>
              <Table>
                <Tbody>
                  <Tr>
                    <Th scope="row">
                      <Def n="l0" r="L0" />
                    </Th>
                    <Td>
                      <Ul>
                        <Li>
                          <Rs n="Payload" /> of actual <Rs n="Entry" />
                        </Li>
                        <Li>
                          <Rs n="entry_namespace_id" />,{" "}
                          <Rs n="entry_subspace_id" />, <Rs n="entry_path" />
                          {" "}
                          of actual <Rs n="Entry" />
                        </Li>
                        <Li>
                          <Rs n="entry_timestamp" />,{" "}
                          <Rs n="entry_payload_length" />,{" "}
                          <Rs n="entry_payload_digest" /> of actual{" "}
                          <Rs n="Entry" />
                        </Li>
                      </Ul>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th scope="row">
                      <Def n="l1" r="L1" />
                    </Th>
                    <Td>
                      <Ul>
                        <Li>
                          <Rs n="NamespaceId" />, <Rs n="SubspaceId" />,{" "}
                          <Rs n="Path" /> occuring in a{" "}
                          <R n="read_capability" />{" "}
                          that Alfie or Betty transmits.
                        </Li>
                        <Li>
                          <Rs n="NamespaceId" />, <Rs n="SubspaceId" />,{" "}
                          <Rs n="Path" /> in which Alfie or Betty is interested.
                        </Li>
                      </Ul>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th scope="row">
                      <Def n="l2" r="L2" />
                    </Th>
                    <Td>
                      <Ul>
                        <Li>
                          Information occuring in a <R n="read_capability" />
                          {" "}
                          that Alfie or Betty transmits which is neither{" "}
                          <Rs n="NamespaceId" />, <Rs n="SubspaceId" />, nor
                          {" "}
                          <Rs n="Path" />. Examples include:
                          <Ul>
                            <Li>
                              <Rs n="Timestamp" />,
                            </Li>
                            <Li>
                              The <Rs n="dss_pk" /> and <Rs n="dss_signature" />
                              {" "}
                              involved in delegating{" "}
                              <Rs n="read_capability" />. Those{" "}
                              <Rs n="dss_pk" /> which correspond to{" "}
                              <Rs n="NamespaceId" />, <Rs n="SubspaceId" />{" "}
                              are excluded (they belong to <R n="l1" />).
                            </Li>
                          </Ul>
                        </Li>
                      </Ul>
                    </Td>
                  </Tr>

                  <Tr>
                    <Th scope="row">
                      <Def n="l3" r="L3" />
                    </Th>
                    <Td>
                      <Ul>
                        <Li>
                          Fingerprintable session behaviour, such as resource
                          control, error handling, etc. Virtually impossible to
                          list exhaustively.
                        </Li>
                      </Ul>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </PreviewScope>

            <P>
              We consider fingerprinting, tracking, and deanonymisation based on
              information from <R n="l3" /> to be out of scope of this document.
            </P>
          </Hsection>

          <Hsection n="goals" title="Goals">
            <P>
              We now describe which kind of information can be learned by which
              kind of attacker. A rough summary:
            </P>
            <Ul>
              <Li>
                With a valid{" "}
                <R n="read_capability" />, you can access all corresponding
                information (<R n="l0" /> and below). This is a feature.
              </Li>
              <Li>
                If you know or guess a <R n="PrivateInterest" />{" "}
                without holding a corresponding{" "}
                <R n="read_capability" />, you can access information at{" "}
                <R n="l1" /> and below.
              </Li>
              <Li>
                An active eavesdropper can access everything at <R n="l2" />
                {" "}
                without holding a corresponding <R n="read_capability" />.
              </Li>
            </Ul>

            <P>
              Consequently, <Rs n="NamespaceId" />, <Rs n="SubspaceId" />, and
              {" "}
              <Rs n="Path" />{" "}
              that cannot be guessed are never leaked by using the WGPS.
              Conversely, attackers <Em>can</Em> confirm their guesses about
              {" "}
              <Rs n="PrivateInterest" />{" "}
              to some degree. Hence, it is important to keep{" "}
              <Rs n="NamespaceId" />, <Rs n="SubspaceId" />, and <Rs n="Path" />
              {" "}
              unguessable by introducing sufficient entropy.
            </P>

            <Hsection
              n="sync_with_muriarty"
              title="Syncing with Muriarty"
              shortTitle="Muriarty"
            >
              <PreviewScope>
                <P>
                  When Alfie syncs with a malicious peer Muriarty, Muriarty is
                  able to glean the following information:
                </P>

                <Ul>
                  <Li>
                    If Muriarty has a <R n="read_capability" /> for some{" "}
                    <R n="PrivateInterest" /> <DefValue n="ppi_m_p0" r="p" />:
                    <Ul>
                      <Li>
                        Muriarty can learn all information from <R n="l0" />
                        {" "}
                        and below that pertains to the intersection of{" "}
                        <R n="ppi_m_p0" /> and any <R n="PrivateInterest" />
                        {" "}
                        of Alfie. Muriarty is <Em>allowed</Em>{" "}
                        to access this information, there is nothing malicious
                        about this.
                      </Li>
                    </Ul>
                  </Li>

                  <Li>
                    If Muriarty knows or guesses a <R n="PrivateInterest" />
                    {" "}
                    <DefValue n="ppi_m_p1" r="p" /> which he does not have a
                    {" "}
                    <R n="read_capability" /> for:
                    <Ul>
                      <Li>
                        Muriarty can learn the number of{" "}
                        <R n="pi_more_specific" /> <Rs n="PrivateInterest" />
                        {" "}
                        of Alfie, but nothing else about them.
                      </Li>
                      <Li>
                        Muriarty can learn all <R n="pi_less_specific" />{" "}
                        <Rs n="PrivateInterest" />{" "}
                        of Alfie, as well as all information of <R n="l1" />
                        {" "}
                        and below for those <Rs n="PrivateInterest" />.
                      </Li>
                      <Li>
                        For every <R n="PrivateInterest" />{" "}
                        <DefValue n="ppi_m_pa" r="p_alfie" /> of Alfie such that
                        {" "}
                        <R n="ppi_m_p1" /> and <R n="ppi_m_pa" /> are{" "}
                        <R n="pi_awkward" />:
                        <Ul>
                          <Li>
                            If{" "}
                            <Code>
                              <AccessStruct field="pi_ss">
                                <R n="ppi_m_pa" />
                              </AccessStruct>{" "}
                              == <R n="area_any" />
                            </Code>, Muriarty learns Alfie’s{" "}
                            <R n="subspace_capability" /> for the{" "}
                            <R n="namespace" />.
                          </Li>
                          <Li>
                            Otherwise:
                            <Ul>
                              <Li>
                                If Muriarty has a <R n="subspace_capability" />
                                {" "}
                                for the{" "}
                                <R n="namespace" />, he learns all information
                                of <R n="l1" /> and below pertaining to{" "}
                                <R n="ppi_m_pa" />.
                              </Li>
                              <Li>
                                If Muriarty does not have a{" "}
                                <R n="subspace_capability" /> for the{" "}
                                <R n="namespace" />, he learns that{" "}
                                <R n="ppi_m_pa" />{" "}
                                exists, but nothing more about it.
                              </Li>
                            </Ul>
                          </Li>
                        </Ul>
                      </Li>
                    </Ul>
                  </Li>
                </Ul>
              </PreviewScope>
            </Hsection>

            <Hsection
              n="sync_with_epson"
              title="Syncing Attacked By Epson"
              shortTitle="Epson"
            >
              <PreviewScope>
                <P>
                  If Alfie syncs with an honest peer Betty, but an active
                  attacker Epson can read and manipulate the communication
                  channel, that attacker can glean the following information:
                </P>
                <Ul>
                  <Li>
                    Epson can glean anything that a Muriarty can glean.
                  </Li>
                  <Li>
                    If Betty has a <R n="read_capability" /> for some{" "}
                    <R n="PrivateInterest" />{" "}
                    <DefValue n="ppi_e_p0" r="p" />, which Epson has no
                    knowledge about:
                    <Ul>
                      <Li>
                        For every intersecting <R n="PrivateInterest" />{" "}
                        of Alfie’s, Epson can glean the information at{" "}
                        <R n="l2" /> and below.
                      </Li>
                    </Ul>
                  </Li>
                  <Li>
                    If Betty has a <R n="read_capability" /> for some{" "}
                    <R n="PrivateInterest" />{" "}
                    <DefValue n="ppi_e_p1" r="p" />, and Epson knows{" "}
                    <R n="ppi_e_p1" /> but does not have a{" "}
                    <R n="read_capability" /> for it:
                    <Ul>
                      <Li>
                        Epson can learn exactly the same information as if Epson
                        was a Muriarty who guessed <R n="ppi_e_p1" />{" "}
                        but does not have a <R n="read_capability" /> for it.
                      </Li>
                    </Ul>
                  </Li>
                </Ul>
              </PreviewScope>
            </Hsection>
          </Hsection>
        </Hsection>

        <Pseudocode n="ppi_definition">
          <StructDef
            comment={
              <>
                TODO
              </>
            }
            id={[
              "PersonalPrivateInterest",
              "PersonalPrivateInterest",
              "PersonalPrivateInterests",
            ]}
            fields={[
              {
                commented: {
                  comment: (
                    <>
                      TODO
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["private_interest", "ppi_pi"],
                    <R n="PrivateInterest" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      TODO
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["user_key", "ppi_user"],
                    <R n="UserPublicKey" />,
                  ],
                },
              },
            ]}
          />
        </Pseudocode>

        <Pseudocode n="mc_subspace_cap_def">
          <StructDef
            comment={
              <>
                A capability that certifies read access to arbitrary{" "}
                <Rs n="SubspaceId" /> at some unspecified <R n="Path" />.
              </>
            }
            id={[
              "McSubspaceCapability",
              "McSubspaceCapability",
              "McSubspaceCapabilities",
            ]}
            fields={[
              {
                commented: {
                  comment: (
                    <>
                      The <R n="namespace" /> for which this grants access.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["namespace_key", "subspace_cap_namespace"],
                    <R n="NamespacePublicKey" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      The user to whom this initially grants access (the
                      starting point for any further{" "}
                      <R n="subspace_cap_delegations" />).
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["user_key", "subspace_cap_user"],
                    <R n="UserPublicKey" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      Authorisation of the <R n="subspace_cap_user" /> by the
                      {" "}
                      <R n="subspace_cap_namespace" />.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    [
                      "initial_authorisation",
                      "subspace_cap_initial_authorisation",
                    ],
                    <R n="NamespaceSignature" />,
                  ],
                },
              },
              {
                commented: {
                  comment: (
                    <>
                      Successive authorisations of new <Rs n="UserPublicKey" />.
                    </>
                  ),
                  dedicatedLine: true,
                  segment: [
                    ["delegations", "subspace_cap_delegations"],
                    <SliceType>
                      <TupleType
                        types={[
                          <R n="UserPublicKey" />,
                          <R n="UserSignature" />,
                        ]}
                      />
                    </SliceType>,
                  ],
                },
              },
            ]}
          />
        </Pseudocode>
      </PageTemplate>
    </File>
  </Dir>
);
