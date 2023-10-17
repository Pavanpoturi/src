import { isUndefined } from "lodash";
import TemplatesLogo from "../../TemplatesLogo";
import TemplatesFooter from "../../TemplatesFooter";
import TemplateSignature from "../../TemplateSignature";

export default function Template50CrPCNotice({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    dateArrest = "",
    accusedDetails = [],
    timeOfArrest = "",
    IOName = "",
    courtName = "",
  } = !isUndefined(data) && data;

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
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="30%" />
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                        verticalAlign: "top",
                      }}
                    >
                      Police Station :{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                        verticalAlign: "top",
                      }}
                    >
                      {policeStation || "__________"}
                    </td>
                  </tr>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="30%" />
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                        verticalAlign: "top",
                      }}
                    >
                      District / Unit :{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                        verticalAlign: "top",
                      }}
                    >
                      {district || "__________"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "center",
                padding: 3,
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <h5>
                <u> NOTICE u/s 50 Cr.P.C.</u>
              </h5>
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
                &emsp;&emsp;&emsp;&nbsp; This is to inform you, that you are
                arrested in Cr.No.
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {firNumber || "__________"}{" "}
                </span>
                u/s
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {sectionOfLaw || "__________"}{" "}
                </span>
                of police station
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {policeStation || "__________"}{" "}
                </span>
                on (date)
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {dateArrest || "__________"}{" "}
                </span>
                and at
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {timeOfArrest || "__________"}.{" "}
                </span>
                Further, you are being produced before the Honourable Court of
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {courtName || "_________"}
                </span>
              </p>
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
                    showurfaith={2}
                  />
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: 3 }}>
              <table>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>To</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "justify" }}>
                      <table>
                        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                          {accusedDetails.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td
                                  style={{
                                    padding: "0 10px",
                                    verticalAlign: "top",
                                    lineHeight: "20px",
                                  }}
                                >
                                  {item.accusedCode || "_________"}
                                </td>
                                <td
                                  style={{
                                    padding: "0 10px",
                                    lineHeight: "20px",
                                  }}
                                >
                                  {item.completeaccuseddetails || ""}
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td
                              style={{
                                padding: "0 10px",
                              }}
                            >
                              <br />
                              <br />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
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
