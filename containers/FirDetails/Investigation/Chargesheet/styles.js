import styled from "styled-components";

const DragWrapper = styled.div`
  .row-dragging {
    background: red !important;
    border: 1px solid blue !important;
  }

  .row-dragging td {
    padding: 16px;
  }

  .row-dragging .drag-visible {
    visibility: visible !important;
  }
`;

const WitnessTableWrapper = styled.div`
  .ant-table-thead .ant-table-selection-column .ant-table-selection {
    visibility: hidden !important;
  }
  .ant-table-thead {
    display: ${(props) => (props.isCharged ? "none" : "table-header-group")};
  }
`;

export { DragWrapper, WitnessTableWrapper };
