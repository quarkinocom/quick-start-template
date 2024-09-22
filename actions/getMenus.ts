import { getMenuMakerEndpoints } from "@quarkino/services/server";

export type TMenu = {
  active: 1 | 0;
  children: TMenu[];
  external: boolean;
  icon: { link: string; versions: string[]; mim_type: string };
  id: string;
  link: string;
  text: string;
};

export type TMenus = {
  id: string;
  menus: TMenu[];
  slug: string;
};
const slugs = ["main-header", "footer", "mobile-menu"] as const;
type TSelectedSlugs = typeof slugs;
type TObjectKeys = TSelectedSlugs[number];
export type TFormattedMenus<MenuObject = Partial<TMenus>> = {
  [key in TObjectKeys]: MenuObject;
};

/**
 * A function that is used we want to search an API reply from a getPost of type list
 * @param slug The slug key used for finding the specific post
 * @param result The result is an array received from getPost of type list, we are expecting it to have the slug key
 * @returns The specific post for that slug key
 */
const findPost = (slug: string, result: { slug?: string }[]): object => {
  return (
    (result && result.length && result.find((item) => item.slug === slug)) || {}
  );
};

/**
 * @param locale The current active locale
 * @returns An object containing all the available menus
 */
const getMenus = async (locale: string) => {
  const menus = await getMenuMakerEndpoints.get.get.getLocationMenus
    .include(["menus", "slug"])
    .filter({ slugs: slugs.map((slug) => `${slug}-${locale}`) })
    .request();

  const menusObject: Partial<TFormattedMenus> = {};

  if (!menus.data) return null;

  for (const slug of slugs) {
    const postSlug = `${slug}-${locale}`;
    menusObject[slug] = findPost(postSlug, menus.data.results);
  }

  return menusObject as TFormattedMenus<TMenus>;
};

export { getMenus };
