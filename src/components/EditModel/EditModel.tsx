import { Form } from "react-final-form";
import type { Field } from "../../../types/Fields";
import { StringInput } from "./Inputs/StringInput";

interface EditModel {
  fields: Field[];
  data: Record<string, unknown>;
  modelName: string;
  saveModel: (data: Record<string, unknown>) => void;
}

const getInputForFieldType = (field: Field, fieldData: unknown) => {
  switch (field.type) {
    case "String":
    case "DateTime":
    case "Int":
      return { Component: StringInput, value: fieldData as string };
    default:
      throw new Error(`Unsupported type: ${field.type}`);
  }
};

export const EditModel = ({
  data,
  fields,
  modelName,
  saveModel,
}: EditModel) => {
  return (
    <div className="mx-4">
      <h2 className="my-5 text-2xl">Change {modelName}</h2>
      <Form onSubmit={saveModel}>
        {({ handleSubmit }) => (
          <form onSubmit={void handleSubmit}>
            {fields.map((field) => {
              const { Component, value } = getInputForFieldType(
                field,
                data[field.name]
              );
              return (
                <div key={field.name} className="mb-5">
                  <Component fieldName={field.name} value={value} />
                </div>
              );
            })}
            <div className="flex justify-between text-lg">
              <button className="rounded bg-red-700 p-2 px-4 text-white">
                Delete
              </button>
              <button className="rounded bg-blue-500 p-2 px-4 text-white">
                Save
              </button>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};
