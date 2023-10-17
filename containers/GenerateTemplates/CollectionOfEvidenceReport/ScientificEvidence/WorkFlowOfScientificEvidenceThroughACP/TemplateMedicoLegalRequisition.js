import { isUndefined } from "lodash";
import TemplatesFooter from "../../../TemplatesFooter";
import TemplatesLogo from "../../../TemplatesLogo";
import TemplateSignature from "../../../TemplateSignature";
import TemplateHeader from "../../../TemplateHeader";

export default function TemplateMedicoLegalRequisition({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    IOName = "",
  } = !isUndefined(data) && data;

  const physicalStyle = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: 10,
    fontSize: 17,
    fontFamily: "Arial",
    verticalAlign: "top",
  };

  const physicalStyleBody = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "center",
    padding: 10,
    fontSize: 17,
    fontFamily: "Arial",
  };

  const physicalStyleHead = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "center",
    padding: 10,
    fontSize: 17,
    fontFamily: "Arial",
  };

  const leftStyle = {
    fontSize: 17,
    fontFamily: "Arial",
  };

  const rightContentStyle = {
    borderBottom: "1px dashed #262626",
    fontSize: 17,
    fontFamily: "Arial",
  };

  const tableContainer = {
    width: "97%",
    borderCollapse: "separate",
    borderSpacing: "0 0.5em",
  };

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
                currentDate={currentDate}
              />
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
              <br /> To
              <br />
              The Medical Officer,
              <br />
              <br />
              <span>_________________________</span>
              <br />
              <br />
              <span>_________________________</span>
              <br />
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
              <br /> Sir,
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
                paddingLeft: "85px",
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
                      Medico Legal Cases-Examination of injured Person-Reg.
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
                lineHeight: "20px",
                paddingLeft: "85px",
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
                    <td width="100%" style={{ verticalAlign: "top" }}>
                      I am here with sending on injured person by Name
                      <span>____________</span>
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
                    <td width="100%" style={{ verticalAlign: "top" }}>
                      S/o <span>________________</span>
                      Age <span>________________</span>
                      Cast. <span>_________________</span>
                    </td>
                  </tr>
                  <tr>
                    <td width="100%" style={{ verticalAlign: "top" }}>
                      R/o <span>__________</span>
                      Under Self/escort of P.C. No. <span>__________</span>
                      for treatment and necessary certificate.
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%", marginTop: "40px" }}>
                <tbody>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
                  />
                </tbody>
              </table>
            </td>
          </tr>

          <table
            style={{
              ...tableContainer,
              pageBreakBefore: "always",
              marginTop: "40px",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td
                  style={{ ...leftStyle, width: "2%", verticalAlign: "top" }}
                ></td>
                <td style={{ ...leftStyle, width: "90%" }}>
                  MEDICAL OFFICERS REPORT AFTER EXAMINATION OF THE INJURED
                  PERSON
                </td>
              </tr>
            </tbody>
          </table>

          <table style={tableContainer}>
            <tbody>
              <tr style={{ display: "contents" }}>
                <td style={{ ...leftStyle, width: "2%" }}></td>
                <td style={{ ...leftStyle, width: "8%" }}>Name</td>
                <td style={{ ...rightContentStyle, width: "18%" }}></td>
                <td style={{ ...leftStyle, width: "4%" }}>s/o</td>
                <td style={{ ...rightContentStyle, width: "20%" }}></td>
                <td style={{ ...leftStyle, width: "6%" }}>Age</td>
                <td style={{ ...rightContentStyle, width: "7%" }}></td>
              </tr>
            </tbody>
          </table>

          <table style={{ tableContainer }}>
            <tbody>
              <tr style={{ display: "contents" }}>
                <td style={{ ...leftStyle, width: "2%" }}></td>
                <td style={{ ...leftStyle, width: "8%" }}>Caste</td>
                <td style={{ ...rightContentStyle, width: "9%" }}></td>
                <td style={{ ...leftStyle, width: "6%" }}>r/o</td>
                <td style={{ ...rightContentStyle, width: "9%" }}></td>
                <td style={{ ...leftStyle, width: "8%" }}>Admitted on</td>
                <td style={{ ...rightContentStyle, width: "9%" }}></td>
                <td style={{ ...leftStyle, width: "11%" }}>as IP or OP</td>
              </tr>
            </tbody>
          </table>

          <table
            style={{
              marginTop: "5%",
              border: "1px solid #ccc",
              width: "93%",
              marginLeft: "3%",
            }}
          >
            <tbody>
              <tr style={{ ...physicalStyleHead, display: "contents" }}>
                <td style={physicalStyle}>Name of the Injury</td>
                <td style={physicalStyle}>
                  Dimension of each wound in inches viz length etc.
                </td>
                <td style={physicalStyle}>
                  Part of the body on with the injury etc., inflicted
                </td>
                <td style={physicalStyle}>Simple or Grievous</td>
                <td style={physicalStyle}>
                  Weapon with which the injury were inflicted
                </td>
                <td style={physicalStyle}>Age of injury</td>
              </tr>
              <tr style={physicalStyleBody}>
                <td style={physicalStyleBody} />
                <td style={physicalStyleBody} />
                <td style={physicalStyleBody} />
                <td style={physicalStyleBody} />
                <td style={physicalStyleBody} />
                <td style={physicalStyleBody} />
              </tr>
            </tbody>
          </table>
          <br />

          <table
            style={{
              ...tableContainer,
              float: "left",
              width: "100%",
              marginTop: "2%",
              marginLeft: "2.5%",
            }}
          >
            <tbody>
              <>
                <tr style={{ display: "contents" }}>
                  <td style={{ ...leftStyle, width: "1%" }}></td>
                  <td style={{ ...leftStyle, width: "0%" }}>
                    Identification marks:
                  </td>
                </tr>
                <tr>
                  <td style={{ ...leftStyle, width: "2%" }}>(i)</td>
                  <td style={{ ...rightContentStyle, width: "35%" }}></td>
                  <td style={{ width: "80%" }} />
                </tr>
                <tr>
                  <td style={{ ...leftStyle, width: "2%" }}>(ii)</td>
                  <td style={{ ...rightContentStyle, width: "35%" }}></td>
                  <td style={{ width: "80%" }} />
                </tr>
              </>
            </tbody>
          </table>

          <table
            style={{
              ...tableContainer,
              marginTop: 40,
              float: "right",
              width: "100%",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td style={{ ...leftStyle, width: "70%" }} />
                <td style={{ ...leftStyle, width: "30%" }}>Medical Officer</td>
              </tr>
            </tbody>
          </table>

          <table
            style={{
              ...tableContainer,
              float: "right",
              width: "100%",
              marginTop: "2%",
            }}
          >
            <tbody>
              <tr style={{ display: "contents" }}>
                <td style={{ ...leftStyle, width: "70%" }} />
                <td style={{ ...rightContentStyle, width: "90%" }}></td>
              </tr>
            </tbody>
          </table>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
