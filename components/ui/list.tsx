import React from "react";

const List = ({ children, ...props }) => {
  return (
    <div className="overflow-auto p-2" {...props}>
      {children}
    </div>
  );
};

export const ListItem = ({ children, ...props }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0 p-2" {...props}>
      {children}
    </div>
  );
};

export default List;
