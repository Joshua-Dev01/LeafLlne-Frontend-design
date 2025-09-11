import React from 'react';
import { Result } from 'antd';

const LoadingError: React.FC = () => (
  <Result
    status="500"
    title={<span className="text-white">500</span>}
    subTitle={<span className="text-gray-200">Sorry, something went wrong. Retry again</span>}
    className=""
  />
);

export default LoadingError;
