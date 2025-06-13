import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div className="footer-wrapper bg-gray-800 text-white">
      <footer className="footer py-2">
        <div className="container mx-auto px-4">
          <div className="upper-row flex items-center gap-2 md:grid md:grid-cols-12">
            <div className="school-info-section col-span-1 flex items-center md:col-span-3">
              <img
                src="/bkdn-uni-banner-gray-transparent.png"
                alt="BKDN University"
                className="max-w-[180px]"
              />
            </div>
            <div className="col-span-1 flex items-center md:col-span-9">
              {/* <p className="text-sm opacity-80">
                bkdnOJ v2.0 - open.Beta - 2022 | Built by BKDN Informatics Olympic & ICPC Team,
                University of Science and Technology - University of Danang
              </p> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
