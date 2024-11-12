import React from "react";
import { Link, Location } from "react-router-dom";

interface HeaderLinkProps {
    to: string;
    toName: string;
    location: Location;
}

const HeaderLink: React.FC<HeaderLinkProps> = ({ to, toName, location }) => (
    <Link
        to={to}
        className={`header-link ${location.pathname === to ? 'active' : ''}`}
    >
        {toName}
    </Link>
);

export default HeaderLink;