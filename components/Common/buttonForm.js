import { Button, Checkbox } from "antd";

export default function ButtonForm({
  primaryButtonText,
  onSubmitClick,
  onCancelClick,
  generateInvoice = false,
  onGenerateInvoice,
  addAnother,
}) {
  return (
    <div style={{ paddingTop: 15 }}>
      <Button type="primary" className="submitButton" onClick={onSubmitClick}>
        {primaryButtonText}
      </Button>
      <Button type="text" onClick={onCancelClick}>
        Cancel
      </Button>
      {generateInvoice && (
        <Button
          type="text"
          onClick={onGenerateInvoice}
          style={{ marginLeft: 20 }}
        >
          Generate Invoice
        </Button>
      )}
      {addAnother && <Checkbox>Add Another</Checkbox>}
    </div>
  );
}
