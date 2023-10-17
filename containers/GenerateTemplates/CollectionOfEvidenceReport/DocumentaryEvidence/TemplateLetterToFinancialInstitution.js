import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";
import TemplateSignature from "../../TemplateSignature";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateLetterToFinancialInstitution({
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
              <br /> To,
              <br />
              The Branch Manager,
              <br />
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
              Bank
              <br />
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
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
                      - Request for furnishing documents relating to Account No.
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      belonging to{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      - reg
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
              <table style={{}}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%" style={{ verticalAlign: "top" }}>
                      <b>Sl.No.</b>
                    </td>
                    <td>
                      <b>Description</b>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Account Opening form </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      Photo / ID proofs submitted at the time of account opening
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Number of signatories </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Sample Signature card </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      Bank Statement for the period from
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      to
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
                  <tr>
                    <td>6</td>
                    <td>Freeze the account until further orders.</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>
                      Furnish original cheque Nos
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      dt
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      for the purpose of forwarding to handwriting expert
                    </td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>
                      Clarify as to cheque no.
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      dated
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>
                      on clearance sent to which bank account .
                    </td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>Standard Cheques </td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>Loan Application</td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>11</td>
                    <td>
                      Documents submitted with loan <br />
                      1)Property documents
                      <br />
                      2)Income Proof
                      <br />
                      3) Income Tax Returns
                      <br />
                      4)Verification Report <br />
                      5) Amount of loan sanctioned
                      <br />
                      6) Instalments paid upto which date
                      <br />
                      7) What is the outstanding loan
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>Bank Internal Audit Report</td>
                  </tr>

                  <tr>
                    <td>13</td>
                    <td>
                      Details of employees / outsourcing employees (please
                      specify)
                    </td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td>Bank guarantee</td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td>Letter of Credit</td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td>Demand Drafts</td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp; Please furnish the above information on
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
