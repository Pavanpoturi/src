import { isUndefined } from "lodash";
import TemplateSignature from "../../TemplateSignature";
import TemplatesLogo from "../../TemplatesLogo";
import TemplatesFooter from "../../TemplatesFooter";

export default function Template54CrPCNotice({ fileName, data }) {
  const {
    policeStation = "",
    district = "",
    sectionOfLaw = "",
    currentDate = "",
    hospitalName = "",
    firNumber = "",
    accusedDetails = [],
    escortPC = "",
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
                        verticalAlign: "top",
                        width: 200,
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
                      District/Unit :{" "}
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
                  <tr>
                    <td width="6%">No.</td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ________
                    </td>
                    <td width="30%"> </td>
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Date:{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      {currentDate || "__________"}
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
              To,
              <br />
              The Medical Officer
              <br /> {hospitalName || "__________"} Hospital
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
                      PS
                      <span
                        style={{
                          padding: "0 10px",

                          width: 200,
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      {`- Examination of accused u/s ${sectionOfLaw}`}
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
                      . of PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
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
            <br />
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
                &emsp;&emsp;&emsp;&nbsp; The below mentioned accused who is
                arrested in the above referred case is herewith forwarded under
                the escort of PC
                <span
                  style={{
                    padding: "0 10px",
                    width: 200,
                  }}
                >
                  {" "}
                  {escortPC || "__________"}
                </span>{" "}
                and it is requested to examine him and furnish certificate so as
                to produce him in the Honourable Court.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%" }}>
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
                          {item.accusedCode}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            lineHeight: "20px",
                          }}
                        >
                          {item.completeaccuseddetails}
                        </td>
                      </tr>
                    );
                  })}
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
