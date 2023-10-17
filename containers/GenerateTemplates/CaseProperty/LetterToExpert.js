import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplateHeader from "../TemplateHeader";

export default function LetterToExpert({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateTime = "",
    district = "",
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
                currentDate={
                  dateTime ? moment(dateTime).format(DATE_FORMAT) : ""
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br /> <br />
              To, <br />
              <br />
              __________
              <br />
            </td>
          </tr>
          <br />
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>Sir,</td>
          </tr>
          &nbsp;
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
                      </span>{" "}
                      Request for furnishing Expert report - reg{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      ></span>
                      Memo - reg.
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Ref:-
                    </td>
                    <td>
                      Cr.No
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {firNumber}
                      </span>
                      u/s
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {sectionOfLaw}
                      </span>
                      . of PS
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
          <br />
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
                &nbsp;With reference to the subject cited, the Expert from your
                organization visited the scene of crime in the above referred
                case. In this connection, you are requested to expedite the
                following report
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table
                style={{
                  width: "100%",
                  marginTop: "24px",
                  fontSize: 17,
                  textAlign: "left",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "5%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Sl.No.
                  </th>
                  <th
                    style={{
                      width: "18%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Date of Visit
                  </th>
                  <th
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Visited by
                  </th>
                  <th
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Report requested
                  </th>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    1
                  </td>
                  <td
                    style={{
                      width: "15%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Fire Brigade
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Fire Brigade Report
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    2
                  </td>
                  <td
                    style={{
                      width: "15%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Electrical Engineer
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Electricity Engineer Report as to short circuit
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    3
                  </td>
                  <td
                    style={{
                      width: "15%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    MVI
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    MVI report{" "}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    4
                  </td>
                  <td
                    style={{
                      width: "15%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Inspector of Factories
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Expert Report
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    5
                  </td>
                  <td
                    style={{
                      width: "15%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Inspector of Boilers
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Expert Report
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    6
                  </td>
                  <td
                    style={{
                      width: "15%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Pollution Control Board Inspector
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    PCB report
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    7
                  </td>
                  <td
                    style={{
                      width: "15%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Drugs Control Inspector
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Drugs Controller Report
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    8
                  </td>
                  <td
                    style={{
                      width: "15%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Archaeology Department
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    Expert report as to age of Antiques seized and its value
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    9
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "8px",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    FP Bureau
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    FP Expert Report
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: "10%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    10
                  </td>
                  <td
                    style={{
                      width: "15%",
                      padding: "8px",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    {" "}
                  </td>
                  <td
                    style={{
                      width: "25%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    F S L
                  </td>
                  <td
                    style={{
                      width: "50%",
                      fontSize: 17,
                      textAlign: "left",
                    }}
                  >
                    1) Serology <br />
                    2) Toxology <br />
                    3) Documents <br />
                    4) Computers <br />
                    5) DNA <br />
                    6) Any other
                  </td>
                </tr>
                <tr>
                  <td colSpan="4">
                    * Note: For reminders to FSL the letter is to be addressed
                    by ACP/SDPO
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td>
              <p>Please furnish the report at the earliest.</p>
            </td>
          </tr>
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "55%", fontSize: 17 }}
            >
              Yours faithfully,
              <br />
              <b>INVESTIGATING OFFICER</b>
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "55%", fontSize: 17 }}
            >
              {IOName}
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "55%", fontSize: 17 }}
            >
              {policeStation}
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "55%", fontSize: 17 }}
            >
              {district}
            </td>
          </tr>
          <br />
        </tbody>
      </table>
    </div>
  );
}
