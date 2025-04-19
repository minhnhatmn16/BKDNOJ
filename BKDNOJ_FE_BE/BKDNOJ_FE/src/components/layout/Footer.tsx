import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <>
      <div className="zig-zag-border"></div>
      <div className="footer-wrapper">
        <footer className="footer">
          <div className="container">
            <div className="upper-row grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="school-info-section col-span-1 md:col-span-4">
                <div className="flex justify-center md:justify-start">
                  <img
                    src="/bkdn-uni-banner-gray-transparent.png"
                    alt="BKDN University"
                    className="max-w-[180px]"
                  />
                </div>
              </div>
              <div className="link-section col-span-1 md:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="subcategory">
                    <h4>Về chúng tôi</h4>
                    <p className="flex flex-col">
                      <a href="https://dut.udn.vn/">Đại học Bách Khoa - Đại học Đà Nẵng</a>
                      <a href="http://dut.udn.vn/KhoaCNTT">Khoa CNTT</a>
                      <a href="#">Đội IOI&ICPC BKĐN</a>
                      <a href="https://github.com/BKDN-University">Đội phát triển bkdnOJ v2.0</a>
                    </p>
                  </div>
                  <div className="subcategory">
                    <h4>Đường dẫn liên quan</h4>
                    <p className="flex flex-col">
                      <a href="https://icpc.global/regionals/abouticpc">About ICPC</a>
                      <a href="https://www.olp.vn/">Olympic Tin học VN</a>
                      <a href="https://vnoi.info/">Diễn đàn Tin học VNOI</a>
                    </p>
                  </div>
                  <div className="subcategory">
                    <h4>Các OJ khác</h4>
                    <p className="flex flex-col">
                      <a href="https://codeforces.com/">Codeforces</a>
                      <a href="https://atcoder.jp/">AtCoder</a>
                      <a href="https://dmoj.ca/">DMOJ</a>
                      <a href="https://onlinejudge.org/index.php">UVaOJ</a>
                      <a href="https://oj.vnoi.info/">VNOJ</a>
                      <a href="https://onlinejudge.u-aizu.ac.jp/home">AizuOJ</a>
                      <a href="https://lqdoj.edu.vn/">LQDOJ</a>
                      <a href="http://ntucoder.net/">NtuCoder</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lower-row mt-8">
              <div className="col-span-12">
                <pre id="footer-note" className="text-center text-sm opacity-80">
bkdnOJ v2.0 - open.Beta - 2022
Build by BKDN Informatics Olympic & ICPC Team
University of Science and Technology - University of Danang
                </pre>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
