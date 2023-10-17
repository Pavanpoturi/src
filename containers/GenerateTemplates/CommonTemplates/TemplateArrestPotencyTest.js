import { isUndefined } from "lodash";
import TemplateSignature from "../TemplateSignature";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import TemplateHeader from "../TemplateHeader";

export default function TemplateArrestPotencyTest({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    currentDate = "",
    hospitalName = "",
    district = "",
    IOName = "",
    accusedDetails = [],
    accusedPersonalDetails = {},
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
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
              }}
            >
              <br />
              To,
              <br />
              The Professor,
              <br />
              Department of Forensic Medicine,
              <br />
              {hospitalName} Medical College
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
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
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
            <td style={{ padding: 3 }}>
              <table>
                <tbody>
                  <tr>
                    <td style={{ fontSize: 16, fontFamily: "Arial" }}>
                      <table>
                        <tbody style={{ fontSize: 16, fontFamily: "Arial" }}>
                          <tr>
                            <td width="3%">
                              <b> Sl.No.</b>{" "}
                            </td>
                            <td width="15%">
                              <b>No of {accusedOrCCL} </b>{" "}
                            </td>
                            <td width='20%'>
                              <b>Name and address of {accusedOrCCL} person</b>{" "}
                            </td>
                          </tr>

                          {accusedDetails.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td
                                  width="3%"
                                  style={{
                                    lineHeight: "20px",
                                    verticalAlign: "top",
                                  }}
                                >
                                  {index + 1}
                                </td>
                                <td
                                  style={{
                                    lineHeight: "20px",
                                    verticalAlign: "top",
                                  }}
                                >
                                  {item.accusedCode || "__________"}
                                </td>
                                <td
                                  style={{
                                    lineHeight: "20px",
                                    textAlign: "justify",
                                    verticalAlign: "top",
                                  }}
                                >
                                  {`${item.accusedName}
                                    ${
                                      item.fatherHusbandGuardianName
                                        ? item.gender === "FeMale"
                                          ? ", d/o : "
                                          : ", s/o : "
                                        : ""
                                    } ${item.fatherHusbandGuardianName}
                                    ${item.gender ? "," : ""} ${item.gender}
                                    ${
                                      accusedPersonalDetails?.personalDetails
                                        ?.age
                                        ? ", Age: "
                                        : ""
                                    } ${
                                    accusedPersonalDetails?.personalDetails?.age
                                  }
                                    ${item.occupation ? ", occ : " : ""} ${
                                    item.occupation
                                  }
                                    ${item.caste ? ", caste : " : ""} ${
                                    item.caste
                                  }
                                    ${
                                      accusedPersonalDetails?.personalDetails
                                        ?.nationality
                                        ? ",   r/o : "
                                        : ""
                                    } ${
                                    accusedPersonalDetails?.personalDetails
                                      ?.nationality
                                  }
                                    ${item.phone ? ", Contact No : " : ""} ${
                                    item.phone
                                  }`}
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
