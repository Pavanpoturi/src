import { isUndefined } from "lodash";
import TemplatesLogo from "../../TemplatesLogo";
import TemplatesFooter from "../../TemplatesFooter";

export default function TemplatePTWarrant({ fileName, data }) {
  const {
    policeStation = "",
    district = "",
    firNumber = "",
    sectionOfLaw = "",
    IOName = "",
    courtName = "",
    jailName = "",
    accusedDetails = [],
    currentDate = "",
    otherPsName = "",
    otherPsCrimeNumber = "",
    osectionOfLaw = "",
    dateOfPTWarrantRequisition = "",
    complainantname = "",
    complainantaddress = "",
    firDate = "",
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
            <td>
              <table>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <th
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      IN THE COURT OF HONOURABLE{" "}
                      {courtName || "___________________"}
                    </th>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <br />
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="6%">NO. </td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td width="30%"> </td>
                    <td
                      width="18%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Date :{" "}
                    </td>
                    <td
                      width="40%"
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br /> Honoured Sir,
            </td>
          </tr>
          <tr>
            <td
              style={{ paddingLeft: "5.5%", fontSize: 17, fontFamily: "Arial" }}
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
                      - Request for issue of Transit warrant - Prayed for
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        __________
                      </span>
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
                &emsp;&emsp;&emsp;&nbsp; It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {firDate || "__________"}
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
                </span>
                presented a report at PS{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                . stating that{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  _________
                </span>
                <br />
              </p>

              <p>
                &emsp;&emsp;&emsp;&nbsp; As per the contents of the report a
                case in Cr.No
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {firNumber}{" "}
                </span>
                u/s
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {sectionOfLaw}{" "}
                </span>
                was registered and investigation was taken up.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;During the course of investigation, the
                scene of offence was visited, statements of witnesses were
                recorded.
              </p>

              <p>
                &emsp;&emsp;&emsp;&nbsp; While the investigation is in progress
                the following {accusedOrCCL} persons were {arrestedORApprended}{" "}
                on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfPTWarrantRequisition}
                </span>{" "}
                by{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {otherPsName}
                </span>{" "}
                Police in their Crime No.
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {otherPsCrimeNumber}
                </span>{" "}
                u/s{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {osectionOfLaw}
                </span>{" "}
                and remanded to judicial custody and they are in{" "}
                {jailName || "__________"} jail.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>
                      <b> Sl.No.</b>{" "}
                    </td>
                    <td>
                      <b>No of {accusedOrCCL} </b>
                    </td>
                    <td>
                      <b>Name and address of {accusedOrCCL} person </b>
                    </td>
                  </tr>
                  {accusedDetails.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "100px",
                          }}
                        >
                          {" "}
                          1{" "}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "150px",
                          }}
                        >
                          {item.accusedCode || "_________"}{" "}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "280px",
                            lineHeight: "20px",
                            textAlign: "justify",
                          }}
                        >
                          {`${item.accusedName || "__________"}
                          ${
                            item.fatherHusbandGuardianName
                              ? item.gender === "MALE"
                                ? ", s/o : "
                                : "d/o"
                              : ""
                          } ${item.fatherHusbandGuardianName}
                          ${item.gender ? "," : ""} ${item.gender}
                          ${
                            accusedPersonalDetails?.personalDetails?.age
                              ? ", Age : "
                              : ""
                          } ${accusedPersonalDetails?.personalDetails?.age}
                          ${item.occupation ? ", occ : " : ""} ${
                            item.occupation
                          }
                          ${item.caste ? ", caste : " : ""} ${item.caste}
                          ${
                            accusedPersonalDetails?.personalDetails?.nationality
                              ? ", r/o : "
                              : ""
                          } ${
                            accusedPersonalDetails?.personalDetails?.nationality
                          }
                          ${item.phone ? ", Contact No : " : ""} ${item.phone}
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
                &emsp;&emsp;&emsp;&nbsp; The above {accusedOrCCL} persons
                confessed to have committed following offences of this police
                station.
              </p>
              <br />{" "}
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">
                      <b> Sl.No. </b>
                    </td>
                    <td>
                      <b>Crime No </b>
                    </td>
                    <td>
                      <b>Section of Law </b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {" "}
                      1{" "}
                    </td>
                    <td
                      style={{
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {firNumber}
                    </td>
                    <td
                      style={{
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {sectionOfLaw}
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
                &emsp;&emsp;&emsp;&nbsp; The above {accusedOrCCL} were remanded
                through Honourable Court of{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {courtName || "__________"}
                </span>{" "}
                and at present the {accusedOrCCL} are lodged in{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {jailName || "__________"}
                </span>{" "}
                Jail. Hence, it is prayed that the Honourable Court may kindly
                issue Transit warrant against the above {accusedOrCCL} for
                regularization of their presence in this case.
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <br />
              Be pleased to consider.
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>
                      <table style={{ width: "100%" }}>
                        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                          <tr>
                            <td width="8%">Place:</td>
                            <td
                              width="65%"
                              style={{
                                padding: "0 10px",
                              }}
                            >
                              {policeStation || "_________"}
                            </td>
                            <td>{IOName}</td>
                          </tr>
                          <tr>
                            <td>Date:</td>
                            <td
                              style={{
                                padding: "0 10px",
                              }}
                            >
                              {dateOfPTWarrantRequisition || "_________"}
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td>{policeStation}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td>{district}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td tyle={{ fontSize: 17, fontFamily: "Arial" }}>
                      Encl: 1) Confessional Statement of other PS
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; 2) Remand
                      report of other PS
                    </td>
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
