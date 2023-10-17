import { isUndefined } from "lodash";
import TemplatesFooter from "../../TemplatesFooter";
import TemplatesLogo from "../../TemplatesLogo";

export default function TemplateCDRRequestDCPToServiceProvider({
  fileName,
  data,
}) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    district = "",
    currentDate = "",
    imeiNo = "",
    mobileNo = "",
    nickName = "",
    telecomServiceProvider = "",
    towerIdNo = "",
    requestedPeriodfrom = "",
    requestedPeriodto = "",
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
              <table style={{ width: "100%" }}>
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="20%" />
                    <td
                      width="25%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Office of the DCP / SP:{" "}
                    </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                  </tr>
                  <tr>
                    <td width="10%" />
                    <td width="20%" />
                    <td width="25%" />
                    <td
                      width="15%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      {" "}
                      Zone / DIST:
                    </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      {district || "__________"}
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">NO. </td>
                    <td
                      width="20%"
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      __________
                    </td>
                    <td width="25%"> </td>
                    <td
                      width="15%"
                      style={{
                        textAlign: "right",
                      }}
                    >
                      Date:{" "}
                    </td>
                    <td
                      width="40%"
                      style={{
                        padding: "0 10px",
                        textAlign: "left",
                        width: 200,
                      }}
                    >
                      {currentDate}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <br /> To,
              <br />
              M/s
              <span
                style={{
                  padding: "0 10px",
                  width: 200,
                }}
              >
                __________
              </span>
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}> Sir,</td>
          </tr>
          <tr>
            <td
              style={{
                paddingLeft: "5%",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <table
                style={{
                  padding: "0 10px",
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td width="10%">Sub:- </td>
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
                        {policeStation}
                      </span>{" "}
                      - Request for CDRs/CAF - reg
                    </td>
                  </tr>
                  <tr>
                    <td width="10%">Ref:- </td>
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
                        {sectionOfLaw}{" "}
                      </span>
                      of PS{" "}
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
              <br />
              &emsp;&emsp;&emsp;&emsp; It is to request to furnish the CDRs and
              CAFs in respect of the following mobile numbers for the purpose of
              investigation.
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td>
              <table
                style={{
                  padding: "0 10px",
                  width: "100%",
                }}
              >
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <th width="10%">Sl.No.</th>
                    <th>Phone No / IMEI / Tower ID</th>
                    <th>Used by Accused/ victim/ Others</th>
                    <th>Owner name</th>
                    <th colspan="2">&emsp;&emsp;&emsp;&nbsp;C D Rs required</th>
                  </tr>
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td>
                      <b>From</b>
                    </td>
                    <td>
                      <b>To</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      1.
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {mobileNo}
                      {" / "}
                      {imeiNo}
                      {" / "}
                      {towerIdNo}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {nickName !== "" ? nickName : "_______"}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {telecomServiceProvider !== ""
                        ? telecomServiceProvider
                        : "______"}
                    </td>

                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {requestedPeriodfrom !== ""
                        ? requestedPeriodfrom
                        : "________"}
                    </td>
                    <td
                      style={{
                        padding: "0 10px",

                        width: 200,
                      }}
                    >
                      {requestedPeriodto !== ""
                        ? requestedPeriodto
                        : "________"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      Others (Specify details )
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ________
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      ________
                    </td>
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
              <br />
              <br />
              <br />
              &emsp;&emsp;&emsp;&nbsp; You are requested to furnish the
              information at the earliest
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "25%",
                float: "right",
                textAlign: "right",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <tbody>
                <br />
                Yours faithfully, <br />
                <br />
              </tbody>
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "25%",
                float: "right",
                textAlign: "right",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <tbody>
                <br />
                <br />
                DCP / SP
              </tbody>
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
