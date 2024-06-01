import { useState, useCallback, useMemo } from 'react';
import { GET_POOLS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { GetPoolsQuery, Pool, PoolFragment } from '@/graphql/__generated__/graphql';
import { Loader } from '@/components/ui/loader';
import PoolPreview from '@/components/PoolPreview';
import useSocketEvent from '@/hooks/useSocketEvent';

const HomePage = () => {
  const [newPools, setNewPools] = useState<Pool[]>([]);
  const { data, loading, error } = useQuery<GetPoolsQuery>(GET_POOLS, {
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setNewPools([]);
    },
  });

  const fetchedPools = useMemo(() => {
    const pools = (data?.getPools as Pool[]) || [];
    return pools.filter((pool) => !newPools.some((newPool) => newPool.address === pool.address));
  }, [data]);

  const handleNewPoolCreated = useCallback((newPoolFromDb: Pool) => {
    const isPoolAlreadyFetched = data?.getPools?.some(
      (pool) => (pool as PoolFragment)?.address === newPoolFromDb.address
    );
    const isNewPoolAlreadyAdded = newPools.some(
      (pool) => (pool as PoolFragment)?.address === newPoolFromDb.address
    );
    const isAlreadyAccountedFor = isPoolAlreadyFetched || isNewPoolAlreadyAdded;
    if (!isAlreadyAccountedFor) {
      setNewPools((prev) => [newPoolFromDb, ...prev]);
    }
  }, []);
  // Listen for the POOL_CREATED event using the custom hook
  useSocketEvent('POOL_CREATED', handleNewPoolCreated);

  if (loading) {
    return (
      <div className="flex justify-center pt-3">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center pt-3">Error fetching pools</p>;
  }

  const hasPoolsToShow = fetchedPools.length > 0 || newPools.length > 0;

  return (
    <div className="h-screen overflow-y-auto pb-24 pt-3">
      <div className="flex flex-col gap-8">
        {!hasPoolsToShow ? (
          <p className="text-center">No pools available</p>
        ) : (
          <>
            {newPools.map((pool, i) => (
              <PoolPreview key={pool?.address} pool={pool} isNew={i === 0} />
            ))}
            {fetchedPools.map((pool) => (
              <PoolPreview key={pool?.address} pool={pool} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
