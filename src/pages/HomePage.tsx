import React, { useState, useCallback, useMemo } from 'react';
import NewTokenForm from '@/components/forms/NewTokenForm';
import { GET_POOLS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { GetPoolsQuery, Pool, PoolFragment } from '@/graphql/__generated__/graphql';
import { Loader } from '@/components/ui/loader';
import PoolPreview from '@/components/Pool';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSocketEvent from '@/hooks/useSocketEvent';

const HomePage = () => {
  const [newPools, setNewPools] = useState<Pool[]>([]);
  const [isRefresing, setIsRefreshing] = useState(false);
  const { data, loading, error, refetch } = useQuery<GetPoolsQuery>(GET_POOLS, {
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setNewPools([]);
    }
  });

  const fetchedPools = useMemo(() => {
    const pools = data?.getPools as Pool[] || [];
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

  const handleRefetch = useCallback(async () => {
    setIsRefreshing(true);
    setNewPools([]);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  if (loading || isRefresing) {
    return (
      <div className="flex justify-center items-center pt-3">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center pt-3">Error fetching pools</p>;
  }

  const hasPoolsToShow = fetchedPools.length > 0 || newPools.length > 0;
  console.log('fetchedPools', fetchedPools);
  console.log('newPools', newPools);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between z-10">
        <NewTokenForm />
        <Button onClick={handleRefetch} size="icon" variant="ghost">
          <RefreshCw className="cursor-pointer" size={18} />
        </Button>
      </div>
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
