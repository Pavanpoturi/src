import { isUndefined } from "lodash";
import TemplatesFooter from "../../../../TemplatesFooter";
import TemplatesLogo from "../../../../TemplatesLogo";

export default function TemplateCourtLetterForReturnOfFS({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    nameOfCourt = "",
    acknowledgementNo = "",
    dateOfAcknowledgement = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>
              <br />
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
          <br />
          <br />
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              Present:
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%"> Dis.No. :</td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      __________
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
                      {currentDate || "__________"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "center",
              }}
            >
              <label style={{ textAlign: "center", float: "center" }}>
                <b>
                  <u>O R D E R</u>
                </b>
              </label>
              <br />
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
              To
              <br />
              Forensic Science Labs
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ paddingLeft: "5.5%" }}>
              <table
                style={{
                  width: "100%",
                }}
              >
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    textAlign: "justify",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      Division{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {district}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      – Forwarding of material objects for analysis – Request
                      for return of case property - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      1) Cr.No{" "}
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
                      PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      ></span>{" "}
                      .<br />
                      2) FSL Ackn No.{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {acknowledgementNo}
                      </span>{" "}
                      date{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {dateOfAcknowledgement}
                      </span>{" "}
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
              &emsp;&emsp;&emsp;&nbsp;The material objects in the above referred
              case were forwarded to FSL for analysis and report. The same were
              acknowledged vide reference 2nd cited and report was also
              furnished.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;In this connection, you are directed to
              arrange for return of the case property throught the bearer whose
              signature is attested.
              <br />
              <br />
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              be pleased to consider <br />
              <br />
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{
                width: "25%",
                float: "right",
                textAlign: "right",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <br />
              <b>MAGISTRATE</b>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              (<span style={{ paddingLeft: "5%" }}></span>)
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              PC<span style={{ paddingLeft: "5%" }}></span>Attested
            </td>
            <br />
            <br />
          </tr>
          <tr>
            <td
              style={{
                width: "25%",
                float: "right",
                textAlign: "right",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <br />
              <b>MAGISTRATE</b>
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
