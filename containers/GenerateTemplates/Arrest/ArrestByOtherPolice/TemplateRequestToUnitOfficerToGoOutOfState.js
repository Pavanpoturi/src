import { isUndefined } from "lodash";
import TemplatesLogo from "../../TemplatesLogo";
import TemplatesFooter from "../../TemplatesFooter";
import TemplateSignature from "../../TemplateSignature";
import TemplateHeader from "../../TemplateHeader";

export default function TemplateRequestToUnitOfficerToGoOutOfState({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    district = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedDetails = [],
    courtName = "",
    jailName = "",
    selectTeamToGoOutOfState = [],
    currentDate = "",
    otherPsName = "",
    otherPsCrimeNumber = "",
    dateOfPTWarrantRequisition = "",
    complainantname = "",
    complainantaddress = "",
    firDate = "",
    IOName = "",
    accusedPersonalDetails = {},
  } = !isUndefined(data) && data;

  const isCCl = data?.accusedPersonalDetails?.personalDetails?.age < 18;
  const accusedOrCCL = isCCl ? "CCL" : "accused";
  const arrestedORApprended = isCCl ? "Apprehended" : "arrested";

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <b>
                {" "}
                GOVERNMENT OF TELANGANA
                <br /> (POLICE DEPARTMENT)
                <br />
              </b>
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
              {" "}
              To,
              <br />
              The Commissioner of Police / Superintendent of Police
              <br />
              <span
                style={{
                  width: "200px",
                }}
              >
                {district}
              </span>
              <br />
              <p style={{ padding: "0 10px", textAlign: "center" }}>
                /through proper channel/
              </p>
            </td>
          </tr>
          <tr>
            <td> Sir,</td>
          </tr>
          <tr>
            <td
              style={{ paddingLeft: "5.5%", fontSize: 17, fontFamily: "Arial" }}
            >
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    lineHeight: "20px",
                    fontSize: 17,
                    fontFamily: "Arial",
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
                      <span
                        style={{
                          padding: "0 10px",

                          width: "200px",
                        }}
                      ></span>
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
              <br />{" "}
              <p>
                &emsp;&emsp;&emsp;&nbsp; I submit that on{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {firDate || "_________"}
                </span>{" "}
                as per complaint of Sri / Smt{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {complainantname || "_________"}{" "}
                  {complainantaddress || "_________"}
                </span>
                a case under reference has been registered and investigation
                taken up.
              </p>
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp;While the investigation is in progress
                the following {accusedOrCCL} persons were {arrestedORApprended}{" "}
                on{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {dateOfPTWarrantRequisition || "_________"}
                </span>{" "}
                by{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {otherPsName || "_________"}
                </span>{" "}
                Police in their Crime No{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {otherPsCrimeNumber || "_________"}
                </span>{" "}
                u/s{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {sectionOfLaw || "_________"}
                </span>{" "}
                and remanded to judicial custody and they are in jail.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
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
                      <b>Name and address of {accusedOrCCL} person</b>{" "}
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
                          {item.accusedCode || "__________"}{" "}
                        </td>
                        <td
                          style={{
                            verticalAlign: "top",
                            width: "280px",
                            lineHeight: "20px",
                            textAlign: "justify",
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
                          ${item.gender ? "," : ""} ${item.gender}
                          ${
                            accusedPersonalDetails?.personalDetails
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
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp; The above {accusedOrCCL} persons
                confessed to have committed following offences of this police
                station.
              </p>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>
                      <b> Sl.No.</b>{" "}
                    </td>
                    <td>
                      <b>Crime No</b>{" "}
                    </td>
                    <td>
                      <b>Section of Law </b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "200px",
                      }}
                    >
                      {" "}
                      1{" "}
                    </td>
                    <td
                      style={{
                        width: "200px",
                      }}
                    >
                      {firNumber}
                    </td>
                    <td
                      style={{
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
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;The above {accusedOrCCL} were remanded
                through Honourable Court of{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {courtName}
                </span>{" "}
                and at present the {accusedOrCCL} are lodged in{" "}
                <span
                  style={{
                    padding: "0 10px",

                    width: "200px",
                  }}
                >
                  {jailName}
                </span>{" "}
                Jail. Prisoners Transit Warrant has been obtained from the
                Honourable Court for bringing the above {accusedOrCCL} and
                produced before our Honourable Court for regularization of
                presence of the {accusedOrCCL}. Hence, it is essential to go out
                of State to bring the above {accusedOrCCL} and it is requested
                to accord sanction for Out of State Permission for the following
                team to go out of State for bringing the {accusedOrCCL} and to
                produce before the Honourable Court.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <br />
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>
                      {" "}
                      <b>Sl.No.</b>{" "}
                    </td>
                    <td>
                      <b> Name</b>
                    </td>
                    <td>
                      <b>Designation</b>
                    </td>
                    <td>
                      <b> Police Station </b>
                    </td>
                  </tr>
                  {selectTeamToGoOutOfState.map((name, i) => {
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            width: "200px",
                          }}
                        >
                          {i + 1}{" "}
                        </td>
                        <td
                          style={{
                            width: "200px",
                          }}
                        >
                          {name}{" "}
                        </td>
                        <td
                          style={{
                            width: "200px",
                          }}
                        >
                          _________{" "}
                        </td>
                        <td
                          style={{
                            width: "200px",
                          }}
                        >
                          {policeStation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
