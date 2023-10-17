import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplatesFooter from "../TemplatesFooter";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function TemplateAdditionalMemo({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    courtName = "",
    district = "",
    IOName = "",
    userDate = "",
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
                <tr>
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 17,
                      fontFamily: "Arial",
                    }}
                  >
                    <b>
                      IN THE COURT OF HONOURABLE {courtName || "__________"}{" "}
                    </b>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%"> No. :</td>
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
                      Date:{" "}
                    </td>
                    <td
                      width="40%"
                      style={{
                        textAlign: "left",
                        width: 200,
                        padding: "0 10px",
                      }}
                    >
                      {userDate
                        ? moment(userDate).format(DATE_FORMAT)
                        : moment().format(DATE_FORMAT)}
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
              <br />
              Honoured Sir,
              <br />
            </td>
          </tr>

          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                paddingLeft: "5.5%",
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
                      - Submission of additional memo - Submission of{" "}
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
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;The facts of the case are that on the
                intervening night of{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                />{" "}
                Unknown offenders gained entry into the house of{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                />
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                />{" "}
                by breaking open the main door locks and committed theft of gold
                ornaments and other items in the absence of inmates.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;As per complaint of{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                />
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
                was registered and investigation taken up.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;The inmates have returned to
                headquarters verified and furnished list of articles stolen. The
                statement of inmates were also recorded.
              </p>
              <p>
                &emsp;&emsp;&emsp;&nbsp;Hence, it is prayed that the Honourable
                court may kindly take the list of articles on record and it may
                please be read as part and parcel of complaint.
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center" }}>
              <br />
              <br />
              BE PLEASED TO CONSIDER.
            </td>
          </tr>
          <tr>
            <td>
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {userDate ? moment(userDate).format(DATE_FORMAT) : ""}
              </span>
            </td>
          </tr>
          <tr>
            <td style={{}}>
              <table
                style={{
                  width: "100%",
                }}
              >
                <TemplateSignature
                  IOName={IOName}
                  policeStation={policeStation}
                  district={district}
                  showurfaith={"2"}
                />
              </table>
            </td>
          </tr>
          <tr>
            <td>
              Date :{" "}
              {userDate
                ? moment(userDate).format(DATE_FORMAT)
                : moment().format(DATE_FORMAT)}
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
