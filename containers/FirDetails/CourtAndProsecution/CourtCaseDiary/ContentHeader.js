import { Button, Row, Col, Select } from "antd";
import { DoubleRightOutlined, CaretDownOutlined } from "@ant-design/icons";
import { isArray } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import CourtCaseDiaryAction from "@redux/CourtAndProsecution/CourtCaseDiary/action";

const Option = Select.Option;

export default function ContentHeader({
  headerTitle,
  onSubmitClick,
  disableButton,
  onCancel,
  onReset,
  pastData,
  showPastData,
  handleSearch,
  ccdDate,
  setccdDate,
  generateCCDForm,
  isTrialDone = false,
}) {
  const { getCaseDiaryById } = CourtCaseDiaryAction;
  const dispatch = useDispatch();

  const handleSelect = (data) => {
    setccdDate(!!data ? data : "");
    if (!!data === true) {
      dispatch(
        getCaseDiaryById(
          `${config.courtCaseDiary}/byId?courtCaseDiaryId=${data}`
        )
      );
    }
  };

  return (
    <Row
      justify="space-between"
      style={{ marginBottom: 15, marginTop: 10, marginRight: 5 }}
    >
      <Col>
        <span style={{ fontSize: 25, marginRight: 50 }}>{headerTitle}</span>
        {showPastData && (
          <span style={{ fontSize: 16, marginRight: 10 }}>Past CCD date</span>
        )}
        {showPastData ? (
          <>
            {
              <Select
                suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
                showSearch
                allowClear
                showArrow
                onSearch={handleSearch}
                onSelect={handleSelect}
                style={{ width: 300 }}
                value={ccdDate}
              >
                {isArray(pastData) &&
                  pastData.map((item, index) => (
                    <Option
                      key={index}
                      value={item._id}
                      label={moment(item.dateOfTrial).format(DATE_TIME_FORMAT)}
                    >
                      {moment(item.dateOfTrial).format(DATE_TIME_FORMAT) +
                        " - " +
                        item.trialFor}
                    </Option>
                  ))}
              </Select>
            }
            {ccdDate !== "" && (
              <span
                onClick={onReset}
                className="stepsButtonInActive"
                style={{
                  cursor: "pointer",
                  marginLeft: 10,
                }}
              >
                Reset
              </span>
            )}
          </>
        ) : null}
      </Col>
      <Col>
        <span
          onClick={onCancel}
          className="stepsButtonInActive"
          style={{
            cursor: "pointer",
            marginLeft: 15,
          }}
        >
          Cancel
        </span>
        {showPastData && !!ccdDate === true ? (
          <Button
            type="primary"
            className="saveButton"
            style={{
              cursor: "pointer",
              marginLeft: 15,
            }}
            onClick={generateCCDForm}
          >
            Generate CCD
          </Button>
        ) : null}
        {isTrialDone ? (
          <Button
            type="primary"
            className="stepsButtonActive"
            style={{
              backgroundColor: "#258C0B",
              marginLeft: 15,
              borderColor: "#258C0B",
            }}
            onClick={onSubmitClick}
            disabled={disableButton}
          >
            Submit
            <DoubleRightOutlined style={{ marginTop: 3.5 }} />
          </Button>
        ) : null}
      </Col>
    </Row>
  );
}
