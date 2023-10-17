import { isUndefined } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";
import TemplateSignature from "../TemplateSignature";

export default function RequisitiontoCourt({ fileName, data }) {
  const {
    policeStation = "",
    IOName = "",
    district = "",
    accusedList = [],
    witnessList = [],
    complainantname = "",
    complainantaddress = "",
    complainantstatememt = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", padding: "0 10%" }}>
      <TemplatesLogo />
      <table width="100%">
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td>
              <table width="100%">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr style={{ textDecoration: "underLine" }}>
                    <td>
                      <b>IN THE COURT OF HONOURABLE {data.courtName} .</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br /> Honoured Sir,
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
                {" "}
                &emsp;&emsp;&emsp;&nbsp;It is submitted that on{" "}
                <span style={{}}>
                  {data.dateCreated
                    ? moment(data.dateCreated).format(DATE_TIME_FORMAT)
                    : ""}
                </span>{" "}
                the complainant Sri/Smt{" "}
                <span style={{}}>{complainantname || "________"}</span> r/o{" "}
                {complainantaddress || "________"} presented a report at PS{" "}
                <span style={{}}>
                  {data.policeStation ? data.policeStation : ""}
                </span>{" "}
                stating that {complainantstatememt || "________"}
              </p>
              <br />
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;As per the contents of the report a case
                in Cr.No.{"  "}
                <span style={{}}>{data.firNumber ? data.firNumber : ""}</span>
                u/s{" "}
                <span style={{}}>
                  {data.sectionOfLaw ? data.sectionOfLaw : ""}
                </span>{" "}
                was registered and investigation taken up.
              </p>
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;During the course of investigation, the
                scene of offence was visited, statements of witnesses were
                recorded.
              </p>
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;The following accused persons were
                arrested on{" "}
                <span style={{}}>
                  {data.requisitionDate
                    ? moment(data.requisitionDate).format(DATE_TIME_FORMAT)
                    : ""}
                </span>{" "}
                and remanded to judicial custody and presently they are in jail.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  {accusedList.map((accEle, i) => {
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            padding: "4px",
                            width: "10%",
                          }}
                        >
                          {data.tipCodes && data.tipCodes[accEle._id]
                            ? `${data.tipCodes[accEle._id]}`
                            : ""}
                        </td>
                        <td>
                          {`${accEle.personalDetails?.name} ${
                            accEle.personalDetails?.gender
                              ? `${accEle.personalDetails?.gender} ,`
                              : ""
                          } 
                      ${
                        accEle.presentAddress?.houseNo
                          ? `${accEle.presentAddress?.houseNo} ,`
                          : ""
                      } 
                      ${
                        accEle.presentAddress?.wardColony
                          ? `${accEle.presentAddress?.wardColony} ,`
                          : ""
                      } 
                      ${
                        accEle.presentAddress?.streetRoadNo
                          ? `${accEle.presentAddress?.streetRoadNo} ,`
                          : ""
                      }
                      ${
                        accEle.presentAddress?.district
                          ? `${accEle.presentAddress?.district} `
                          : ""
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
                textAlign: "justify",
                lineHeight: "20px",
              }}
            >
              <br />
              <p>
                {" "}
                &emsp;&emsp;&emsp;&nbsp;In this regard, it is submitted that the
                following witnesses during the course of investigation stated
                that they can identify the accused if shown to them.
              </p>
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
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    lineHeight: "20px",
                  }}
                >
                  {witnessList.map((witEle, i) => {
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            padding: "4px",
                            width: "10%",
                          }}
                        >
                          {data.tipCodes && data.tipCodes[witEle._id]
                            ? `${data.tipCodes[witEle._id]}`
                            : ""}{" "}
                        </td>
                        <td style={{ padding: "4px" }}>
                          {`${witEle.personalDetails?.name} ${
                            witEle.personalDetails?.gender
                              ? `${witEle.personalDetails?.gender} ,`
                              : ""
                          } 
                      ${
                        witEle.presentAddress?.houseNo
                          ? `${witEle.presentAddress?.houseNo} ,`
                          : ""
                      } 
                      ${
                        witEle.presentAddress?.wardColony
                          ? `${witEle.presentAddress?.wardColony} ,`
                          : ""
                      } 
                      ${
                        witEle.presentAddress?.streetRoadNo
                          ? `${witEle.presentAddress?.streetRoadNo} ,`
                          : ""
                      }
                      ${
                        witEle.presentAddress?.district
                          ? `${witEle.presentAddress?.district} `
                          : ""
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
              &emsp;&emsp;&emsp;&nbsp; Hence, it is prayed that this Honourable
              court may kindly appoint Honourable Magistrate for conducting test
              identification duly fixing the date. Copies of statements of
              witnesses are enclosed for favour of perusal.
            </p>
          </td>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
                textAlign: "center",
                lineHeight: "20px",
              }}
            >
              <br />
              BE PLEASED TO CONSIDER.
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              Place:{policeStation}
              <br />
              Date:
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
    </div>
  );
}
