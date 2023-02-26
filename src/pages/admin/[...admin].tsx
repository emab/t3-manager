import { Prisma } from "@prisma/client";
import type { GetServerSideProps } from "next";
import DMMF = Prisma.DMMF;
import upperCase from "lodash/upperCase";
import { prisma } from "../../server/db";
import { camelCase } from "lodash";
import { EditModel } from "../../../components/EditModel/EditModel";
import type { Field } from "../../../types/Fields";

type ModelPage = {
  route: string;
  modelFields: Field[];
  model: DMMF.Model | null;
  data: { id: string }[];
};

const ModelPage = ({ route, modelFields, model, data }: ModelPage) => {
  if (!model) {
    throw new Error("No model was found!");
  }

  console.log(modelFields);

  if (!Array.isArray(data)) {
    return <EditModel fields={modelFields} data={data} />;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" />
          </th>
          {modelFields.map(({ name }) => (
            <th key={name}>{upperCase(name)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>
              <input type="checkbox" />
            </td>
            {Object.entries(item).map(([field, item]) => (
              <td key={String(item)}>
                {field === "id" ? (
                  <a href={`${route}/${String(item)}`}>{item}</a>
                ) : (
                  String(item)
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ModelPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const modelName = context.params ? context.params["admin"]?.[0] : "";

  if (!modelName) {
    return {
      props: {
        model: null,
        data: [],
      },
    };
  }

  const modelId = context.params["admin"]?.[1];

  const model =
    Prisma.dmmf.datamodel.models.find(
      (model) =>
        `${model.name.charAt(0).toLowerCase()}${model.name.slice(1)}` ===
        modelName
    ) ?? null;

  if (model) {
    console.log(model.fields);
    const modelFields = model.fields
      .filter((field) => !field.relationName)
      .map((field) => ({ name: field.name, type: field.type }));

    if (modelId) {
      const modelData = await prisma[camelCase(modelName)].findUnique({
        where: { id: modelId },
      });

      return {
        props: {
          route: modelName,
          modelFields,
          model,
          data: JSON.parse(JSON.stringify(modelData)),
        },
      };
    }

    const data = await prisma[camelCase(modelName)].findMany();

    return {
      props: {
        route: modelName,
        modelFields,
        model,
        data: JSON.parse(JSON.stringify(data)),
      },
    };
  }

  return {
    props: {
      model: null,
      data: [],
    },
  };
};
