import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplateSignature from "../TemplateSignature";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";

export default function TemplateRequisitionForSpotPME({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateTime = "",
    district = "",
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateOfFiling = "",
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
                    <td width="18%" />
                    <td width="22%">POLICE STATION : </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {policeStation}
                    </td>
                  </tr>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="25%" />
                    <td width="15%">DISTRICT : </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {district}
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">NO. </td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td width="25%" />
                    <td width="15%">DATE: </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {dateTime ? moment(dateTime).format(DATE_FORMAT) : ""}
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
              To,
              <br />
              THE PROFESSOR
              <br />
              FORENSIC SCIENCE DEPARTMENT
              <br />
              GANDHI / OSMANIA MEDICAL COLLEGE
              <br />
              SECUNDERABAD/HYDERABAD
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              Sir,
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
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">Sub:- </td>
                    <td>
                      Request for conducting spot Post-mortem Examination - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">Ref:- </td>
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling}
                </span>{" "}
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
                presented a report / recorded statement wherein the complainant
                stated that
                <div
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantstatememt || "__________"}
                </div>
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;As per the contents of the report
                a case in Cr.No{" "}
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
              </p>{" "}
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;During the course of investigation
                the scene of offence was visited and inquest over the body of
                the deceased held. The body of the deceased is in highly
                decomposed state and it is practically not possible to shift the
                body to the mortuary for conducting Post-mortem Examination.
                Hence, it is requested to arrange for conducting Post-mortem
                Examination at the spot and the PME may please be arranged
                covering:
              </p>
              <br /> <br />
            </td>
          </tr>
          <table style={{ width: "75%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
              <tr>
                <td width="5%"> 1 </td>
                <td>Exact Date and time of death </td>
              </tr>
              <tr>
                <td width="5%"> 2 </td>
                <td>
                  Whether the death is homicidal or suicidal or accidental or
                  natural{" "}
                </td>
              </tr>
              <tr>
                <td width="5%"> 3 </td>
                <td>
                  Whether the injuries are ante-mortem / post-mortem in nature{" "}
                </td>
              </tr>
              <tr>
                <td width="5%"> 4 </td>
                <td>
                  Whether any sexual assault took place (in case of female dead
                  bodies){" "}
                </td>
              </tr>
              <tr>
                <td width="5%"> 5 </td>
                <td>How the injuries on the person could have been caused </td>
              </tr>
            </tbody>
          </table>
          <table style={{ width: "100%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
              <tr>
                <td>
                  Place: {policeStation}
                  <br />
                  Date and time:{" "}
                  {dateTime ? moment(dateTime).format(DATE_TIME_FORMAT) : ""}
                </td>
              </tr>
            </tbody>
          </table>
          <tr>
            <td
              style={{
                float: "right",
                marginLeft: "40%",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table>
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
          <table style={{ width: "100%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
              <tr>
                <td width="5%" style={{ verticalAlign: "top" }}>
                  {" "}
                  Note:{" "}
                </td>
                <td>
                  <small>
                    {" "}
                    1) Wherever required requisition for Team of Doctors may be
                    made
                    <br />
                    2) In case of sexual assaults specific request for
                    preservation of necessary material objects
                    <br />
                    3) In case of highly decomposed or burnt cases request for
                    preservation of skeleton or other bones for DNA profile
                    <br />
                    4) In case of custodial deaths / exchange of fire etc.
                    Request for videographing PME proceedings.
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
