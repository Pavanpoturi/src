import { isUndefined, isEmpty, isArray, isString } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../FirDetails/fir-util";
import TemplatesLogo from "../TemplatesLogo";

export default function GenerateLetterOfAdvice({ fileName, data }) {
  const {
    policeStation = "",
    firNumber = "",
    sectionOfLaw = "",
    savedFir,
    formData = [],
    IOName,
  } = !isUndefined(data) && data;
  const briefFacts = savedFir?.firDetail?.briefFacts;
  const victimDetails =
    !isEmpty(savedFir?.victimDetails) &&
    !isUndefined(savedFir?.victimDetails) &&
    savedFir?.victimDetails;
  const deceasedVictimList =
    victimDetails && victimDetails.filter((s) => s.victimType === "Deceased");

  return (
    <div id={fileName} style={{ width: "100%", padding: "0 5%", fontSize: 17 }}>
      <table style={{ marginTop: 5 }}>
        <tbody>
          <tr>
            <td
              style={{
                textAlign: "left",
                verticalAlign: "bottom",
                width: "33.3%",
              }}
            >
              <h3>FORM - 54</h3>
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "bottom",
                width: "33.3%",
              }}
            >
              <TemplatesLogo />
            </td>
            <td
              style={{
                textAlign: "right",
                verticalAlign: "bottom",
                width: "33.3%",
              }}
            >
              <h3>
                Chapter 22 & 31<br></br>
                A.P.P.M Order No : 426-3 & 557 to 570
              </h3>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ textAlign: "center" }}>
        <u>LETTER OF ADVICE</u> <br />
        <u>FORWARDING A MATERIAL OBJECT TO AN EXPERT</u>
      </h3>

      <table style={{ marginTop: 5, fontWeight: 500 }}>
        <tbody>
          <tr>
            <td style={{ width: "3%", verticalAlign: "top" }}>1.</td>
            <td style={{ width: "60%" }}>
              Station name, Crime No. section of law under which the case is to
              be charged:
            </td>
            <td style={{ width: "37%" }}>
              {policeStation}, {firNumber}, {sectionOfLaw}
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>No. of persons or animals affected:</td>
            <td>
              {`Persons Affected - ${
                victimDetails.length > 0 ? victimDetails?.length : 0
              }`}
            </td>
          </tr>
          <tr>
            <td>3.</td>
            <td>No. of deaths, if any:</td>
            <td>{deceasedVictimList?.length || "-"}</td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              4.
            </td>
            <td>
              A brief history of the case with details as to the Motive for the
              offence, when, where and how the Offence was committed and other
              relevant particulars connected with the crime:
            </td>
            <td
              style={{
                whiteSpace: "break-spaces",
                verticalAlign: "top",
              }}
            >
              {briefFacts?.factsOfComplainant}
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              5.
            </td>
            <td>
              A list of articles forwarded for examination with brief
              description of each article and from where and in what condition
              recovered. The numbers given to The articles and their description
              must correspond with those on the labels affixed to the respective
              articles:
            </td>
            <td
              style={{
                whiteSpace: "break-spaces",
                verticalAlign: "top",
              }}
            >
              {isArray(formData) && !isEmpty(formData)
                ? formData.map((item, i) => (
                    <div key={i}>
                      Article #{i + 1} {item?.loaType}
                      {item?.loaSubType ? " - " : ""}
                      {item?.loaSubType}
                    </div>
                  ))
                : ""}
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              6.
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              The exact nature of examination required to be made on each of the
              articles sent:
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              {isArray(formData) && !isEmpty(formData)
                ? formData.map((item, i) => {
                    const selectedQuestions = item?.selectedQuestions;
                    return (
                      isArray(selectedQuestions) &&
                      !isEmpty(selectedQuestions) &&
                      selectedQuestions.map((ques, index) => {
                        const questions =
                          ques === "Others"
                            ? item?.otherQuestions.join(", ")
                            : ques;
                        return (
                          <div key={index}>
                            Article #{i + 1} {item?.loaType}
                            {item?.loaSubType ? " - " : ""}
                            {item?.loaSubType} - {questions}
                          </div>
                        );
                      })
                    );
                  })
                : ""}
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              7.
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              Whether any of the items are to be returned after examination:
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            />
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              8.
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              A brief description of the mode of packing and through whom and
              how the parcel is sent. It should be stated whether the articles
              are being sent through a messenger or by rail or by post and if
              the messenger is a police constable, his name and number should be
              stated and the Constable directed to appearin uniform when
              presenting the articles:
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            />
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              9.
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              A sample seal used in sealing the material objects and the
              outermost covering:
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              SEAL <br />
              <span>
                <hr style={{ borderBottom: "1px dashed #ccc", width: "30%" }} />
              </span>
              (The paper containing sample seal is to be put in a thick paper
              cover and sealed. On the cover it is to be written as sample
              seal).
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              10.
            </td>
            <td
              style={{
                verticalAlign: "top",
              }}
            >
              List of document enclosed (As per order No: 549-11 of APPM).
            </td>
          </tr>
          <tr>
            <td />
            <td
              style={{
                textAlign: "left",
                verticalAlign: "top",
                paddingTop: "20px",
              }}
            >
              Letter of advice physical evidence : -
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{ marginTop: 5, fontWeight: 500, with: "100%" }}>
        <tbody>
          <tr>
            <td>
              <table style={{ marginTop: "40px", fontSize: 17 }}>
                <tbody>
                  <tr>
                    <td>Station:</td>
                    <td>
                      <span style={{ borderBottom: "1px dashed #ccc" }}>
                        {policeStation}
                      </span>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>DATED:</td>
                    <td>
                      <span
                        style={{
                          borderBottom: "1px dashed #ccc",
                          fontSize: 17,
                        }}
                      >
                        {isArray(formData) &&
                        isString(formData?.[0]?.dateCreated)
                          ? moment(formData[0].dateCreated).format(
                              DATE_TIME_FORMAT
                            )
                          : ""}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "48%", fontSize: 17 }}
            >
              <b>INVESTIGATING OFFICER</b>
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "48%", fontSize: 17 }}
            >
              <span>{IOName}</span>
            </td>
          </tr>
          <br />
          <tr>
            <td
              style={{ position: "absolute", marginLeft: "48%", fontSize: 17 }}
            >
              <span>{policeStation} </span>
            </td>
          </tr>
          <br />
        </tbody>
      </table>
    </div>
  );
}
