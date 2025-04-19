import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <div className="site-logo d-none d-md-block">
          <Link to="/" />
        </div>
        <span className="px-2">bkdnOJ v2.0</span>
        {/* <span className="px-2">open-Beta</span> */}
        {/* <span className="bugs px-2">Bugs 🐞</span> */}
      </div>
    </div>
  );
};

export default Header;
