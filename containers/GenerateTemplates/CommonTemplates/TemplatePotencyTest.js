import { isUndefined } from "lodash";
import TemplateHeader from "../TemplateHeader";
import TemplateSignature from "../TemplateSignature";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";

export default function TemplatePotencyTest({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    currentDate = "",
    district = "",
    IOName = "",
    accusedName = "",
    personAddress = "",
    gender = "",
    occupation = "",
    fatherHusbandGuardianName = "",
    accusedAge = "",
    phone = "",
    caste = "",
    cclCode = "",
  } = !isUndefined(data) && data;

  const isCCl = data?.accusedPersonalDetails?.personalDetails?.age < 18;
  const accusedOrCCL = isCCl ? "CCL" : "accused";
  const arrestedORApprended = isCCl ? "Apprehended" : "arrested";

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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              To,
              <br />
              The Professor
              <br />
              Department of Forensic Medicine
              <br />
              _________
              <br />
              Medical College
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>Sir,</td>
          </tr>
          <tr>
            <td
              style={{
                paddingLeft: "5.5%",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table style={{ width: "100%" }}>
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
                      District{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {district}{" "}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      - Potency test of {accusedOrCCL} - Requested.
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      {" "}
                      Cr.No{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {firNumber}{" "}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {sectionOfLaw}{" "}
                      </span>
                      . of PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      .
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;The below mentioned {accusedOrCCL} who
                is {arrestedORApprended} in the above referred case is herewith
                forwarded under the escort and it is requested to conduct
                potency test and furnish report for the purpose of
                investigation.
              </p>

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
              <br />
              <br />
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    textAlign: "justify",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td colSpan="2">
                      NAME AND ADDRESS OF CHILD IN CONFLICT WITH LAW
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="10%"
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                    >
                      {cclCode || "_________"} &nbsp;&nbsp;&nbsp;
                    </td>
                    <td
                      width="80%"
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {`${accusedName}
                          ${
                            fatherHusbandGuardianName
                              ? gender === "FeMale"
                                ? ", d/o : "
                                : ", s/o : "
                              : ""
                          } ${fatherHusbandGuardianName || ""}
                          ${gender ? "," : ""} ${gender || ""}
                          ${accusedAge ? ", Age : " : ""} ${accusedAge || ""}
                          ${occupation ? ", occ : " : ""} ${occupation || ""}
                          ${caste ? ", caste : " : ""} ${caste || ""}
                          ${personAddress ? ", r/o : " : ""} ${
                        personAddress || ""
                      }
                          ${phone ? ", Contact No : " : ""} ${phone || ""}
                          `}
                    </td>
                  </tr>
                  <tr>
                    <td />
                  </tr>
                </tbody>
              </table>
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
