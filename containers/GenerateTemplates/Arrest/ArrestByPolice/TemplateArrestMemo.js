import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesLogo from "../../TemplatesLogo";
import TemplatesFooter from "../../TemplatesFooter";
import TemplateSignature from "../../TemplateSignature";

export default function TemplateArrestMemo({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    currentDate,
    dateAndTimeOfArrest,
    placeOfTakenIntoCustody,
    accusedCode,
    policeRecords,
    gender = "",
    dateOfBirth = "",
    district = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ float: "left" }}>
              <table>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">01.</td>
                    <td>DISTRICT</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {district}
                    </td>
                    <td>POLICE STATION</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {policeStation}
                    </td>
                    <td>YEAR</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      _________
                    </td>

                    <td>FIR. No. </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {firNumber}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Proceeding No. </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    ></td>

                    <td>GD. No. </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td>Date</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {currentDate || "__________"}
                    </td>
                    <td>* Alphanumeric code of the accused: </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {accusedCode || "__________"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">02.</td>
                    <td width="40%">Date, Time & Place of Arrest/Surrend:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {`${dateAndTimeOfArrest} ${
                        placeOfTakenIntoCustody || "__________"
                      }`}
                    </td>
                  </tr>
                  <tr>
                    <td>03.</td>
                    <td>Name of the court if surrendered:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      _________
                    </td>
                  </tr>
                  <tr>
                    <td>04.</td>
                    <td>Acts and sections:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {sectionOfLaw || "__________"}
                    </td>
                  </tr>
                  <tr>
                    <td>05.</td>
                    <td>Arrested and forwarded:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      _________
                    </td>
                  </tr>
                  <tr>
                    <td>06.</td>
                    <td>Particulars of the accused:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      _________
                    </td>
                  </tr>
                  <tr>
                    <td>07.</td>
                    <td>
                      Injuries causes of injuries and physical condition of the
                      accused person:
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      _________
                    </td>
                  </tr>
                  <tr>
                    <td>08.</td>
                    <td>
                      The accused after being informed of the grounds of arrest
                      and his legal rights was duly taken in custody :
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      _________
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      The following article(s) was found on physical search,
                      conducted on the person of the Accused, and were taken in
                      to possession for which a receipt was given to the
                      accused:
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td />
                    <td colSpan="2">
                      <table style={{ border: "0.5px solid black" }}>
                        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                          <tr>
                            <td width="30%"> Article Name </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" _________ "}
                            </td>
                          </tr>
                          <tr>
                            <td> Article Name </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" _________ "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>09.</td>
                    <td>
                      Physical features deformities and other details of
                      accused:
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td />
                    <td colSpan="2">
                      <table style={{ border: "0.5px solid black" }}>
                        <tbody
                          style={{
                            border: "0.5px solid black",
                            fontSize: 17,
                            fontFamily: "Arial",
                          }}
                        >
                          <tr>
                            <td> Sex </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {gender || "________"}{" "}
                            </td>
                            <td width="15%"> Date of Birth </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {dateOfBirth
                                ? moment(dateOfBirth).format(DATE_FORMAT)
                                : "_________"}{" "}
                            </td>
                            <td> Build </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________ Medium
                            </td>
                          </tr>
                          <tr>
                            <td> Height </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Complexion </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Identification Marks(s) </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                          </tr>
                          <tr>
                            <td> Deformities </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Teeth </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Hair </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                          </tr>
                          <tr>
                            <td> Eyes </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Habits </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Dress Habits </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                          </tr>
                          <tr>
                            <td> Languages dialect </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Burn Mark </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Leucoderma </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                          </tr>
                          <tr>
                            <td> Mole </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Scar </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                            <td> Tattoo </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              ________{" "}
                            </td>
                          </tr>
                          <tr>
                            <td> Others </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                              colSpan="5"
                            >
                              ________{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>10.</td>
                    <td>Whether finger print taken or not?</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ________
                    </td>
                  </tr>
                  <tr>
                    <td>11.</td>
                    <td>Socio Economic Profile of the accused showing:</td>
                    <td>________ </td>
                  </tr>
                  <tr>
                    <td />
                    <td colSpan="2">
                      (a) Living status: Living along with family. (b)
                      Educational Qualifications: (c) Occupation: (d) Income
                      group:
                    </td>
                  </tr>
                  <tr>
                    <td>12.</td>
                    <td>
                      Whether the accused person, as per the observations and
                      known police records:
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td></td>
                    <td colSpan="2">
                      <table style={{ border: "0.5px solid black" }}>
                        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                          <tr>
                            <td width="5%"> A </td>
                            <td width="30%"> Is Dangerous? </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.isDangerous || "_________"}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td> B </td>
                            <td width="30%"> Previously jumped any bail? </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.previouslyJumpedAnyBail ||
                                "_________"}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td>C </td>
                            <td width="30%"> Is generally Armed? </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.isGenerallyArmed || "_________"}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td> D </td>
                            <td width="30%"> Operates with Accomplices? </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.operatesWithAccomplices ||
                                "__________"}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td> E </td>
                            <td width="30%"> Has past criminal record? </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.isKnownCriminal || "_________"}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td> F</td>
                            <td width="30%"> Is Recidivist? </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.isRecidivist || "_________"}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td> G </td>
                            <td width="30%"> Is likely to jump bail? </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.isLikelyToJumpBail || ""}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td> H</td>
                            <td width="30%">
                              {" "}
                              If released on bail, likely to commit any crime or
                              threaten victims/witnesses?{" "}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.likelyToCommitCrime ||
                                "_________"}
                            </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                            </td>
                          </tr>
                          <tr>
                            <td> I</td>
                            <td width="30%"> Is wanted in any other cases? </td>
                            <td
                              style={{
                                padding: "0 10px",
                                width: 200,
                              }}
                            >
                              {" "}
                              {policeRecords?.isWantedInOtherCase}
                            </td>
                            {policeRecords?.isWantedInOtherCase &&
                            policeRecords?.isWantedInOtherCase === "Yes" ? (
                              <td
                                style={{
                                  padding: "0 10px",
                                  textAlign: "left",
                                  width: 200,
                                }}
                              >
                                {" "}
                                Case#{" "}
                              </td>
                            ) : null}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>13.</td>
                    <td colspan="2">
                      Name and address of the witnesses (relatives) : <br />
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>14.</td>
                    <td>Signature or LTI of the arrested person:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ________
                    </td>
                  </tr>
                </tbody>
              </table>
              <br /> <br />
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
                    showurfaith={2}
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
