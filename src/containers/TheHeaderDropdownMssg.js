import React from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

const TheHeaderDropdownMssg = () => {
  const itemsCount = 4;
  return (
    <CDropdown inNav className="c-header-nav-item mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-envelope-open" />
        <CBadge shape="pill" color="info" className="hidden">
          {itemsCount}
        </CBadge>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="hidden">
          <strong>You have 0 messages</strong>
        </CDropdownItem>

        <CDropdownItem href="#" className="text-center border-top">
          <p className="mb-0 text-center">No new Messages yet!</p>
        </CDropdownItem>

        <CDropdownItem href="#" className="text-center border-top hidden">
          <strong>View all messages</strong>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdownMssg;
