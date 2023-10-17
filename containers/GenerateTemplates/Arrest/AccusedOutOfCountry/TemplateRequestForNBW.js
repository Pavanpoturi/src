import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TemplateSignature from "../../TemplateSignature";
import TemplatesLogo from "../../TemplatesLogo";
import TemplatesFooter from "../../TemplatesFooter";

export default function TemplateRequestForNBW({ fileName, data }) {
  const {
    policeStation = "",
    district = "",
    firNumber = "",
    sectionOfLaw = "",
    accusedDetails = [],
    IOName = "",
    currentDate = "",
    courtName = "",
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
    dateOfFiling = "",
  } = !isUndefined(data) && data;

  const isCCl = data?.accusedPersonalDetails?.personalDetails?.age < 18;
  const accusedOrCCL = isCCl ? "CCL" : "accused";

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <b>
                        {" "}
                        IN THE COURT OF HONOURABLE {courtName || "_________"}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td width="6%" />
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      {" "}
                    </td>
                    <td width="30%" />
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
                      {currentDate || moment().format(DATE_FORMAT)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              Honoured Sir,
              <br />
            </td>
          </tr>

          <tr>
            <td
              style={{ fontSize: 17, fontFamily: "Arial", paddingLeft: "5.5%" }}
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
                      </span>
                      P S
                      <span
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {policeStation}
                      </span>
                      - {accusedOrCCL} out of country - Issue of Non Bailable
                      Warrants for issue of Look Out Circular (LOC) for tracing{" "}
                      {accusedOrCCL} - Prayed for - reg{" "}
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
                      </span>{" "}
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
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;It is submitted that on{" "}
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
                    borderBottom: "1px dashed #ccc",
                    width: "200px",
                  }}
                >
                  {complainantname || "__________"}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    borderBottom: "1px dashed #ccc",
                    width: "200px",
                  }}
                >
                  {complainantaddress || "__________"}
                </span>{" "}
                presented a report at PS{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {policeStation}
                </span>{" "}
                stating that
                <div
                  style={{
                    padding: "0 10px",
                  }}
                >
                  {complainantstatememt || "__________"}
                </div>
              </p>

              <br />
              <p>
                &emsp;&emsp;&emsp;&nbsp; As per the contents of the report a
                case in Cr.No
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
                was registered and investigation was taken up.
              </p>

              <p>
                &emsp;&emsp;&emsp;&nbsp;During the course of investigation, the
                scene of offence was visited, statements of witnesses were
                recorded. The investigation prima facie established offences
                against the {accusedOrCCL}. However, the following{" "}
                {accusedOrCCL} are out of country:
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <br />
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <b>Sl.No.</b>{" "}
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <b>No of {accusedOrCCL}</b>{" "}
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <b>Name and address of {accusedOrCCL} person</b>{" "}
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <b>Passport </b>
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <b>Address of Country </b>
                    </td>
                  </tr>
                  {accusedDetails.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "100px",
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
                          {item.accusedCode || ""}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "400px",
                          }}
                        >
                          {`${item.accusedName}${
                            item.personAddress ? "," : ""
                          } ${item.personAddress || ""}`}
                        </td>
                        <td
                          style={{
                            padding: "0 10px",
                            width: "200px",
                          }}
                        >
                          {" "}
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
                lineHeight: "20px",
                textAlign: "justify",
              }}
            >
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp; In this connection, it is prayed that
                the Honourable Court may kindly issue NBWs against the above
                {accusedOrCCL} for the purpose of issue of LOC (Look Out
                Circular) against them by Ministry of Home Affairs, New Delhi.
              </p>
              <br />
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
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
