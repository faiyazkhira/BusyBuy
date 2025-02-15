import { Autocomplete, TextField } from "@mui/material";
import styles from "../styles/Checkout.module.css";

//This component is used to display the state dropdown on checkout page
const indianStates = [
  { code: "AP", label: "Andhra Pradesh" },
  { code: "AR", label: "Arunachal Pradesh" },
  { code: "AS", label: "Assam" },
  { code: "BR", label: "Bihar" },
  { code: "CT", label: "Chhattisgarh" },
  { code: "GA", label: "Goa" },
  { code: "GJ", label: "Gujarat" },
  { code: "HR", label: "Haryana" },
  { code: "HP", label: "Himachal Pradesh" },
  { code: "JK", label: "Jammu & Kashmir" },
  { code: "JH", label: "Jharkhand" },
  { code: "KA", label: "Karnataka" },
  { code: "KL", label: "Kerala" },
  { code: "MP", label: "Madhya Pradesh" },
  { code: "MH", label: "Maharashtra" },
  { code: "MN", label: "Manipur" },
  { code: "ML", label: "Meghalaya" },
  { code: "MZ", label: "Mizoram" },
  { code: "NL", label: "Nagaland" },
  { code: "OR", label: "Odisha" },
  { code: "PB", label: "Punjab" },
  { code: "RJ", label: "Rajasthan" },
  { code: "SK", label: "Sikkim" },
  { code: "TN", label: "Tamil Nadu" },
  { code: "TG", label: "Telangana" },
  { code: "TR", label: "Tripura" },
  { code: "UP", label: "Uttar Pradesh" },
  { code: "UT", label: "Uttarakhand" },
  { code: "WB", label: "West Bengal" },
];

export default function StateDropdown({ field, form, ...props }) {
  const selectedState =
    indianStates.find((state) => state.label === field.value) || null;

  return (
    <Autocomplete
      options={indianStates}
      getOptionLabel={(option) => option.label}
      value={selectedState}
      onChange={(event, newValue) => {
        // When the user selects a new state, value updates
        form.setFieldValue(field.name, newValue ? newValue.label : "");
      }}
      PaperProps={{
        style: { minWidth: 300 },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...props}
          fullWidth
          variant="outlined"
          className={styles.stateDropdownInput}
          InputProps={{
            ...params.InputProps,
            style: { outline: "none" },
          }}
        />
      )}
    />
  );
}
