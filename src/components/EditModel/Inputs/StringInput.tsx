import { useField } from "react-final-form";

interface StringInput {
  fieldName: string;
  value: string;
}

export const StringInput = ({ fieldName, value }: StringInput) => {
  const { input } = useField(fieldName, { initialValue: value });

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 md:col-span-2">
        <label htmlFor={fieldName} className="font-bold">
          {fieldName}
        </label>
      </div>
      <div className="col-span-12 md:col-span-10">
        <input
          id={fieldName}
          {...input}
          className="w-full rounded border md:max-w-lg"
        />
      </div>
    </div>
  );
};
