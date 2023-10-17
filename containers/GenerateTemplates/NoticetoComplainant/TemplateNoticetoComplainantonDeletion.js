import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplateNoticetoComplainantonDeletion({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateOfNotice = "",
    district = "",
    AccusedList = [],
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td />
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%"> FORM - 70 </td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    />
                    <td />
                    <td />
                    <td
                      width="40%"
                      style={{
                        width: 200,
                        padding: "0 10px",
                      }}
                    >
                      Chapter - 28
                    </td>
                  </tr>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td />
                    <td />
                    <td
                      width="40%"
                      style={{
                        width: 200,
                        padding: "0 10px",
                      }}
                    >
                      See Order No.481
                    </td>
                  </tr>
                  <tr>
                    <td width="15%">District/Unit : </td>
                    <td width="20%">{district}</td>
                    <td width="22%" />
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Police station:{" "}
                    </td>
                    <td
                      width="40%"
                      style={{
                        textAlign: "left",
                        width: 200,
                        padding: "0 10px",
                      }}
                    >
                      {policeStation || "__________"}
                    </td>
                  </tr>
                </tbody>
              </table>
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
              <b>
                <u>NOTICE TO THE COMPLAINANT </u>
              </b>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br /> <br /> To,
              <br />
              __________
              <br />
              __________
              <br />
              __________
              <br /> <br />
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
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-{" "}
                    </td>
                    <td>
                      Cr.No{" "}
                      <span
                        style={{
                          padding: "15px",
                          width: "200px",
                        }}
                      >
                        {firNumber}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {sectionOfLaw}
                      </span>
                      . of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
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
              &emsp;&emsp;&emsp;&nbsp;&nbsp;Please take notice that your
              complaint been investigated vide crime under reference. In the
              complaint as many as __________. Accused were cited. However, the
              investigation did not disclose involvement of the following
              accused persons.
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "60%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="30%">
                      <b>Accused Code </b>
                    </td>
                    <td>
                      <b>Accused Name and address</b>
                    </td>
                  </tr>
                  {AccusedList.map((accEle, i) => {
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            padding: "4px",
                            width: "10%",
                          }}
                        >
                          {accEle?.accusedCode || "___________"}
                        </td>
                        <td>
                          {`${accEle.person?.personalDetails?.name} ${
                            accEle.person?.personalDetails?.gender
                              ? `${accEle.person?.personalDetails?.gender} ,`
                              : ""
                          } 
                          ${
                            accEle.person?.presentAddress?.houseNo
                              ? `${accEle.person?.presentAddress?.houseNo} ,`
                              : ""
                          } 
                          ${
                            accEle.person?.presentAddress?.wardColony
                              ? `${accEle.person?.presentAddress?.wardColony} ,`
                              : ""
                          } 
                          ${
                            accEle.person?.presentAddress?.streetRoadNo
                              ? `${accEle.person?.presentAddress?.streetRoadNo} ,`
                              : ""
                          }
                          ${
                            accEle.person?.presentAddress?.district
                              ? `${accEle.person?.presentAddress?.district} `
                              : ""
                          } 
                      `}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <br /> <br />
              &emsp;&emsp;&emsp;&nbsp;&nbsp;Hence the charge sheet has been
              filed against the remaining accused and being submitted in the
              court duly deleting the above accused persons.
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>
                      <br />
                      Date: {dateOfNotice}
                      <br />
                      Received notice
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontSize: 17,
                        fontFamily: "Arial",
                      }}
                    >
                      <br />
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
                  <tr>
                    <td>Signature of complainant</td>
                  </tr>
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
