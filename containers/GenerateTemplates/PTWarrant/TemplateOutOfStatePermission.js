import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT, TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";

export default function TemplateOutOfStatePermission({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedName = "",
    dateTimeOfArrest = "",
    courtName = "",
    personAddress = "",
    selectTeamToGoOut = [],
    district = "",
    IOName = "",
    complainantname = "",
    dateOfFiling = "",
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
                currentDate={
                  dateTimeOfArrest
                    ? moment(dateTimeOfArrest).format(DATE_FORMAT)
                    : moment().format(DATE_FORMAT)
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              {" "}
              To,
              <br />
              The Commissioner of Police / Superintendent of Police
              <br />
              __________ <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "center",
              }}
            >
              <b>/through proper channel/</b>
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
                      - Request for out of State Permission for the purpose of
                      investigation - Submission - reg
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
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;I submit that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling ? moment(dateOfFiling).format(DATE_FORMAT) : ""}
                </span>{" "}
                at{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling ? moment(dateOfFiling).format(TIME_FORMAT) : ""}
                </span>{" "}
                hrs as per complaint of Sri / Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantname || "_________"}
                </span>
                a case under reference has been registered and investigation
                taken up.
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
                    ? moment(dateTimeOfArrest).format(DATE_FORMAT)
                    : ""}
                </span>{" "}
                by{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                ></span>{" "}
                Police in their Crime No{" "}
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
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
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
                    <td width="10%">
                      <b> Sl.No.</b>{" "}
                    </td>
                    <td>
                      <b>Name and address of accused person </b>
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
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
              }}
            >
              <p>
                The above accused persons confessed to have committed following
                offences of this police station.
              </p>
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
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="10%">
                      <b> Sl.No. </b>
                    </td>
                    <td>
                      <b>Crime No </b>
                    </td>
                    <td>
                      <b>Section of Law</b>{" "}
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
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
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
                />{" "}
                Jail.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Prisoners Transit Warrant has been
                obtained from the Honourable Court for bringing the above
                accused and produced before our Honourable Court for
                regularization of presence of the accused.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;Hence, it is essential to go out
                of State to bring the above accused and it is requested to
                accord sanction for Out of State Permission for the following
                team to go out of State for bringing the accused and to produce
                before the Honourable Court.
              </p>
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
                    <td width="10%">
                      <b> Sl.No.</b>{" "}
                    </td>
                    <td>
                      {" "}
                      <b>Name </b>
                    </td>
                    <td>
                      <b>Police Station </b>
                    </td>
                  </tr>
                  {selectTeamToGoOut.map((s, i) => {
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {i + 1}{" "}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {s}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {" "}
                        </td>
                      </tr>
                    );
                  })}
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
