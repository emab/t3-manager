import { useField } from "react-final-form";

interface StringInput {
  fieldName: string;
  value: string;
}

export const StringInput = ({ fieldName, value }: StringInput) => {
  const { input } = useField(fieldName, { initialValue: value });

  return <input {...input} />;
};
