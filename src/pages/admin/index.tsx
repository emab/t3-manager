import type { GetStaticProps } from "next";
import { Prisma } from "@prisma/client";

type Admin = {
  models: { url: string; name: string }[];
};

const Admin = ({ models }: Admin) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Model name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {models.map((model) => (
          <tr key={model.url}>
            <td>
              <a href={model.url}>{model.name}</a>
            </td>
            <td>Edit Delete</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Admin;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      models: Prisma.dmmf.datamodel.models.map((model) => ({
        name: model.name,
        url: `/admin/${model.name.charAt(0).toLowerCase()}${model.name.slice(
          1
        )}`,
      })),
    },
  };
};
