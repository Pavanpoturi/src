import { isUndefined } from "lodash";
import TemplatesLogo from "../../../../TemplatesLogo";
import TemplatesFooter from "../../../../TemplatesFooter";
import TemplateSignature from "../../../../TemplateSignature";

export default function TemplateLetterToTakingSampleSignat({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    dateOfFiling = "",
    district = "",
    nameOfCourt = "",
    complainantname = "",
    complainantaddress = "",
    IOName = "",
  } = !isUndefined(data) && data;

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
                    <td
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      <b>
                        {" "}
                        IN THE COURT OF HONOURABLE{" "}
                        {nameOfCourt || "___________________"}
                      </b>
                    </td>
                    <br />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <br />
              Honoured Sir,
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
              <table
                style={{
                  width: "100%",
                }}
              >
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
                        {" "}
                        {policeStation}
                      </span>{" "}
                      Request for issuing directions to Sub
                      Registrar................... to produce Sample signature
                      and thumb impression register in the court - Prayed for -
                      reg
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
                        {sectionOfLaw}
                      </span>{" "}
                      PS{" "}
                      <span
                        style={{
                          padding: "0 10px",
                          width: 200,
                        }}
                      >
                        {policeStation}
                      </span>{" "}
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
              &emsp;&emsp;&emsp;&nbsp;It is submitted that on{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {dateOfFiling}
              </span>{" "}
              the complainant Sri/Smt{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {complainantname ? complainantname : "__________"}
              </span>{" "}
              r/o{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {complainantaddress ? complainantaddress : "___________"}
              </span>{" "}
              .. presented a report at PS{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                {policeStation}
              </span>{" "}
              .. stating that{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                ________________________________________
              </span>{" "}
              for the alleged offence of Forgery of signatures in executing the
              sale deed.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;As per the contents of the report a case
              in Cr.No{" "}
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
                {sectionOfLaw}
              </span>{" "}
              was registered and investigation was taken up.
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp;During the course of investigation it is
              revealed that a fictitious person was produced and the signatures
              of the complainant were forged and following document was executed
              in the office of Sub Registrar{" "}
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>{" "}
              .<br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                lineHeight: "20px",
              }}
            >
              <table
                style={{
                  width: "100%",
                }}
              >
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <th>Document No. Date and SRO office</th>
                    <th>Plot No. Sy.No. extent and place of land</th>
                    <th>Executed by</th>
                    <th>In favour of </th>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
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
              &emsp;&emsp;&emsp;&nbsp;Hence, it is prayed that the Honourable
              court may kindly collect sample signatures and thumb impressions
              of the complainant in open court for onward transmission to
              Handwriting Expert for comparison and opinion.t.
              <br />
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "25%",
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              BE PLEASED TO CONSIDER.
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>Encl:</td>
          </tr>{" "}
          <br />
          <tr>
            <td style={{ paddingLeft: "5%" }}>
              Place:
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
              <br />
              Date:
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
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
                    showurfaith={"2"}
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
