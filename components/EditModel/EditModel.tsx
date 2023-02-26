import { Form } from "react-final-form";
import type { Field } from "../../types/Fields";
import { StringInput } from "./Inputs/StringInput";

interface EditModel {
  fields: Field[];
  data: Record<string, unknown>;
}

const getInputForFieldType = (field: Field) => {
  switch (field.type) {
    case "String":
    case "DateTime":
      return StringInput;
    default:
      throw new Error(`Unsupported type: ${field.type}`);
  }
};

export const EditModel = ({ data, fields }: EditModel) => {
  console.log(data);
  return (
    <Form onSubmit={console.log}>
      {() => (
        <form>
          {fields.map((field) => {
            const Component = getInputForFieldType(field);
            return (
              <div>
                <Component fieldName={field.name} value={data[field.name]} />
              </div>
            );
          })}
        </form>
      )}
    </Form>
  );
};
