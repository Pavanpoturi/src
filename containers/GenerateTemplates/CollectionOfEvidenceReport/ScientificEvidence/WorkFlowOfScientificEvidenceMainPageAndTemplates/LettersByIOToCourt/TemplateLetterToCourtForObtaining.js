import { isUndefined } from "lodash";
import TemplatesFooter from "../../../../TemplatesFooter";
import TemplatesLogo from "../../../../TemplatesLogo";
import TemplateSignature from "../../../../TemplateSignature";

export default function TemplateLetterToCourtForObtaining({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateOfFiling = "",
    district = "",
    complainantname = "",
    complainantaddress = "",
    IOName = "",
    nameOfCourt = "",
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
                      Dist{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {district}{" "}
                      </span>{" "}
                      - PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      . - Request obtaining documents from the court of
                      Honourble{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {" "}
                        {nameOfCourt}
                      </span>{" "}
                      - Prayed for - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      1)Cr.No{" "}
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
                      >
                        {policeStation}
                      </span>{" "}
                      .<br />
                      2) O.S.No.{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        __________
                      </span>{" "}
                      of Honourable{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {nameOfCourt}
                      </span>{" "}
                      Court
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
              &emsp;&emsp;&emsp;&nbsp;It is submitted that on{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {dateOfFiling}
              </span>{" "}
              the complainant Sri/Smt{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {complainantname ? complainantname : "__________"}
              </span>{" "}
              r/o{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {complainantaddress ? complainantaddress : "__________"}
              </span>{" "}
              . presented a report at PS{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {policeStation}
              </span>{" "}
              .. stating that{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              ></span>{" "}
              for the alleged offence of Forgery of signatures in executing the
              sale deed.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;As per the contents of the report a case
              in Cr.No{" "}
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
              was registered and investigation was taken up.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp; During the course of investigation it is
              revealed that the Forged documents have been filed in a civil suit
              in the court of Honourable{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {nameOfCourt}
              </span>{" "}
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;Hence it is prayed that the Honourable
              Court may kindly address Honourable Court of
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {nameOfCourt}
              </span>
              to forward the original documents in the following case:
              <br />
              <br />
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table
                style={{
                  width: "75%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">1</td>
                    <td width="40%">Case No. </td>
                    <td>__________</td>
                  </tr>
                  <tr>
                    <td width="10%">2</td>
                    <td>Documents required</td>
                    <td>
                      1.__________
                      <br />
                      2.__________
                      <br />
                      3.__________
                      <br />
                      4.__________
                      <br />
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
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
              <br />
              <br />
              BE PLEASED TO CONSIDER.
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
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
