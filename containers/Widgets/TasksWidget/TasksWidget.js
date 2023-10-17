import { Row, Col, notification } from "antd";
import Scrollbars from "@components/utility/customScrollBar";
import { TasksWidgetWrapper } from "./TasksWidget.styles";

export default function TasksWidget({
  label,
  labelColor,
  taskList,
  bgColor,
  shadowColor,
}) {
  const displayTaskList = () =>
    taskList.map((task, i) => (
      <Row
        key={i}
        wrap={false}
        style={{
          background: bgColor,
          padding: 10,
          borderRadius: 5,
          marginBottom: 8,
        }}
        onClick={() => {
          notification["warning"]({
            message: "Work in Progress",
          });
        }}
      >
        <Col flex="auto" className="widgetText">
          {task?.name}
        </Col>
        <Col flex="none">
          <div className="widgetText" style={{ padding: "0 16px" }}>
            {task?.count}
          </div>
        </Col>
      </Row>
    ));

  return (
    <TasksWidgetWrapper
      style={{ boxShadow: `0px 27px 19px -28px ${shadowColor}` }}
    >
      <h3 className="widgetLabel" style={{ color: labelColor }}>
        {label}
      </h3>
      <Scrollbars className="widgetContainer">{displayTaskList()}</Scrollbars>
    </TasksWidgetWrapper>
  );
}
