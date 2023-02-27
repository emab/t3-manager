import { Prisma } from "@prisma/client";
import type { GetServerSideProps } from "next";
import DMMF = Prisma.DMMF;
import upperCase from "lodash/upperCase";
import { prisma } from "../../server/db";
import { camelCase } from "lodash";
import { EditModel } from "../../components/EditModel/EditModel";
import type { Field } from "../../../types/Fields";
import { Header } from "../../components/Header";
import Link from "next/link";

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

  if (!Array.isArray(data)) {
    return (
      <>
        <Header />
        <EditModel fields={modelFields} data={data} saveModel={console.log} />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative mx-4 overflow-x-scroll">
        <h2 className="my-5 text-2xl">Select a {model.name} to change</h2>
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
                      <Link
                        href={`${route}/${String(item)}`}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {item}
                      </Link>
                    ) : (
                      String(item)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ModelPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context || !context.params || !context.params["admin"]) {
    return {
      props: {
        model: null,
        data: [],
      },
    };
  }

  const [modelName, modelId] = context?.params["admin"];

  if (!modelName) {
    return {
      props: {
        model: null,
        data: [],
      },
    };
  }

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
      const prismaModel = prisma[
        camelCase(modelName) as keyof typeof prisma
      ] as { findUnique: (...params: unknown[]) => Promise<unknown> };

      const data = await prismaModel.findUnique({ where: { id: modelId } });

      return {
        props: {
          route: modelName,
          modelFields,
          model,
          data: JSON.parse(JSON.stringify(data)) as unknown,
        },
      };
    }

    const data = await (
      prisma[camelCase(modelName) as keyof typeof prisma] as {
        findMany: (...params: unknown[]) => Promise<unknown>;
      }
    ).findMany();

    return {
      props: {
        route: modelName,
        modelFields,
        model,
        data: JSON.parse(JSON.stringify(data)) as unknown,
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
