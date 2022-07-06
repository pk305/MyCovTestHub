import React from "react";
import { CFooter } from "@coreui/react";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="/" target="_blank" rel="noopener noreferrer">
          Company
        </a>
        <span className="ml-1">&copy; 2021 nueklabs.</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Created by</span>
        <a
          href="https://www.twitter.com/mwanziKE"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kennedy
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
