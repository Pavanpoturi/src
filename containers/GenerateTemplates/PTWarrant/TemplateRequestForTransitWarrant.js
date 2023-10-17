import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT, DATE_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateRequestForTransitWarrant({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedName = "",
    dateTimeOfArrest = "",
    courtName = "",
    personAddress = "",
    IOName = "",
    district = "",
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateOfFiling = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <b>
                        IN THE COURT OF HONOURABLE {"  "}{" "}
                        {courtName || "__________"}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br />
              Honoured Sir,
              <br />
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
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      - Request for issue of Transit warrant - Prayed for{" "}
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
                      . of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling ? moment(dateOfFiling).format(DATE_FORMAT) : ""}
                </span>{" "}
                the complainant Sri/Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantname || "_________"}
                </span>
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantaddress || "_________"}
                </span>{" "}
                presented a report at PS{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>
                stating that{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantstatememt || "__________"}
                </span>
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp; As per the contents of the report
                a case in Cr.No.{" "}
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
                was registered and investigation was taken up.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;During the course of
                investigation, the scene of offence was visited, statements of
                witnesses were recorded.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;While the investigation is in
                progress the following accused persons were arrested on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateTimeOfArrest
                    ? moment(dateTimeOfArrest).format(DATE_TIME_FORMAT)
                    : ""}
                </span>{" "}
                by{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                Police in their Crime No.
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
                and remanded to judicial custody and they are in jail.
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">
                      <b> Sl.No.</b>{" "}
                    </td>
                    <td>
                      <b>Name and address of accused person</b>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="10%"
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {" "}
                      1{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "250px",
                      }}
                    >
                      {accusedName || ""} {personAddress || ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;The above accused persons
                confessed to have committed following offences of this police
                station.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">
                      <b>Sl.No.</b>{" "}
                    </td>
                    <td>
                      <b>Crime No </b>{" "}
                    </td>
                    <td>
                      <b>Section of Law </b>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {" "}
                      1{" "}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {firNumber}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: "200px",
                      }}
                    >
                      {sectionOfLaw}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <td style={{ fontSize: 17, fontFamily: "Arial" }}>
            <p>
              &emsp;&emsp;&emsp;&nbsp;&nbsp;The above accused were remanded
              through Honourable Court of{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: "200px",
                }}
              >
                {courtName}
              </span>{" "}
              and at present the accused are lodged in{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: "200px",
                }}
              ></span>{" "}
              Jail. Hence, it is prayed that the Honourable Court may kindly
              issue Transit warrant against the above accused for regularization
              of their presence in this case.
            </p>
          </td>
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              BE PLEASED TO CONSIDER.
            </td>
          </tr>
          <tr>
            <table style={{ width: "100%" }}>
              <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                <tr>
                  <td width="50%">
                    <table>
                      <tbody>
                        <tr>
                          <td>Date</td>
                          <td
                            style={{
                              padding: "0 10px",
                              width: "200px",
                            }}
                          >
                            {dateTimeOfArrest
                              ? moment(dateTimeOfArrest).format(DATE_FORMAT)
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td>Place</td>
                          <td
                            style={{
                              padding: "0 10px",
                              width: "200px",
                            }}
                          >
                            {policeStation}
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
          </tr>
        </tbody>
      </table>
    </div>
  );
}
