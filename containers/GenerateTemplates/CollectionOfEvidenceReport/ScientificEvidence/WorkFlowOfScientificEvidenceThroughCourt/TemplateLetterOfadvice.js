import { isUndefined } from "lodash";
import TemplatesFooter from "../../../TemplatesFooter";
import TemplatesLogo from "../../../TemplatesLogo";
import TemplateSignature from "../../../TemplateSignature";

export default function TemplateLetterOfadvice({ fileName, data }) {
  const {
    policeStation = "",
    currentDate = "",
    district = "",
    IOName = "",
  } = !isUndefined(data) && data;

  return (
    <div id={fileName} style={{ width: "95%", margin: "0 auto" }}>
      <TemplatesLogo />
      <table style={{ width: "100%" }}>
        <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
          <tr>
            <td style={{ paddingLeft: "5%" }}>
              <table style={{ width: "100%" }}>
                <tr>
                  <td>Form 82</td>
                  <td
                    style={{
                      float: "right",
                      textAlign: "right",
                      fontSize: 17,
                      fontFamily: "Arial",
                    }}
                  >
                    Order 692
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "center",
                fontSize: 17,
                fontFamily: "Arial",
              }}
            >
              <br />
              <h5>
                LETTER OF ADVICE
                <br />
                FORWARDING MATERIAL OBJECTS TO AN EXPERT
                <br />
                <br />
              </h5>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 17, fontFamily: "Arial" }}>
              <table style={{ width: "100%" }}>
                <tbody
                  style={{
                    fontSize: 17,
                    fontFamily: "Arial",
                    textAlign: "justify",
                    lineHeight: "20px",
                  }}
                >
                  <tr>
                    <td width="10%">1.</td>
                    <td width="80%">
                      Station name, Crime Number, section of law under Which the
                      case is to be charged
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
                    <td>2.</td>
                    <td>Number of persons or animals affected</td>
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
                    <td>3.</td>
                    <td>Number of deaths, if any</td>
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
                    <td>4.</td>
                    <td>
                      A brief history of the case with details as to the motive
                      for the offence, when, where and how the offence was
                      committed and other relevant particulars connected with
                      crime
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
                    <td>5.</td>
                    <td>
                      A list of articles forwarded for examination with a brief
                      description of each article and from where and in what
                      condition recovered. (The number given to the articles and
                      their description must corresponding with those on the
                      labels affixed to the respective article)
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
                    <td>6.</td>
                    <td>
                      The exact nature of examination required to be made on
                      each articles sent.
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
                    <td>7.</td>
                    <td>
                      Whether any of the items are to be returned after
                      examination
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
                    <td>8.</td>
                    <td>
                      A brief description of the mode of packing and through
                      whom and how the parcel is sent. It should be stated
                      whether the articles are being sent through a messenger or
                      by rail or by post and if the messenger is a police
                      constable, his name and number should be stated and the
                      constable directed to appear in uniform when presenting
                      the article.
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
                    <td>9.</td>
                    <td>
                      A sample seal used in sealing the material objects and the
                      outermost covering
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
          <br />
          <br />
          <tr>
            <td>
              <table className="">
                <tbody style={{ fontSize: 17, fontFamily: "Arial" }}>
                  <tr>
                    <td>Police Station:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {policeStation || "__________"}
                    </td>
                  </tr>

                  <tr>
                    <td>Date:</td>
                    <td
                      style={{
                        padding: "0 10px",
                        width: 200,
                      }}
                    >
                      {currentDate || "__________"}
                    </td>
                  </tr>
                </tbody>
              </table>
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
