import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "./../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import TemplateHeader from "../TemplateHeader";

export default function TemplateRequisitionForCollectionOfFingerPrints({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    escortPC = [],
    dateTime = "",
    district = "",
    complainantname = "",
    complainantaddress = "",
    dateOfFiling = "",
    complainantstatememt = "",
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
                currentDate={
                  dateTime ? moment(dateTime).format(DATE_FORMAT) : ""
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              To,
              <br /> __________
              <br />
              __________
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>Sir,</td>
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
                      Request for collection of Finger Prints of unknown dead
                      body - reg
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
                          padding: 15,
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
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;It is submitted that on{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {dateOfFiling || "__________"}
                </span>{" "}
                the complainant Sri/Smt{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {complainantname || "_____________"}{" "}
                </span>{" "}
                r/o{" "}
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {" "}
                  {complainantaddress || "_____________"}{" "}
                </span>{" "}
                presented a report / recorded statement wherein the complainant
                stated that
                <span
                  style={{
                    padding: "0 10px",
                    width: "200px",
                  }}
                >
                  {complainantstatememt || "_____________"}
                </span>
              </p>
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
              </p>
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;&nbsp;In this connection, the identity
                of the deceased is not established so far. Hence, it is
                requested to collect the finger prints of the deceased for the
                following reasons:
              </p>
              <div style={{ textAlign: "left" }}>
                &emsp;&emsp;&emsp;&nbsp;&nbsp;a) To compare the finger prints
                with that of ex.convicts, DCs, suspects.
                <br />
                &emsp;&emsp;&emsp;&nbsp;&nbsp;b) To establish identity of the
                deceased. <br />
              </div>
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;&nbsp;It is also requested to furnish
                your opinion as to whether the comparison revealed identity of
                the deceased or not.
              </p>
              <br />
              &emsp;&emsp;&emsp;&nbsp;&nbsp;Please acknowledge receipt of this
              letter.
              <br />
              <br />
            </td>
          </tr>
          <table style={{ width: "100%" }}>
            <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
              <tr>
                <td>
                  <br />
                  Place:{" "}
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  >
                    {policeStation}
                  </span>
                  <br />
                  Date and time:{" "}
                  <span
                    style={{
                      padding: "0 10px",
                      width: "200px",
                    }}
                  >
                    {dateTime ? moment(dateTime).format(DATE_TIME_FORMAT) : ""}
                  </span>
                  <br />
                  Escort:{" "}
                  {escortPC.map((s, i) => {
                    return (
                      <span
                        key={i}
                        style={{
                          padding: "0 10px",
                          width: "200px",
                        }}
                      >
                        {s}
                      </span>
                    );
                  })}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                  }}
                >
                  <table width="100%">
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
            </tbody>
          </table>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
