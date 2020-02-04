export default ({ siteData }) => {
  let direct = [];

  let pages = {};
  for (const page of siteData.pages) {
    const fragments = page.relativePath.split('/');

    if (fragments.length == 1) {
      direct.push(page.regularPath);
      continue;
    } else if (fragments.length > 2) {
      continue;
    }

    if (!pages.hasOwnProperty(fragments[0])) {
      pages[fragments[0]] = { page: null, children: [] };
    }

    if (fragments[1] === 'README.md') {
      pages[fragments[0]]['page'] = page;
    } else {
      pages[fragments[0]]['children'].push(page);
    }
  }

  siteData.themeConfig.sidebar = direct.concat(Object.keys(pages).map((key) => {
    const options = pages[key];

    options.children.sort((one, another) => {
      return one.regularPath < another.regularPath ? -1 : 1;
    });

    const title = (options.page !== null) ? options.page.title : key;
    const path = (options.page !== null) ? options.page.regularPath : null;
    return {
      title: title,
      path: path,
      children: options.children.map((subPage) => {
        return [subPage.regularPath, subPage.title];
      }),
    };
  }));
}
