import { isUndefined, isEmpty } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";

export default function TemplatePoliceCustodyRequisition({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedDetails = [],
    userDate = "",
    district = "",
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateOfFiling = "",
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
                <u>
                  IN THE COURT OF HONOURABLE{"  "}
                  {courtName || "__________"}
                </u>
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
                      - Request for Police custody of the accused - Prayed for.{" "}
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {dateOfFiling}
                </span>
                the complainant Sri/Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantname || "__________"}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {complainantaddress || "__________"}
                </span>{" "}
                . presented a report at PS{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                . stating that <br />
                <div
                  style={{
                    padding: "0 10px",
                  }}
                >
                  {complainantstatememt || "__________"}
                </div>
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;As per the contents of the report
                a case in Cr.No
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
                was registered and investigation was taken up.{" "}
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;During the course of
                investigation, the scene of offence was visited, statements of
                witnesses were recorded.
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;On
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                the following accused arrested and produced before the
                Honourable Court wherefrom he/they were remanded to judicial
                custody
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
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
                    <td
                      style={{
                        padding: "0 10px",
                        width: "18%",
                      }}
                    >
                      <b>No of accused</b>
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
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
                &emsp;&emsp;&emsp;&nbsp;&nbsp;In this connection, it is
                submitted that the custody of the accused is/are required for
                the purpose of following aspects of investigation.
              </p>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                      width="5%"
                    >
                      1
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      Re-construction of scene at the instance of accused.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      2
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Recovery of case property within state / out of state.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      3
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      Arrest of other accused at the instance of accused.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      4
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      To subject the accused to potency test.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      5
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      To subject the accused to DNA profile.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      6
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      To further interrogate the accused in the case.
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      7
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      To further probe into the case.
                    </td>
                  </tr>
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
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Hence it is prayed that the
                Honourable Court may kindly grant ( days) of Police custody of
                investigation to enable the police to complete the above aspects
                of investigation.
              </p>{" "}
              <br />
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
      <TemplatesFooter />
    </div>
  );
}
