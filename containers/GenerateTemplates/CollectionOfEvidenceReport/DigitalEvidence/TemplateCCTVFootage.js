import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";
import TemplateSignature from "../../TemplateSignature";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateCCTVFootage({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    accusedName = "",
    accusedAge = "",
    caste = "",
    gender = "",
    accussedfather = "",
    occupation = "",
    phone = "",
    complainantname = "",
    complainantaddress = "",
    placeofcctv = "",
    personAddress = "",
    requestedPeriodfromdate = "",
    requestedPeriodtodate = "",
    requestedPeriodfromtime = "",
    requestedPeriodtotime = "",
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
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              To,
              <br /> <br />
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              ></span>
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
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="6%" style={{ verticalAlign: "top" }}>
                      Sub:-{" "}
                    </td>
                    <td>
                      Dist{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {district}
                      </span>{" "}
                      - PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
                      - Request for furnishing CCTV footages in a criminal case
                      with Sec.65B Indian Evidence Act Certificate . - reg
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
                          width: 200,
                        }}
                      >
                        {firNumber}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {sectionOfLaw}{" "}
                      </span>
                      of PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      />{" "}
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
              &emsp;&emsp;&emsp;&emsp;With reference to the subject cited, as
              per complaint of{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {complainantname} {complainantaddress}
              </span>{" "}
              a case under reference has been registered and investigation taken
              up.
              <br />
              <br />
              &emsp;&emsp;&emsp;&emsp;In this connection, the CCTV Footages at{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {placeofcctv}
              </span>{" "}
              point have been zverified and observed that from{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {requestedPeriodfromdate}
              </span>{" "}
              hrs of{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {requestedPeriodfromtime}
              </span>{" "}
              to{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {requestedPeriodtodate}
              </span>{" "}
              hrs of{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {requestedPeriodtotime}
              </span>{" "}
              the CCTV footages recording is every essential as they form part
              of the Evidence. Hence, you are requested to furnish the CCTV
              footages duly recording in a CD / pen drive for the purpose of
              investigation.
              <br />
              <br />
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table
                style={{
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <th>Sl.No.</th>
                    <th>Location of CCTV</th>
                    <th colspan="2">&emsp;&emsp;&emsp;&emsp;From</th>
                    <th colspan="2">&emsp;&emsp;&emsp;&emsp;To</th>
                    <th>Remarks</th>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td width="14%">
                      <b>&emsp;&emsp;Date</b>
                    </td>
                    <td>
                      <b>Hours</b>
                    </td>
                    <td width="14%">
                      <b>&emsp;&emsp;Date</b>
                    </td>
                    <td>
                      <b>Hours</b>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      1.
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {placeofcctv}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {requestedPeriodfromdate}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {requestedPeriodfromtime}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {requestedPeriodtodate}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {requestedPeriodtotime}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    />
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    />
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    />
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    />
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    />
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    />
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    />
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    />
                  </tr>
                </tbody>
              </table>
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;Please furnish the above information on
              priority basis.
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
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <br />
              <br /> <br />
              <h4>
                <u>CERTIFICATE U/SEC 65(B) OF INDIAN EVIDENCE ACT 1872</u>
              </h4>
              <br />
              <b>
                I,{" "}
                {`${accusedName}
                          ${accussedfather ? ", s/o : " : ""} ${
                  accussedfather || ""
                }
                          ${gender ? "," : ""} ${gender || ""}
                          ${accusedAge ? ", Age : " : ""} ${accusedAge || ""}
                          ${occupation ? ", occ : " : ""} ${occupation || ""}
                          ${caste ? ", caste : " : ""} ${caste || ""}
                          ${personAddress ? ", r/o : " : ""} ${
                  personAddress || ""
                }
                          ${phone ? ", Contact No : " : ""} ${phone || ""}
                          `}
              </b>
              do hereby declare and certify as follows..
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
              <ol>
                <li>
                  The computer output in the form of computer printouts /
                  compact disc attached herewith is the correct representation
                  of its original as contained in the computer systems assessed
                  by me for providing the service.
                </li>
                <li>
                  The information contained in the computer printouts / compact
                  disc has been produced from the aforesaid computer systems
                  during the period over which the computer was used regularly.
                </li>
                <li>
                  During the said period information of the kind contained in
                  the computer printouts / compact disc was regularly recorded
                  by the aforesaid computer systems in the ordinary course of
                  the activities.
                </li>
                <li>
                  Throughout the material part of the said period, the computer
                  was operating properly and there have been no such operational
                  problems that affect the accuracy of the electronic record
                  contained in the aforesaid computer systems.
                </li>
              </ol>
              <br />
              <span style={{ paddingLeft: "5%" }}></span>
              <br />
              &emsp;&emsp;&emsp;The matter stated above is correct to the best
              of my knowledge and belief.
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
