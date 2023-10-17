import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";
import TemplateSignature from "../../TemplateSignature";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateLetterToTahsildarForPahaniCopies({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    complainantname = "",
    complainantaddress = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div
      id={fileName}
      style={{ width: "95%", margin: "0 auto", fontFamily: "Arial" }}
    >
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              To,
              <br />
              THE TAHSILDAR, <br />
              __________
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}> Sir,</td>
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
                      Dist
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {district}{" "}
                      </span>
                      - PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      - Request for furnishing pahani copies - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      Cr.No
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {firNumber}{" "}
                      </span>
                      u/s
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {sectionOfLaw}{" "}
                      </span>
                      of PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
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
              &emsp;&emsp;&emsp;&nbsp;With reference to the subject cited, as
              per complaint of{" "}
              <span
                style={{
                  padding: "0 10px",
                  borderBottom: "1px dashed #ccc",
                  width: 200,
                }}
              >
                {complainantname
                  ? complainantname + " " + complainantaddress
                  : "__________"}{" "}
              </span>
              a case under reference has been registered and investigation taken
              up.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;In this connection, the pahani copies of
              the land in sy.no.
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
              are required for the purpose of investigation.
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
              &emsp;&emsp;&emsp;&nbsp;Hence, it is requested to arrange for the
              pahani copies of following land:
              <br />
              <br />
              <table
                style={{
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">
                      <b>Sl. No.</b>
                    </td>
                    <td>
                      <b>Survey No of land and place</b>
                    </td>
                    <td>
                      <b>Pahani copies required for the years</b>
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">1</td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <TemplateSignature
                    IOName={IOName}
                    policeStation={policeStation}
                    district={district}
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
