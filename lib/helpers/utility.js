import options from "@containers/Sidebar/options";

export const clearToken = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("complainantList");
  localStorage.removeItem("templatesLogo");
  localStorage.removeItem("tile");
  localStorage.removeItem("selectedFirId");
  localStorage.removeItem("selectedFir");
  localStorage.removeItem("selectedCaseStatus");
  localStorage.removeItem("selectedDraftedFirId");
  localStorage.removeItem("selectedDate");
  localStorage.removeItem("draftCount");
};

export const isServer = typeof window === "undefined";

/**
 * Function to sort alphabetically an array of objects by some specific key.
 *
 * @param {String} property Key of the object to sort.
 */
export const dynamicSort = (property) => {
  var sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder === -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};

export const getDefaultPath = () => {
  const getParent = (lastRoute) => {
    const parent = [];
    if (!lastRoute) return parent;
    parent.push(lastRoute);
    options.forEach((option) => {
      if (option.children) {
        option.children.forEach((child) => {
          if (child.key === lastRoute) {
            parent.push(option.key);
          }
        });
      }
    });
    return parent;
  };
  if (!isServer && window.location.pathname) {
    const routes = window.location.pathname.split("/");
    if (routes.length > 1) {
      const lastRoute = routes[routes.length - 1];
      return getParent(lastRoute);
    }
  }
  return [];
};

export const TEMPLATE_LOGO_PNG_ID = "56bc299b-a3c1-44a8-8021-50e0da561441";
export const TEMPLATE_LOGO_JPG_ID = "ae4fb755-f5c7-4e0e-b197-15d5441fb437";
