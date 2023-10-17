import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";
import TemplateSignature from "../../TemplateSignature";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateCDRRequisitionFormatToDCP({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    imeiNo = "",
    mobileNo = "",
    nickName = "",
    telecomServiceProvider = "",
    requestedPeriodfrom = "",
    requestedPeriodto = "",
    requesttype = "",
    IOName = "",
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
              <TemplateHeader
                policeStation={policeStation}
                district={district}
                currentDate={currentDate}
                shownum={"2"}
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
              <br /> To,
              <br />
              The DCP/SP
              <br />
              ZONE/DIST
              <br />
            </td>
          </tr>
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
              <b>
                <u>// Through Proper Channel //</u>
              </b>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}> Sir,</td>
          </tr>
          <tr>
            <td
              style={{
                paddingLeft: "5%",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table
                style={{
                  padding: "0 10px",
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
                    <td>Request to furnish Call Data Records (CDRs)-Reg.</td>
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
                      u/sec{" "}
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
              &emsp;&emsp;&emsp;&emsp;With reference to the above subject, it is
              requested to address a letter to the concerned service provider to
              furnish CDRs of below mentioned mobile numbers for further
              investigation of case vide reference cited above.
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
              <table
                style={{
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="5%">Sl.No.</td>
                    <td width="10%">
                      Request type
                      <br />
                      (2)
                    </td>
                    <td width="20%">
                      Mobile No./ IMEI / Tower Data
                      <br />
                      (3)
                    </td>
                    <td width="15%">
                      From Date
                      <br />
                      (4)
                    </td>
                    <td width="15%">
                      To Date
                      <br />
                      (5)
                    </td>
                    <td width="20%">
                      TSP (Telecom Service Provider)
                      <br />
                      (6)
                    </td>
                    <td width="30%">
                      TSP Circle Ex.AP
                      <br />
                      (7)
                    </td>
                  </tr>
                  <tr>
                    <td>1.</td>
                    <td>{requesttype !== "" ? requesttype : "_______"}</td>
                    <td>
                      <b>
                        {imeiNo}
                        <br />
                        {mobileNo}
                      </b>
                    </td>
                    <td>
                      {requestedPeriodfrom !== ""
                        ? requestedPeriodfrom
                        : "______"}
                    </td>
                    <td>
                      {requestedPeriodto !== "" ? requestedPeriodto : "______"}
                    </td>
                    <td>
                      {telecomServiceProvider !== ""
                        ? telecomServiceProvider
                        : "_____"}
                    </td>
                    <td>TS</td>
                  </tr>
                  <tr>
                    <td>
                      Crime No.
                      <br />
                      (8)
                    </td>
                    <td>
                      Year
                      <br />
                      (9)
                    </td>
                    <td>
                      Police Station
                      <br />
                      (10)
                    </td>
                    <td>
                      Section of Law
                      <br />
                      (11)
                    </td>
                    <td>
                      Head of Crime
                      <br />
                      (12)
                    </td>
                    <td>
                      NICK NAME
                      <br />
                      (13)
                    </td>
                    <td>
                      Comments
                      <br />
                      (Brief facts of the case) <br />
                      (14)
                    </td>
                  </tr>
                  <tr>
                    <td>{firNumber}</td>
                    <td>_____</td>
                    <td>{policeStation}</td>
                    <td>{sectionOfLaw}</td>
                    <td>_____</td>
                    <td>{nickName !== "" ? nickName : "_____"}</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ______
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              <b>
                <u>BRIEF FACTS OF THE CASE</u>
              </b>
              <br />
              &emsp;&emsp;&emsp;&emsp;The Subscriber identity has been
              ascertained and it is ensured that person in question is not
              someone whose call details are of a sensitive nature.
              <ol>
                <li>
                  The number is not subscribed in the name of a sitting
                  MP/MLA/MLC & Governor.
                </li>
                <li>
                  Necessary APPROVAL has been taken from CP/DG as the number
                  belongs to Sitting MP/MLA/MLS & GOVERNOR
                </li>
              </ol>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              IO Name -
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                _______
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Designation & Ph No. :
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
              <br />
              Sign :
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
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
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
          <tr>
            <td>
              <br />
              <br />
              <br />
              Encl: format.
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
