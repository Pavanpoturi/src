import { isUndefined, isEmpty } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";

export default function TemplateSec41ACrPCNotice({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    dateOfFiling = "",
    sectionOfLaw = "",
    dateOfIssue = "",
    accusedName = "",
    district = "",
    IOName = "",
    noOfDaysGivenForExplanation = "",
    personAddress = "",
  } = !isUndefined(data) && data;

  const totalDays =
    dateOfIssue &&
    !isEmpty(dateOfIssue) &&
    noOfDaysGivenForExplanation &&
    !isEmpty(noOfDaysGivenForExplanation) &&
    moment(moment(dateOfIssue).format(DATE_FORMAT), DATE_FORMAT).add(
      noOfDaysGivenForExplanation,
      "d"
    );

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <div
                style={{
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                }}
              >
                GOVERNMENT OF TELANGANA
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  marginTop: 15,
                  marginBottom: 10,
                }}
              >
                (POLICE DEPARTMENT)
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={
                  dateOfIssue
                    ? moment(dateOfIssue).format(DATE_FORMAT)
                    : moment().format(DATE_FORMAT)
                }
                shownum={"2"}
              />
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <b style={{ textAlign: "center", padding: "0" }}>
                <u>NOTICE u/s 41A Cr.P.C.</u>
                <br />
              </b>
              <b style={{ textAlign: "center", padding: "0" }}>
                <u>(As per Delhi High Court Judgement in WP (C) 7608/2017</u>
              </b>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;In exercise of the powers conferred
                under sub section (1) of Section 41A of Cr.P.C, hereby inform
                you that during the investigation of FIR case No.{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {firNumber}
                </span>{" "}
                dated{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling ? dateOfFiling : "__________"}
                </span>{" "}
                u/s{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {sectionOfLaw}
                </span>{" "}
                registered at Police Station{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                it is revealed that there are reasonable grounds to question you
                to ascertain facts and circumstances from you, in relation to
                the present investigation. Hence, you are directed to appear
                before me at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  _________{" "}
                </span>{" "}
                am / pm on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {totalDays ? moment(totalDays).format(DATE_FORMAT) : ""}
                </span>{" "}
                at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                police station with proof of identity and residence.
              </p>
              <br />
              <br />{" "}
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;You are directed to comply with all and
                / or the following directions:
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
              }}
            >
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="5%">a) </td>
                    <td>You will not commit any offence in future</td>
                  </tr>
                  <tr>
                    <td> b) </td>
                    <td>
                      You will not tamper with the evidence in the case in any
                      manner whatsoever{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> c) </td>
                    <td>
                      You will not make any threat, inducement, or promise to
                      any person acquainted with the facts of the case as to
                      dissuade him from disclosing, such facts to the court or
                      to the police officer.
                    </td>
                  </tr>
                  <tr>
                    <td> d) </td>
                    <td>
                      You will appear before the Court as and when required /
                      directed
                    </td>
                  </tr>
                  <tr>
                    <td> e) </td>
                    <td>
                      You will join the investigation of the case as and when
                      required and will cooperate in the investigation.{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> f) </td>
                    <td>
                      You will disclose all the facts truthfully without
                      concealing any part relevant for the purpose of
                      investigation to reach to the right conclusion of the case
                      as per law.
                    </td>
                  </tr>
                  <tr>
                    <td> g)</td>
                    <td>
                      You will produce all relevant documents / material
                      required for the purpose of investigation as per law
                    </td>
                  </tr>
                  <tr>
                    <td> h)</td>
                    <td>
                      You will not allow in any manner destruction of any
                      evidence relevant for the purpose of investigation / trial
                      of the case.
                    </td>
                  </tr>
                  <tr>
                    <td> i)</td>
                    <td>
                      You will inform whenever you change your address and phone
                      number
                    </td>
                  </tr>
                  <tr>
                    <td>j)</td>
                    <td>
                      You shall not leave the country without permission of the
                      IO / court
                    </td>
                  </tr>
                  <tr>
                    <td>k)</td>
                    <td>
                      You shall not leave headquarters without the intimation
                      and permission of the IO
                    </td>
                  </tr>
                  <tr>
                    <td>l)</td>
                    <td>
                      Any other conditions documents, which may be imposed by
                      the Investigating officer / SHO as per the facts of the
                      case.
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <br />
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;Failure to attend / comply with the
                terms of the Notice, can render you liable for arrest under
                Section 41A(3) and (4) of Cr.P.C.
              </p>
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
                    showurfaith={"2"}
                  />
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    {" "}
                    <td> To </td>{" "}
                  </tr>
                  <tr>
                    {" "}
                    <td style={{ textAlign: "justify" }}>
                      {accusedName} {personAddress}
                    </td>{" "}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
