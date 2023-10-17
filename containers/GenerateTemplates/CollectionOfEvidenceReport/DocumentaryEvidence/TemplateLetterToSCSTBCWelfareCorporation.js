import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";
import TemplateSignature from "../../TemplateSignature";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateLetterToSCSTBCWelfareCorporation({
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
      style={{ width: "95%", margin: "0 auto", fontFamily: "Arial " }}
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={currentDate}
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br /> To,
              <br />
              The Chairman <br />
              BC/SC/ST CORPORATION <br />
              GOVERNMENT OF TELANGANA <br />
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
                      Scholarship frauds by the
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        ____________
                      </span>
                      College / School - Request for certain documentary
                      evidence - reg
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
              up wherein it was alleged that fraud took place on scholarships.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;In this connection, the following
              documents are essential for the purpose of investigation. Hence it
              is requested to arrange for the following documents.
              <br />
              <br />
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table
                style={{
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">
                      <b>Sl.No.</b>
                    </td>
                    <td>
                      <b>Description</b>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Application for Scholarship</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Documents submitted with application</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Certificate of College/School</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Amount of scholarship sanctioned</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Amount sent to which account</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Acknowledgment of receipt of scholarship by student</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>
                      Whether the alleged fraud came to notice of Corporation.
                      If so, any enquiry conducted
                    </td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>Any other documentary evidence </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp; Please furnish the above information on
              priority basis.
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
