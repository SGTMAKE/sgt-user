import { getCategoryTree } from "@/lib/api/get-category-tree";
import { SortLg, SortSm } from "./sort";
import { FilterLg, FilterSm } from "./filter";
import { makeCategoryUrl } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
const Categories = async ({
  categoryParamsArray,
}: {
  categoryParamsArray?: string[];
}) => {
  const categories = await getCategoryTree(categoryParamsArray?.at(-1));

  return (
    <>
      {/* Filter For large devices */}
      <div className="hidden lg:col-span-1 lg:block lg:h-fit lg:w-full lg:rounded-lg lg:p-3">
      <ul className="flex flex-wrap items-center gap-1 text-xl font-semibold  text-muted-foreground mb-6">
        <li>
          <Link href={"/store"}>All</Link>
        </li>
        {categories?.parents.map((parent, i) => (
          <Fragment key={i}>
            <ChevronRight size={13} />
            <li>
              <Link href={makeCategoryUrl(categories?.parents, parent)}>
                {parent}
              </Link>
            </li>
          </Fragment>
        ))}
      </ul>
      <div className="bg-[#F6F5F5] p-1  border-3 border-[#807B7B3D] rounded-xl">
        <FilterLg categories={categories} />
        <SortLg />
      </div>
      </div>

      {/* Filter For small devices */}
      <div className="sticky top-0 z-20 col-span-4 flex justify-around border-y bg-white p-3 lg:hidden">
        <SortSm />
        <div className="border-r border-gray-300" />
        <FilterSm categories={categories} />
      </div>
    </>
  );
};

export default Categories;
