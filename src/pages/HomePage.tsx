import NewTokenForm from '@/components/forms/NewTokenForm';
import { GET_POOLS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { GetPoolsQuery, Pool } from '@/graphql/__generated__/graphql';
import { Loader } from '@/components/ui/loader';
import PoolPreview from '@/components/Pool';
import { useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pools = () => {
  const { data, loading, error, refetch } = useQuery<GetPoolsQuery>(GET_POOLS, {
    notifyOnNetworkStatusChange: true,
  });

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-3">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center pt-3">Error fetching pools</p>;
  }

  const pools = (data?.getPools as Pool[]) ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button onClick={handleRefetch} size="icon" variant="ghost">
          <RefreshCw className="cursor-pointer" size={18} />
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {pools.length === 0 ? (
          <p className="text-center">No pools available</p>
        ) : (
          pools.map((pool) => <PoolPreview key={pool.id} pool={pool} />)
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center">
        <NewTokenForm />
      </div>
      <Pools />
    </div>
  );
};

export default HomePage;
