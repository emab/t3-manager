import { useRouter } from "next/router";
import Link from "next/link";
import cx from "classnames";

export const Header = () => {
  const { query } = useRouter();

  const route = query["admin"] as string[] | undefined;

  const currentPage = route?.[route.length - 1];

  return (
    <div>
      <div className="bg-cyan-800 p-10 text-center">
        <h1 className="text-3xl font-bold text-yellow-400">T3 Manager</h1>
      </div>
      <div
        className={cx(
          "bg-cyan-700 px-5 text-lg capitalize text-white",
          !route && "bg-cyan-800"
        )}
      >
        {route ? (
          <Link href="/admin/">Home</Link>
        ) : (
          <span className="text-cyan-800">Hey :)</span>
        )}
        {route?.map((route) => (
          <span key={`${route}-${JSON.stringify(route)}`}>
            {` > `}
            {route === currentPage ? (
              <span className="text-neutral-300">{route}</span>
            ) : (
              <Link href={route} key={route}>
                {route}
              </Link>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};
