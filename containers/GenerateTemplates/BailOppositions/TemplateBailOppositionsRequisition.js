import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateBailOppositionsRequisition({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateOfFiling = "",
    district = "",
    currentDate = "",
    accusedName = "",
    personAddress = "",
    courtName = "",
    IOName = "",
    dateOfOpposed = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td style={{ fontSize: 17, fontFamily: "Arial" }}>
                      <br />
                      <b>
                        <u>IN THE COURT OF HONOURABLE {courtName || "  "} .</u>
                      </b>
                      <br />
                      <br />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="6%">No :</td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      __________{" "}
                    </td>
                    <td width="30%"> </td>
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Date:{" "}
                    </td>
                    <td
                      width="40%"
                      style={{
                        textAlign: "left",
                        width: 200,
                        padding: "0 10px",
                      }}
                    >
                      {currentDate || moment().format(DATE_FORMAT)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              Honoured Sir,
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                paddingLeft: "5.5%",
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
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      District{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {district}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      - Petition for grant of bail by accused - Remarks for bail
                      opposition - reg{" "}
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      Cr.No{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {firNumber}
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
                      .PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      .<br />
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
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;It is submitted that in the above
                referred case the accused{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {accusedName} {personAddress}
                </span>
                was arrested on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling ? moment(dateOfFiling).format(DATE_FORMAT) : ""}
                </span>
                and remanded to judicial custody.
              </p>
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp; It further submitted that the accused
                filed petition for grant of bail before the Honourable Court.
              </p>
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;In this connection, it is submitted that
                the bail may rejected for the following reasons.
              </p>
            </td>
          </tr>

          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="4%">1 </td>
                    <td>
                      Test Identification Parade is to be conducted. Requisition
                      is filed and date is yet to be fixed.
                    </td>
                  </tr>
                  <tr>
                    <td> 2 </td>
                    <td>Accused is to be subjected to Potency Test </td>
                  </tr>
                  <tr>
                    <td> 3 </td>
                    <td>Absconding accused are to be arrested</td>
                  </tr>
                  <tr>
                    <td> 4 </td>
                    <td>
                      Custody of the accused is required for the purpose of
                      investigation
                    </td>
                  </tr>
                  <tr>
                    <td> 5 </td>
                    <td>
                      Statement of victim is to be recorded u/s 164 Cr.P.C.{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> 6 </td>
                    <td>PME Report is not received</td>
                  </tr>
                  <tr>
                    <td> 7</td>
                    <td>MC of the injured not received</td>
                  </tr>
                  <tr>
                    <td> 8</td>
                    <td>Copy of Dying Declaration is awaited</td>
                  </tr>
                  <tr>
                    <td> 9</td>
                    <td>
                      Injured is still unconscious and his statement yet to be
                      recorded
                    </td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>
                      If anticipatory bail is granted the accused will hamper
                      the investigation
                    </td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>The accused will threaten the witnesses</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>
                      The accused will not cooperate with the investigation
                    </td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>
                      The victim is apprehending danger to their lives and
                      properties in the hands of the accused.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>14</td>
                    <td>
                      The presence of accused essential for the police for
                      interrogation, recovery of property, potency Test, DNA
                      profile, TIP and arrest of other accused.
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <td
            style={{
              fontSize: 17,
              fontFamily: "Arial",
              textAlign: "justify",
            }}
          >
            <br />
            <p>
              {" "}
              &emsp;&emsp;&emsp;&nbsp;Hence, it is prayed that the Honourable
              court may kindly dismiss the anticipatory bail in the interest of
              the investigation.
            </p>
          </td>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "center",
              }}
            >
              <br />
              BE PLEASED TO CONSIDER.
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td>
              Dated :{" "}
              {dateOfOpposed ? moment(dateOfOpposed).format(DATE_FORMAT) : ""}
            </td>
          </tr>
          <tr>
            <td style={{}}>
              <table
                style={{
                  width: "100%",
                }}
              >
                <TemplateSignature
                  IOName={IOName}
                  policeStation={policeStation}
                  district={district}
                  showurfaith={"2"}
                />
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
