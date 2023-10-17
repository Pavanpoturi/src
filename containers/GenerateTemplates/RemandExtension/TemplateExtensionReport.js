import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateExtensionReport({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    courtName = "",
    district = "",
    accusedName = "",
    IOName = "",
    personAddress = "",
    accusedCode = "",
    extensiondate = "",
    extensiondays = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <b>
                <u>IN THE COURT OF HONOURABLE {courtName || "_____________"}</u>
              </b>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
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
                      - P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      - Request for extension of remand of the accused - Prayed
                      for - reg.{" "}
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      1. Cr.No{" "}
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
                      </span>
                      PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      .<br />
                      <br />
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;It is submitted that the accused{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {accusedCode} {accusedName} {personAddress}
                </span>{" "}
                was arrested in the above referred case and produced before the
                Honourable Court on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {extensiondate || "__________"}
                </span>{" "}
                and the Honourable Court was pleased to remand the accused to
                judicial custody for a period of ( {extensiondays} days ).
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;In this connection, it is submitted that
                the investigation in this case is still pending for the
                following reasons:
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                      width="10%"
                    >
                      1
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Test Identification Parade is to be conducted. Requisition
                      is filed and date is yet to be fixed.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      2
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Accused is to be subjected to Potency Test.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      3
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Absconding accused are to be arrested.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      4
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Custody of the accused is required for the purpose of
                      investigation
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      5
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Statement of victim is to be recorded u/s 164 Cr.P.C.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      6
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      PME Report is not received
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      7
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      MC of the injured not received.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      8
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Copy of Dying Declarationis awaited.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      9
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Injured is still unconscious and his statement yet to be
                      recorded
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp; Hence, it is prayed that the Honourable
                court may kindly extend the remand period of the accused for a
                further period of ( {extensiondays} days ) for the purpose of
                investigation.
              </p>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>BE PLEASED TO CONSIDER.</td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table width="100%">
                <tbody>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
                    showurfaith={2}
                  />
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
