import React from "react";
import TableWrapper, { CustomizedTableWrapper } from "../AntTables.styles";
import Switch from "@components/uielements/switch";
import Form from "@components/uielements/form";
const FormItem = Form.Item;

const expandedRowRender = (record) => (
  <p>{`${record.firstName} lives in ${record.city}`}</p>
);
const title = () => "Here is title";
const showHeader = true;
const footer = () => "Here is footer";
const scroll = { y: 240 };

const toggleOptions = [
  {
    initialValues: true,
    title: "Bordered",
    key: "bordered",
  },
  {
    initialValues: true,
    title: "Loading",
    key: "loading",
  },
  {
    initialValues: true,
    title: "Pagination",
    key: "pagination",
  },
  {
    initialValues: title,
    title: "Title",
    key: "title",
  },
  {
    initialValues: showHeader,
    title: "Show Header",
    key: "showHeader",
  },
  {
    initialValues: footer,
    title: "Footer",
    key: "footer",
  },
  {
    initialValues: expandedRowRender,
    title: "Expanded Row Render",
    key: "expandedRowRender",
  },
  {
    initialValues: {},
    title: "Checkbox",
    key: "rowSelection",
  },
  {
    defaultValue: scroll,
    title: "Scrollable",
    key: "scroll",
  },
];
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const [state, setState] = React.useState({
    bordered: undefined,
    loading: undefined,
    pagination: true,
    size: "default",
    expandedRowRender,
    title,
    showHeader,
    footer,
    rowSelection: {},
    scroll: undefined,
  });

  function renderSwitch(option) {
    const checked = state[option.key] !== undefined;
    const onChange = () => {
      if (!checked) {
        setState({ [option.key]: option.initialValues });
      } else {
        setState({ [option.key]: undefined });
      }
    };
    return (
      <FormItem label={option.title} key={option.key}>
        <Switch checked={checked} onChange={onChange} />
      </FormItem>
    );
  }
  return (
    <CustomizedTableWrapper className="customizedTableWrapper">
      <div className="customizedTableControlBar">
        <Form layout="inline">
          {toggleOptions.map((option) => renderSwitch(option))}
        </Form>
      </div>
      <TableWrapper
        {...state}
        columns={props.tableInfo.columns}
        dataSource={props.dataList.getAll()}
        className="customizedTable"
        size="small"
      />
    </CustomizedTableWrapper>
  );
}
