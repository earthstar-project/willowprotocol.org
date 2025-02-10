import { Dir, File } from "macromania-outfs";
import { AE, Alj, Curly, NoWrap, Path } from "../../macros.tsx";
import { PageTemplate } from "../../pageTemplate.tsx";
import { Code, Img, Li, P, Ul } from "macromania-html";
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
        htmlTitle="Private Interest Intersection"
        headingId="private_interest_intersection"
        heading={"Private Interest Intersection"}
        toc
      >
        <PreviewScope>
          <P>
            <Alj>TODO</Alj>
            A <R n="PrivateInterest"/> <Def n="pi_include" r="include">includes</Def> an <R n="Area"/> bla.
          </P>
        </PreviewScope>

        <Pseudocode n="pi_definition">
          <StructDef
            comment={
              <>
                TODO
              </>
            }
            id={["PrivateInterest", "PrivateInterest", "PrivateInterests"]}
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
                    ["namespace_id", "pi_ns"],
                    <R n="NamespaceId" />,
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
                    ["subspace_id", "pi_ss"],
                    <ChoiceType
                      types={[<R n="SubspaceId" />, <R n="area_any" />]}
                    />,
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
                    ["path", "pi_path"],
                    <R n="Path" />,
                  ],
                },
              },
            ]}
          />

          <StructDef
            comment={
              <>
                TODO
              </>
            }
            id={["PersonalPrivateInterest", "PersonalPrivateInterest", "PersonalPrivateInterests"]}
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
                      The user to whom this initially grants access (the starting point for any further <R n="subspace_cap_delegations"/>).
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
