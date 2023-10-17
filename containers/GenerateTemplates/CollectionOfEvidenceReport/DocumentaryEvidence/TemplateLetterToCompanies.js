import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";
import TemplateSignature from "../../TemplateSignature";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateLetterToCompanies({ fileName, data }) {
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
        <tbody>
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
              M/s
              <span>__________</span>
              <br />
              <span>__________</span>
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
                    <td style={{ fontSize: 17, fontFamily: "Arial" }}>
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
                      M/s.
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      ></span>{" "}
                      furnishing of documents - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td style={{ fontSize: 17, fontFamily: "Arial" }}>
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
              &emsp;&emsp;&emsp;&nbsp;With reference to the subject cited, as
              per complaint of{" "}
              <span
                style={{
                  padding: "0 10px",
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
              &emsp;&emsp;&emsp;&nbsp;In this connection, the following
              documents are essential for the purpose of investigation. Hence it
              is requested to arrange for the following documents.
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
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="15%">
                      <strong>Sl. No.</strong>
                    </td>
                    <td>
                      <strong>Description</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Company Registration form</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Memorandum of Association </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Articles of Association</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Names and addresses of Directors </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Balance sheet </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>IT returns</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>GST Returns</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>Bank Details</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>Cheque book Signatories</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>Partnership deed</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>Any other (specify)</td>
                  </tr>
                </tbody>
              </table>
              <span style={{ paddingLeft: "5%" }}></span>
              <br />
              &emsp;&emsp;&emsp; Please furnish the above information on
              priority basis.
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
