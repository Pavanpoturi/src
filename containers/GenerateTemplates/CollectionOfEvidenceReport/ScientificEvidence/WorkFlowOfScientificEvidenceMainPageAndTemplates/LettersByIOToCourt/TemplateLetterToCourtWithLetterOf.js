import { isUndefined } from "lodash";
import TemplatesFooter from "../../../../TemplatesFooter";
import TemplatesLogo from "../../../../TemplatesLogo";
import TemplateSignature from "../../../../TemplateSignature";

export default function TemplateLetterToCourtWithLetterOf({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    nameOfCourt = "",
    IOName = "",
    district = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      <b>
                        {" "}
                        IN THE COURT OF HONOURABLE{" "}
                        {nameOfCourt || "___________________"}
                      </b>
                    </td>
                    <br />
                  </tr>
                </tbody>
              </table>
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
                paddingLeft: "5.5%",
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
              }}
            >
              <table
                style={{
                  width: "100%",
                }}
              >
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
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      Forwarding of sample signatures, thumb impressions
                      together with Registers of SRO to FSL for handwriting
                      expert opinion -Prayed for - reg
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
                          width: 200,
                        }}
                      >
                        {firNumber}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {sectionOfLaw}
                      </span>{" "}
                      of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
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
              &emsp;&emsp;&emsp;&nbsp;The facts of the case are that in the
              above referred crime, the handwritings, thumb impressions of the
              complainant were collected in open court.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;It is further submitted that sample
              signature and thumb impression register of the concerned documents
              were also deposited in the court.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;In this connection, a letter of advice has
              been prepared and it is prayed that the Honourable court may
              kindly forward the Sample Signature and Thumb impression register
              together with the handwritings and thumb impressions of collected
              in the open court to the Forensic Science Labs for the purpose of
              comparison by handwriting expert and opinion. <br />
              <br />
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{
                width: "25%",
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <br />
              BE PLEASED TO CONSIDER.
              <br />
            </td>
          </tr>
          <br />
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table width="100%">
                <tbody>
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Place:
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
              <br />
              Date and time :
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table width="100%">
                <tbody>
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Encl:
              <br />
              <span style={{ paddingLeft: "5%" }} />
              1. Letter of advice
              <br />
              <span style={{ paddingLeft: "5%" }} />
              <br />
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
