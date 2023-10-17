import { isUndefined, isEmpty } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateReproductionRequisition({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    userDate = "",
    district = "",
    accusedDetails = [],
    courtName = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <b>
                <u>IN THE COURT OF HONOURABLE {courtName || "__________"}</u>
              </b>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
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
                        {district}
                      </span>
                      - P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      -Reproduction of accused after Police custody - reg.{" "}
                    </td>
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
                      </span>{" "}
                      PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      . of Honourable court
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp; It is submitted that the
                Honourable court was pleased to grant police custody of
                following accused in the crime under reference 1<sup>st</sup>{" "}
                cited vide reference 2<sup>nd</sup> cited.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      <b>Sl.No.</b>
                    </td>
                    <td width="18%">
                      <b>No of accused</b>
                    </td>
                    <td>
                      <b>Name and address of accused person</b>
                    </td>
                  </tr>
                  {!isEmpty(accusedDetails) &&
                    accusedDetails.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td
                            style={{
                              padding: "0 10px",
                            }}
                          >
                            {i + 1}
                          </td>
                          {item?.accusedCode ? (
                            <td
                              style={{
                                padding: "0 10px",
                              }}
                            >
                              {item?.accusedCode}
                            </td>
                          ) : (
                            <td
                              style={{
                                padding: "0 10px",
                              }}
                            />
                          )}
                          <td
                            style={{
                              padding: "0 10px",
                            }}
                          >{`${item?.accusedName} ${
                            item?.accusedAddress ? "," : ""
                          } ${item?.accusedAddress}`}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;It is submitted after taking
                police custody the accused the following investigation carried
                out.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      1
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                      width="60%"
                    ></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      2
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                      width="60%"
                    ></td>
                  </tr>
                </tbody>
              </table>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;The police custody period of the
                accused is completed. Hence, the above accused is /are herewith
                produced after police custody period after medical examination
                and it is prayed that the Honourable court may kindly remand the
                accused to judicial custody.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>BE PLEASED TO CONSIDER.</td>
          </tr>
          <tr>
            <td>
              <table>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>Place:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {policeStation}
                    </td>
                  </tr>
                  <tr>
                    <td>Date:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {userDate
                        ? moment(userDate).format(DATE_FORMAT)
                        : moment().format(DATE_FORMAT)}
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
              }}
            >
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
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
    </div>
  );
}
