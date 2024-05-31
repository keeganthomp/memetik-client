/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center p-4">
      <div className="bg-white rounded p-4 w-full md:max-w-[400px] text-center">
        <h1>Oops!</h1>
        <p>
          <i>Something went wrong</i>
        </p>
        <Button onClick={goHome} className="mt-4">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
