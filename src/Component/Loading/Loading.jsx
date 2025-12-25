import ReactLoading from "react-loading";

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <ReactLoading type="spin" color="#4A90E2" height={100} width={100} />
  </div>
);
export default Loading;

