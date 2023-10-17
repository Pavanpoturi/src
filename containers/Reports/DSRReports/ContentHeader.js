import { Form, DatePicker } from "antd";
import { DATE_FORMAT, DATE_YY_MM_DD } from "@containers/FirDetails/fir-util";
import { disableFutureDates } from "@components/Common/helperMethods";
import moment from "moment";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
};

export const downloadXlButtons = (disabled, downloadAsXls) => {
  const styles = {
    download: {
      background: "#02599C",
      color: "#FFF",
      borderRadius: 5,
      cursor: "pointer",
      height: 30,
      width: 120,
      // marginTop: 10,
      display: "flex",
      alignItems: "center",
    },
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style={styles.download}
        disabled={disabled}
        onClick={downloadAsXls}
      >
        Download XLSX
      </button>
    </div>
  );
};

export default function ContentHeader({
  headerTitle,
  onChange,
  downloadAsXls,
  disabled,
  defaultDate,
}) {
  const [form] = Form.useForm();

  return (
    <div
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={styles.widgetPageStyle}>
        <h3 className="pageTitle" style={{ color: "#454647", minWidth: "40%" }}>
          {headerTitle}
        </h3>
        <Form form={form} layout="vertical" style={{ marginLeft: "5%" }}>
          <DatePicker
            format={DATE_FORMAT}
            disabledDate={disableFutureDates}
            placeholder="Select Date"
            style={{ width: 220 }}
            onChange={onChange}
            defaultValue={moment(defaultDate, DATE_YY_MM_DD)}
          />
        </Form>
      </div>
      {downloadXlButtons(disabled, downloadAsXls)}
    </div>
  );
}
