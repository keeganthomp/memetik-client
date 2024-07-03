/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full md:max-w-[400px] text-center">
        <h2>Oops!</h2>
        <p className="text-red-500">{error?.message || 'Something went wrong'}</p>
        <Button onClick={goHome} className="mt-4">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
