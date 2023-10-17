/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { Table } from "antd";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { DragOutlined } from "@ant-design/icons";
import { shortAddress } from "@containers/FirDetails/fir-util";
import { isEmpty, filter, size, isUndefined, isArray } from "lodash";

const DragHandle = sortableHandle(({ disabled }) => (
  <DragOutlined
    style={{
      cursor: disabled ? "not-allowed" : "grab",
      color: disabled ? "#d9d9d9" : "#02599C",
    }}
  />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

export default function WitnessRearrangement({
  dataList,
  removeItem,
  setChargedList,
  disabled,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setDataSource(dataList);
  }, [dataList]);

  const getColumns = () => {
    return [
      {
        title: "",
        dataIndex: "",
        width: 30,
        className: "drag-visible",
        render: (_d, _dd, i) => (
          <DragHandle active={selectedItems.includes(i)} disabled={disabled} />
        ),
      },
      {
        title: "Sequence",
        dataIndex: "witnessCode",
        className: "drag-visible",
        render: (witnessCode) => (
          <span className="tableRowText wordWrap">{witnessCode}</span>
        ),
      },
      {
        title: "Witness Details",
        dataIndex: "witnessDetails",
        className: "drag-visible",
        render: (witnessDetails) => (
          <span className="tableRowText wordWrap">
            {witnessDetails?.name}{" "}
            {shortAddress(witnessDetails?.presentAddress)}
          </span>
        ),
      },
      {
        title: "Type of Witness",
        dataIndex: "typeOfwitness",
        className: "drag-visible",
        render: (typeOfwitness, val) => {
          let label = "";
          if (typeOfwitness === "Official witnesses / Experts") {
            label = `${val?.typeOfWitness} (${val?.subTypeOfWitness})`;
          } else if (val?.typeOfWitness === "Panch witness") {
            label = `${
              val?.typeOfWitness
            } (${val?.panchSubTypeOfWitness.join()})`;
          } else if (val?.typeOfWitness) {
            label = val?.typeOfWitness;
          } else {
            label = "";
          }
          return <span className="tableRowText wordWrap">{label}</span>;
        },
      },
      {
        title: "Strenght of Evidence",
        dataIndex: "strengthOfEvidance",
        className: "drag-visible",
        render: (strengthOfEvidance) => (
          <span className="tableRowText wordWrap">
            {strengthOfEvidance ? strengthOfEvidance : ""}
          </span>
        ),
      },
      {
        title: "Action",
        dataIndex: "strengthOfEvidance",
        className: "drag-visible",
        render: (_i, item) => {
          return (
            <div
              style={{
                cursor: disabled ? "not-allowed" : "pointer",
                color: disabled ? "#d9d9d9" : "#02599C",
              }}
              onClick={() => {
                !disabled && removeItem(item);
              }}
            >
              Delete
            </div>
          );
        },
      },
    ];
  };

  const merge = (a, b, i = 0) => {
    let aa = [...a];
    return [...a.slice(0, i), ...b, ...aa.slice(i, aa.length)];
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    let tempDataSource = dataSource;

    if (oldIndex !== newIndex) {
      if (!selectedItems.length) {
        let movingItem = tempDataSource[oldIndex];
        tempDataSource.splice(oldIndex, 1);
        tempDataSource = merge(tempDataSource, [movingItem], newIndex);
      } else {
        let filteredItems = [];
        selectedItems.forEach((d) => {
          filteredItems.push(tempDataSource[d]);
        });
        let newData = [];
        tempDataSource.forEach((d, i) => {
          if (!selectedItems.includes(i)) {
            newData.push(d);
          }
        });
        tempDataSource = [...newData];
        tempDataSource = merge(tempDataSource, filteredItems, newIndex);
      }
      let itemResult = [];
      tempDataSource.map((result, i) => {
        const dataRes = {
          index: i,
          key: result?.key,
          person: result?.person,
          statementId: result?.statementId,
          isChargeSheet: result?.isChargeSheet,
          strengthOfEvidance: result?.strengthOfEvidance,
          typeOfwitness: result?.typeOfwitness,
          subTypeOfWitness:
            result?.typeOfwitness === "Panch witness" &&
            !isUndefined(result?.panchSubTypeOfWitness)
              ? result?.panchSubTypeOfWitness.join()
              : result?.subTypeOfWitness,
          oldWitnessCode: result?.oldWitnessCode,
          witnessCode: `LW${i + 1}`,
          witnessDetails: result?.witnessDetails,
        };
        itemResult.push(dataRes);
      });
      const finalResult = !isEmpty(itemResult) && filter(itemResult, size);
      setDataSource(finalResult);
      setChargedList(finalResult);
      setSelectedItems([]);
    }
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return (
      <SortableItem
        index={index}
        {...restProps}
        disabled={disabled}
        selected={selectedItems.length}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            selectedItems.includes(index)
              ? selectedItems.splice(selectedItems.indexOf(index), 1)
              : selectedItems.push(index);
            setSelectedItems(selectedItems);
          } else {
            setSelectedItems([]);
          }
        }}
      />
    );
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={getColumns()}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </div>
  );
}
