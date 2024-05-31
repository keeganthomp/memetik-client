import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_POOL } from '@/graphql/queries';
import { GetPoolQuery, Pool as PoolT } from '@/graphql/__generated__/graphql';
import { Loader } from '@/components/ui/loader';
import Pool from '@/components/Pool';

function isStringNumber(str = '') {
  if (str.trim() === '') {
    return false;
  }
  return !isNaN(Number(str));
}

const BackButton = () => {
  const navigate = useNavigate();

  const goToPools = () => {
    navigate('/');
  };

  return (
    <Button variant="ghost" className="px-2" onClick={goToPools}>
      <ArrowLeft size={16} className="mr-1" />
      Pools
    </Button>
  );
};

const PoolPage = () => {
  const { poolId } = useParams();
  const isId = poolId && isStringNumber(poolId);
  const { data, loading, error } = useQuery<GetPoolQuery>(GET_POOL, {
    variables: {
      id: isId ? parseInt(poolId) : '',
      address: isId ? '' : poolId,
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center pt-3">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center pt-3">Error fetching pool</p>;
  }

  const pool = data?.getPool as PoolT;

  return (
    <div className="pt-3 flex flex-col gap-2">
      <div>
        <BackButton />
      </div>
      {!pool ? <p>Pool not found</p> : <Pool pool={pool} />}
    </div>
  );
};

export default PoolPage;
