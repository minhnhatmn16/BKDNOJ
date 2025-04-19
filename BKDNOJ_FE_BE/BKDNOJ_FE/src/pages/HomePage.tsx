import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="content-div shadow rounded bg-white p-6">
      <div className="pl-3 pr-3 grid grid-cols-1 md:grid-cols-8 gap-6">
        <div className="col-span-1 md:col-span-5">
          <div className="flex flex-col justify-center items-center" style={{ height: "100%" }}>
            <span className="text-text-secondary">Welcome to</span>
            <div className="big-title pt-2 pb-2 text-center">
              <h4 className="text-2xl font-bold">Bách Khoa Đà Nẵng Online Judge 2.0</h4>
              <div className="title">
                <h5 className="text-lg">
                  phase <span className="code-markup">openBETA</span>
                </h5>
                <span className="code-markup">22年10月20日</span>
              </div>
            </div>
            <span className="subtext text-center text-text-secondary">
              Your new online platform for practicing and hosting programming contests, for Vietnam Central Province.
            </span>
          </div>
        </div>
        <div className="col-span-1 md:col-span-3 flex justify-center items-center">
          <div className="logo-container max-w-[300px]">
            <img
              src="/bkdnoj-dropflag.png"
              alt="BKDNOJ Logo"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
