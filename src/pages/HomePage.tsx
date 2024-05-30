import React, { useEffect, useRef, useCallback } from 'react';
import NewTokenForm from '@/components/forms/NewTokenForm';
import { GET_POOLS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { GetPoolsQuery, Pool, PoolFragment } from '@/graphql/__generated__/graphql';
import { Loader } from '@/components/ui/loader';
import PoolPreview from '@/components/Pool';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocket, SocketEvent } from '@/hooks/useSocket';

const HomePage = () => {
  const socket = useSocket();
  const { data, loading, error, updateQuery, refetch } = useQuery<GetPoolsQuery>(GET_POOLS, {
    notifyOnNetworkStatusChange: true,
  });
  const newPoolAddressRef = useRef<string | null>(null);

  useEffect(() => {
    if (newPoolAddressRef.current) {
      setTimeout(() => {
        newPoolAddressRef.current = null;
      }, 500); // Match the animation duration
    }
  }, [newPoolAddressRef.current]);

  // Listen for new pools to be added to the list
  useEffect(() => {
    if (socket) {
      console.log('Listening for new pools...');
      socket.on(SocketEvent.POOL_CREATED, (newPoolFromDb) => {
        updateQuery((prevData) => {
          if (!prevData || !newPoolFromDb) return prevData;
          // Check if the pool is already in the UI
          const isPoolInList = prevData.getPools.some(
            (pool) => (pool as PoolFragment)?.address === newPoolFromDb?.address
          );
          if (isPoolInList) return prevData;
          const newPoolForCache = {
            __typename: 'Pool',
            ...newPoolFromDb,
            token: {
              __typename: 'Token',
              ...newPoolFromDb.token,
            },
          };
          newPoolAddressRef.current = newPoolFromDb?.address;
          return {
            ...prevData,
            getPools: [newPoolForCache, ...prevData.getPools],
          };
        });
      });
      return () => {
        socket.off(SocketEvent.POOL_CREATED);
      };
    }
  }, [socket]);

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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <NewTokenForm />
        <Button onClick={handleRefetch} size="icon" variant="ghost">
          <RefreshCw className="cursor-pointer" size={18} />
        </Button>
      </div>
      <div className="flex flex-col gap-8 list-container">
        {pools.length === 0 ? (
          <p className="text-center">No pools available</p>
        ) : (
          pools.map((pool) => (
            <div
              key={pool.address}
              className={`${pool?.address === newPoolAddressRef?.current ? 'new-item' : ''}`}
            >
              <PoolPreview pool={pool} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
