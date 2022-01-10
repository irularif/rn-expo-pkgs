// @ts-ignore
import * as pages from "app/pages/{*.tsx,**/*.tsx}";
// @ts-ignore
import * as libsPages from "libs/pages/{*.tsx,**/*.tsx}";

const generatePages = () => {
  const pageScreens: any = [];
  const allPages: any = {};
  Object.assign(allPages, libsPages, pages);
  // asdaaaaaaaaa
  Object.keys(allPages).forEach((name) => {
    const fname =
      "/" + name.replace(/\$/, "/").replace(/([a-z])([A-Z])/g, "$1-$2");
    pageScreens.push({
      name: fname.toLowerCase(),
      component: allPages[name],
      ...allPages[name].router,
    });
  });
  return pageScreens;
};

export default generatePages;
