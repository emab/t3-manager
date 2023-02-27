import type { GetStaticProps } from "next";
import { Prisma } from "@prisma/client";
import { Header } from "../../components/Header";
import Link from "next/link";
import { Fragment } from "react";
import { FaPlus } from "react-icons/fa";

type Admin = {
  models: { url: string; name: string }[];
};

const Admin = ({ models }: Admin) => {
  return (
    <>
      <Header />
      <div className="mx-4">
        <h2 className="my-5 text-2xl">Site administration</h2>
        <div className="grid grid-cols-12">
          <div className="col-span-12 bg-cyan-600 px-2 py-3 text-white">
            Model name
          </div>
          {models.map((model) => (
            <Fragment key={model.url}>
              <div className="col-span-10 border-b py-3">
                <Link
                  href={model.url}
                  className="ml-2 font-bold text-blue-400 hover:text-blue-500"
                >
                  {model.name}
                </Link>
              </div>
              <div className="col-span-2  flex justify-evenly border-b py-3">
                <Link
                  href="#"
                  className="flex items-center text-blue-400 hover:text-blue-500"
                >
                  <FaPlus className="mr-1 text-green-600" />
                  Add
                </Link>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </>
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
