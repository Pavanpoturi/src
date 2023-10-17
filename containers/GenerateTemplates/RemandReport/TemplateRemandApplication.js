import { isUndefined } from "lodash";
import TemplatesLogo from "../TemplatesLogo";
import TemplatesFooter from "../TemplatesFooter";
import TemplateSignature from "../TemplateSignature";
import {
  getPersonPersonalDetailsPrint,
  getPersonPersonalAddressPrint,
} from "@containers/FirDetails/fir-util";

export default function TemplateRemandApplication({ fileName, data }) {
  const {
    arrestedDate = "",
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    producedDateTime = "",
    userDate = "",
    courtName = "",
    complainantname = "",
    complainantaddress = "",
    accusedList = [],
    phone = "",
    days = "",
    district = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <br />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <br />
              <b>
                <u>IN THE COURT OF HONOURABLE {courtName || "_________"}</u>
              </b>
              <br />
              <br />
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
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                      width="5%"
                    >
                      1
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                      width="25%"
                    >
                      Name & address of complainant or informant.
                    </td>
                    <td style={{}} width="2%">
                      :
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                      width="50%"
                    >
                      {" "}
                      {complainantname} {complainantaddress} {phone}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                    >
                      2
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      F.I.R No. Date and P.S{" "}
                    </td>
                    <td>:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "210px",
                      }}
                    >
                      {firNumber}, {userDate}, {policeStation}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                    >
                      3
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Section of law{" "}
                    </td>
                    <td>:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {sectionOfLaw}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                    >
                      4
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      <u>
                        <b>Name & Particulars of the accused</b>
                      </u>
                    </td>
                    <td>:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {accusedList.map((item, index) => {
                        const personalDetails = getPersonPersonalDetailsPrint(
                          item?.personalDetails
                        );
                        const personalAddress = getPersonPersonalAddressPrint(
                          item?.presentAddress
                        );
                        return (
                          <div key={index} style={{ marginBottom: 5 }}>
                            {personalDetails} {personalAddress}
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        verticalAlign: "top",
                        padding: "0 10px",
                      }}
                    >
                      5
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Date and time of arrest{" "}
                    </td>
                    <td>:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {arrestedDate}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                    >
                      6
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Date of producing before Court{" "}
                    </td>
                    <td>:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {producedDateTime}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                    >
                      7
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      No. of days required for remand{" "}
                    </td>
                    <td>:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      {""}
                      {days}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                      }}
                    >
                      8
                    </td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      Reasons for remand{" "}
                    </td>
                    <td>:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        verticalAlign: "top",
                        width: "200px",
                      }}
                    >
                      A separate remand report enclosed herewith.
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
              }}
            >
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
                lineHeight: "20px",
              }}
            >
              <p>
                &emsp;&emsp;&emsp;&nbsp;The detailed remand case diary is
                submitted herewith and the arrested accused is/ are produced
                herewith and it is prayed that the Honourable Court may kindly
                remand the accused to judicial custody for a period of ( 14 )
                days.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              {" "}
              <br />
              <br />
              Dated:
              <span
                style={{
                  padding: "0 10px",
                  width: "200px",
                }}
              >
                {" "}
                {producedDateTime}
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
                    showurfaith={2}
                  />
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <u>9. ORDER OF COURT</u>
            </td>
          </tr>
        </tbody>
      </table>
      <TemplatesFooter />
    </div>
  );
}
