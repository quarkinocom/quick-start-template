"use client";

import { useSettingEndpoints } from "@quarkino/services/client";

type TSettingProps = {
  lang?: string;
};

/**
 *
 * @returns The result of a react query get request for settings
 */
const useSettings = (props: TSettingProps) => {
  return useSettingEndpoints.get.get.settings
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
      ],
      ...(props.lang && { lang: props.lang }),
    })
    .useRequest({
      queryKey: ["settings"],
    });
};

export { useSettings };
