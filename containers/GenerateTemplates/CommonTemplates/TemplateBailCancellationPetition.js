import { isUndefined, isEmpty } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT, DATE_FORMAT } from "../../FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import { loadState } from "@lib/helpers/localStorage";

export default function TemplateBailCancellationPetition({ fileName, data }) {
  const {
    policeStation = "",
    district = "",
    firNumber = "",
    sectionOfLaw = "",
    IOName = "",
    currentDate = "",
    courtName = "",
    accusedDetails = [],
    selectDaysOfWeek = [],
    selectPeriod = [],
    bailOrderNumber = "",
    bailOrderDate = "",
    accusedPersonalDetails = {},
  } = !isUndefined(data) && data;

  const startDate = moment(selectPeriod[0]);
  const endDate = moment(selectPeriod[1]);
  const totalDays = endDate.diff(startDate, "days");

  const isCCl = data?.accusedPersonalDetails?.personalDetails?.age < 18;
  const accusedOrCCL = isCCl ? "CCL" : "accused";

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
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
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              {" "}
              <br />
              Honoured Sir,
            </td>
          </tr>

          <tr>
            <td
              style={{
                paddingLeft: "5.5%",
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                    textAlign: "justify",
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
                        {" "}
                        {district}{" "}
                      </span>{" "}
                      P S{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      - Grant of Anticipatory bail to {accusedOrCCL} - Violation
                      of conditions of bail - Request for cancellation of
                      bail-Prayed for - reg{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {selectPeriod[0]
                          ? moment(selectPeriod[0]).format(DATE_FORMAT)
                          : "_________"}
                      </span>{" "}
                      -{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {selectPeriod[1]
                          ? moment(selectPeriod[1]).format(DATE_FORMAT)
                          : "_________"}
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
                        {" "}
                        {firNumber}
                      </span>{" "}
                      u/s{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {sectionOfLaw}{" "}
                      </span>
                      . of PS
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {" "}
                        {policeStation}{" "}
                      </span>
                      .<br />
                      Crl.M.P.No.{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {bailOrderNumber || "_________"}
                      </span>{" "}
                      dated:{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {bailOrderDate
                          ? moment(bailOrderDate).format(DATE_FORMAT)
                          : "_________"}
                      </span>
                      of Honourable Court
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
                &emsp;&emsp;&emsp;&nbsp;It is submitted that the Honourable
                court granted anticipatory bail to the following {accusedOrCCL}
                in the above referred case.{" "}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">
                      <b> Sl.No. </b>
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
                            lineHeight: "20px",
                            width: "100px",
                          }}
                        >
                          {" "}
                          1{" "}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            lineHeight: "20px",
                            width: "150px",
                          }}
                        >
                          {item.accusedCode || "________"}{" "}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            lineHeight: "20px",
                            textAlign: "justify",
                            width: "400px",
                          }}
                        >
                          {`${item.accusedName}
                          ${
                            item.fatherHusbandGuardianName
                              ? item.gender === "FeMale"
                                ? ", d/o : "
                                : ", s/o : "
                              : ""
                          } ${item.fatherHusbandGuardianName || ""}
                          ${item.gender ? "," : ""} ${item.gender || ""}
                          ${
                            accusedPersonalDetails?.personalDetails?.age
                              ? ", Age : "
                              : ""
                          } ${
                            accusedPersonalDetails?.personalDetails?.age || ""
                          }
                          ${item.occupation ? ", occ : " : ""} ${
                            item.occupation || ""
                          }
                          ${item.caste ? ", caste : " : ""} ${item.caste || ""}
                          ${item.personAddress ? ", r/o : " : ""} ${
                            item.personAddress || ""
                          }
                          ${item.phone ? ", Contact No : " : ""} ${
                            item.phone || ""
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
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;While granting the Honourable Court
                imposed following conditions on the {accusedOrCCL} to comply
                with.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                    textAlign: "justify",
                  }}
                >
                  <tr>
                    <td width="10%" style={{ verticalAlign: "top" }}>
                      {" "}
                      1{" "}
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      The petitioner shall appear before SHO on every{" "}
                      {isEmpty(selectDaysOfWeek) ? (
                        <span
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        ></span>
                      ) : (
                        selectDaysOfWeek.map((s, i) => {
                          return (
                            <span
                              key={i}
                              style={{
                                padding: "0 10px",
                              }}
                            >
                              {s},
                            </span>
                          );
                        })
                      )}{" "}
                      between{" "}
                      <span
                        style={{
                          padding: "0 5px",
                        }}
                      >
                        {isEmpty(selectPeriod)
                          ? "_________"
                          : moment(selectPeriod[0]).format(DATE_TIME_FORMAT)}
                      </span>{" "}
                      hrs to{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {isEmpty(selectPeriod)
                          ? "_________"
                          : moment(selectPeriod[1]).format(DATE_TIME_FORMAT)}
                      </span>{" "}
                      for a period of{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {isEmpty(selectPeriod) ? "" : totalDays}{" "}
                      </span>
                      days or till the filing of charge sheet which ever is
                      earlier{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> 2 </td>
                    <td>
                      The petitioner shall not directly or indirectly make any
                      inducement , threat or promise to any person acquainted
                      with facts of the case so as to dissuade him from
                      disclosing such facts to the court or to any other police
                      officer{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> 3 </td>
                    <td>
                      The petitioner shall not leave India without the previous
                      permission of the court{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> 4 </td>
                    <td>
                      The petitioner shall furnish the address where he is
                      likely to stay and also his phone number to the PS{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> 5 </td>
                    <td>
                      The petitioner is directed to maintain public peace and
                      tranquillity and not to commit similar offences in present
                      and future{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> 6 </td>
                    <td>
                      The petitioner shall not make any attempt directly or
                      indirectly to tamper with the prosecution witnesses{" "}
                    </td>
                  </tr>
                  <tr>
                    <td> 7</td>
                    <td>
                      The concerned police are also at liberty to keep a close
                      watch over the movements of the {accusedOrCCL} here in his
                      locality in order to deter him from offering any
                      inducement or holding our any threat to the defacto
                      complainant or eye witnesses and other material evidences
                      in this case{" "}
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
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp; However, the {accusedOrCCL} is not
                abiding by the conditions imposed by Honourable Court and
                violated the conditions thereby adversely affecting process of
                investigation.
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;Hence, it is prayed that the Honourable
                court may kindly cancel the bail granted to the {accusedOrCCL}
                in the interest of investigation and justice.
              </p>
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
              <br />
              <br />
              BE PLEASED TO CONSIDER. <br /> <br />
            </td>
          </tr>
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
                        textAlign: "left",
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
                      {currentDate || "_________"}
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td />
                    <td>{policeStation}</td>
                  </tr>
                  <tr>
                    <td />
                    <td />
                    <td>{district}</td>
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
