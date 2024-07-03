import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { To, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

type Props = {
  children?: JSX.Element | string;
  route?: string | number;
  className?: string;
};

const BackButton = ({ children, route = -1, className = '' }: Props) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(route as To);
  };
  return (
    <Button variant="ghost" className={classNames('px-2', className)} onClick={goBack}>
      <ArrowLeft size={16} className="mr-1" />
      {children}
    </Button>
  );
};

export default BackButton;
