
export const complianceConfigs = {
  ISO: {
    apiBasePath: "/api/compliance/ISO",
    title: "ISO",
    fields: [
      { name: "controlName", label: "Control Name" },
      { name: "isoControlRef", label: "ISO Control Ref" }
    ]
  },
  CIBIL: {
    apiBasePath: "/api/compliance/CIBIL",
    title: "CIBIL",
    fields: [
      { name: "controlName", label: "Control Name" },
      { name: "cibilReference", label: "CIBIL Reference" }
    ]
  },
  CICRA: {
    apiBasePath: "/api/compliance/CICRA",
    title: "CICRA",
    fields: [
      { name: "controlName", label: "Control Name" },
      { name: "cicraRef", label: "CICRA Reference" }
    ]
  }
};
