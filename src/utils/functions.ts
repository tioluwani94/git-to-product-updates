import { Children, ReactNode, isValidElement } from "react";

export function appendObjToUrl(query: Record<string, any>) {
  const baseQuery = new URLSearchParams();

  Object.keys(query).forEach((key) => {
    let value = query[key];

    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      return value.forEach((i) => baseQuery.append(key, i));
    }

    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    baseQuery.append(key, value);
  });

  return baseQuery.toString();
}

export function getValidChildren(children: ReactNode) {
  return Children.toArray(children).filter((child) =>
    isValidElement(child)
  ) as React.ReactElement[];
}
