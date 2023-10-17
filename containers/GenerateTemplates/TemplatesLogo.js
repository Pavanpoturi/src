import { loadState } from "@lib/helpers/localStorage";

export default function TemplatesLogo() {
  const templateLogo = loadState("templatesLogo");

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={templateLogo}
        alt="escopLogo"
        style={{
          height: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </div>
  );
}
