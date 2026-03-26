import { useQuery } from '@tanstack/react-query';
import { adminApi } from './api';

export const useReviewQueue = (status?: string) => {
  return useQuery({
    queryKey: ['admin-queue', status],
    queryFn: () => adminApi.getQueue(status),
  });
};