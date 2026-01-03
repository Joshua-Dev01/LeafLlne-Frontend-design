import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import Cookies from "js-cookie";

const Nopage = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    const officeCookies = Cookies.get("OfficeCookies");
    if (officeCookies) {
      navigate("/app");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="">
      <Result
        status="404"
        title=""
        subTitle=""
        className="dark:!text-white"
        extra={
          <>
            <p className="text-2xl font-semibold">404</p>
            <p>Sorry, See you are on a broken page</p>
            <Button
              className="!bg-blue-950 !text-white !border-none"
              onClick={handleRedirect}
            >
              Go to Home
            </Button>
          </>
        }
      />
    </div>
  );
};

export default Nopage;
