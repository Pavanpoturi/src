import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";

export default function TemplateApprehensionMemo({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    currentDate = "",
    accusedName = "",
    personAddress = "",
    district = "",
    IOName = "",
    cclCode = "",
    gender = "",
    occupation = "",
    fatherHusbandGuardianName = "",
    caste = "",
    religion = "",
    apprDate = "",
    apprtime = "",
    permanentpersonAddress = "",
    dateOfBirth = "",
    bringingDate = "",
    bringingDatetime = "",
    accusedPersonalDetails = {},
  } = !isUndefined(data) && data;

  const isCCl = data?.accusedPersonalDetails?.personalDetails?.age < 18;
  const accusedOrCCL = isCCl ? "CCL" : "accused";

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }} cellspacing="1" cellpadding="1">
        <tbody
          style={{ fontSize: 17, fontFamily: "Arial", lineHeight: "20px" }}
        >
          <tr>
            <td width="85%" style={{ textAlign: "center" }}>
              <h5>
                <u>APPREHENSION MEMO</u>
                <br />
              </h5>
            </td>
            <td colspan="3">
              TSPM Order 569,77
              <br />
              Form 68
              <br />
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{ width: "100%" }} cellspacing="1" cellpadding="1">
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <br />
          <tr>
            <td />
            <td />
            <td style={{ verticalAlign: "top" }}>Dist:</td>
            <td style={{ padding: "0 10px", width: 200, verticalAlign: "top" }}>
              {" "}
              {district}
            </td>
            <td style={{ verticalAlign: "top" }}> PS:</td>
            <td style={{ padding: "0 10px", width: 200, verticalAlign: "top" }}>
              {policeStation}
            </td>
            <td style={{ width: "12%" }}> Year:</td>
            <td style={{ width: "9%" }}> FIR NO:</td>
            <td style={{ width: "8%" }}>{firNumber}</td>
            <td> </td>
            <td> </td>
            <td>Date: </td>
            <td style={{ width: "16%" }}>{currentDate}</td>
          </tr>
        </tbody>
      </table>
      <table style={{ width: "100%" }} cellspacing="1" cellpadding="1">
        <tbody
          style={{ fontSize: 17, fontFamily: "Arial", lineHeight: "20px" }}
        >
          <tr>
            <td
              style={{
                verticalAlign: "top",
                width: "4%",
              }}
            >
              1.{" "}
            </td>
            <td width="45%">Alphanumeric Code of the {accusedOrCCL}: </td>
            <td>
              <b>JCL - </b>
            </td>
            <td colspan="2">{cclCode}</td>
            <td />
            <td colspan="4" />
          </tr>
          <tr>
            <td />
            <td>Persons B1 for 10 person and so on) </td>
            <td colspan="8" />
          </tr>
          <tr>
            <td>2.</td>
            <td> Date & Time of apprehension/Surrender: Date:</td>
            <td style={{ width: "15%" }}>{apprDate} </td>
            <td style={{ width: "20%" }}>
              {" "}
              Time: {"    "} {apprtime}
            </td>
            <td> G.D No </td>
            <td />
            <td />
          </tr>
          <tr>
            <td>3.</td>
            <td>Name of the Court (if Surrendered)</td>
            <td colspan="8" />
          </tr>
          <tr>
            <td>4.</td>
            <td>Acts and Section:</td>
            <td colspan="8"> {sectionOfLaw} </td>
          </tr>
          <tr>
            <td>5.</td>
            <td colspan="7">
              Apprehension and released on bail / produced before Juvenile court
            </td>
            <td colspan="2" />
          </tr>
          <tr>
            <td>6.</td>
            <td colspan="9">Particulars of the Child in Conflict with Law :</td>
          </tr>
          <tr>
            <td />
            <td colspan="9">
              <table width="100%" cellspacing="1" cellpadding="1">
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td>(i)</td>
                    <td>Name:</td>
                    <td colspan="5">
                      {accusedPersonalDetails?.personalDetails?.name}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>(ii)</td>
                    <td>Father`s / Husband`s name:</td>
                    <td colspan="5">
                      {
                        accusedPersonalDetails?.personalDetails
                          ?.fatherHusbandGuardianName
                      }{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>(iii)</td>
                    <td> First Alias:</td>
                    <td colspan="5" />
                  </tr>
                  <tr>
                    <td>(iv) </td>
                    <td>Second Alias:</td>
                    <td colspan="5" />
                  </tr>
                  <tr>
                    <td>(v)</td>
                    <td> Other Alias:</td>
                    <td colspan="5" />
                  </tr>
                  <tr>
                    <td>(vi) </td>
                    <td>Nationality:</td>
                    <td colspan="5">
                      {accusedPersonalDetails?.personalDetails?.nationality}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>(vii)</td>
                    <td>Religion:</td>
                    <td>{religion}</td>
                    <td style={{ width: "20%" }}>(vii). Caste/Tribe</td>
                    <td>{caste}</td>
                    <td style={{ width: "20%" }}>(ix) S.C/S.T -</td>
                    <td />
                  </tr>
                  <tr>
                    <td>(x) </td>
                    <td>Present Address with Dist& PS</td>
                    <td colspan="5"> {personAddress}</td>
                  </tr>
                  <tr>
                    <td />
                    <td>Dist</td>
                    <td colspan="2" />
                    <td>P.S</td>
                    <td colspan="2" />
                  </tr>
                  <tr>
                    <td>(xi) </td>
                    <td>Permanent Address with Dist& PS.</td>
                    <td> {permanentpersonAddress}</td>
                  </tr>
                  <tr>
                    <td />
                    <td>Dist</td>
                    <td colspan="2" />
                    <td>P.S</td>
                    <td colspan="2" />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>7.</td>
            <td colspan="4">
              Injuries, cause of injuries and physical condition of the JCL
              person:
            </td>
            <td colspan="5" />
          </tr>
          <tr>
            <td>8.</td>
            <td colspan="5">
              The JCL, after being informed of the grounds of apprehension and
              his legal right. Was duly taken into
            </td>
            <td colspan="4" />
          </tr>
          <tr>
            <td />
            <td>Custody on</td>
            <td>(date) at</td>
            <td>{bringingDate}</td>
            <td style={{ width: "12%" }}>(hours) at</td>
            <td>{bringingDatetime}</td>
          </tr>
          <tr>
            <td />
            <td colspan="7">
              The Following article(s) was /were found on physical search
              conducted on the person of the apprehension and Were taken into
              possession for which for which a receipt was given to the JCL.{" "}
            </td>
            <td colspan="2" />
          </tr>
          <tr>
            <td />
            <td>1. __________</td>
            <td>2. __________</td>
            <td>3. __________</td>
          </tr>
          <tr>
            <td />
            <td>4. __________</td>
            <td>5. __________</td>
            <td>6. __________</td>
          </tr>
          <tr>
            <td />
            <td colspan="6">
              <b>
                <i>
                  Necessary wearing appealers were left on the JCL for the sake
                  of human dignity and body protection.
                </i>
              </b>
            </td>
            <td colspan="3" />
          </tr>
          <tr>
            <td />
            <td colspan="6">
              <b>
                <i>
                  The JCL was cautioned to keep himself/herself covered for
                  purpose of identification ( to struck off if not applicable).
                </i>
              </b>
            </td>
            <td colspan="3" />
          </tr>
          <tr>
            <td></td>
            <td colspan="5">
              If any article found, `NIL`` may be indicated in the blank space
              provided below:
              <br />
            </td>
            <td colspan="4" />
          </tr>
          <tr>
            <td>9.</td>
            <td colspan="9">
              Physical feature, peculiarities and other details of JCL.
            </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="9">
              <table width="100%" cellspacing="1" cellpadding="1">
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td>Sex</td>
                    <td style={{ width: "20%" }}>Date/year of birth</td>
                    <td>Build</td>
                    <td>Height in Cms</td>
                    <td style={{ width: "20%" }}>Complexion</td>
                    <td style={{ width: "25%" }}>Identification Mark(S).</td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {gender}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {dateOfBirth}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colspan="9">(for Modus Operandi Offence only) </td>
                  </tr>
                  <tr>
                    <td>Deformaties Peculiarities</td>
                    <td>Teeth</td>
                    <td>Hair</td>
                    <td>Eye</td>
                    <td>Habits</td>
                    <td>Dress Habbits.</td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "0 10px",
                          borderBottom: "0.5px solid #ccc",
                          width: "200px",
                        }}
                      />
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td style={{ width: "16%" }}>Language/Slag</td>
                    <td>Burn Mark</td>
                    <td style={{ width: "15%" }}>Leucoderma &emsp;</td>
                    <td style={{ width: "15%" }}>Place of Mole</td>
                    <td>Scar</td>
                    <td>Tattoo</td>
                  </tr>
                  <br></br>
                  <br></br>
                  <tr>
                    <td>Other Features:</td>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                  <br></br>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>10.</td>
            <td colspan="4">Sodo-economic profile of the JCL showing: </td>
            <td colspan="5" />
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              (a)
            </td>
            <td colspan="4">
              Living Station: Living alone or with Family/Relation/Associate in
              Pucca House/ Hotel/Kachacha House/ Tatched House/slumeris
              homeless.{" "}
            </td>
            <td colspan="5" />
          </tr>
          <tr>
            <td>(b)</td>
            <td colspan="4">Educational Qualification(s).</td>
            <td colspan="5" />
          </tr>
          <tr>
            <td>(c)</td>
            <td colspan="4">
              Occupation:{"   "}
              {occupation}
            </td>
            <td colspan="5" />
          </tr>
          <tr>
            <td>(d)</td>
            <td colspan="4">Income Group:</td>
            <td colspan="5" />
          </tr>
          <tr>
            <td> </td>
            <td colspan="9">
              <table width="100%" cellspacing="1" cellpadding="1">
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td>(i) </td>
                    <td>Lower income (up to Rs.500.P.M).</td>
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td>(ii)</td>
                    <td> Lower Middle income (From Rs.501 to Rs1000).</td>
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td>(iii)</td>
                    <td> Middle Income (From Rs.1001 to Rs2000).</td>
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td>(iv) </td>
                    <td>Upper Middle Income( From 2001 to 3000).</td>
                    <td />
                    <td />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>11</td>
            <td colspan="9">
              Whether the {accusedOrCCL} Person: (Tick Yes/NO):
            </td>
          </tr>
          <tr>
            <td> </td>
            <td colspan="9">
              <table width="100%" cellspacing="1" cellpadding="1">
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td>(a)</td>
                    <td> Is dangerous.</td>
                    <td />
                  </tr>
                  <tr>
                    <td>(b)</td>
                    <td> Previously escaped and bail.</td>
                    <td />
                  </tr>
                  <tr>
                    <td>(c)</td>
                    <td> Is generally armed.</td>
                    <td />
                  </tr>
                  <tr>
                    <td>(d)</td>
                    <td> Operates with accomplices.</td>
                    <td />
                  </tr>
                  <tr>
                    <td>(e)</td>
                    <td> Has post criminal record.</td>
                    <td />
                  </tr>
                  <tr>
                    <td>(f)</td>
                    <td> Is recidivist.</td>
                    <td />
                  </tr>
                  <tr>
                    <td>(g)</td>
                    <td> Is likely to escape bail.</td>
                    <td />
                  </tr>
                  <tr>
                    <td>(h)</td>
                    <td>
                      {" "}
                      If released on bail, is likely to commit another crime.
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td />
                    <td> Immediately or threaten the victims/witness.</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{ width: "100%" }} cellspacing="1" cellpadding="1">
        <tbody
          style={{ fontSize: 17, fontFamily: "Arial", lineHeight: "20px" }}
        >
          <tr>
            <td width="70%"></td>
            <td>
              <br />
              <br />
              Signature of the investigating Officer.
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td width="70%"></td>
            <td>{IOName}</td>
          </tr>
          <tr>
            <td width="70%"></td>
            <td>{policeStation}</td>
          </tr>
          <tr>
            <td width="70%"></td>
            <td>{district}</td>
          </tr>
          <tr>
            <td width="70%">
              <br />
              <br />
              Signature of witness
            </td>
            <td />
          </tr>
          <tr>
            <td width="70%"></td>
            <td>Number, if any:</td>
          </tr>
          <tr>
            <td>Place:</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
