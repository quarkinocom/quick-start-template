import { getSettingEndpoints } from "@quarkino/services/server";

/**
 * @returns The result of a react query get request for settings
 */
const getSettings = async (lang?: string) => {
  const settings = await getSettingEndpoints.get.get.settings
    .filter({
      entries: [
        "seo",
        "content",
        "socials",
        "favicon",
        "recaptcha",
        "copy_right",
        "site_title",
        "site_logos",
        "contact_details",
        "trusted",
      ],
      ...(lang && { lang }),
    })
    .request();

  return settings;
};

export { getSettings };
