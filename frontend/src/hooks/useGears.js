import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gearApi, dashboardApi, crawlApi } from '../services/api';
import { toast } from '../store/uiStore';

export const useGears = (params = {}) =>
  useQuery({
    queryKey: ['gears', params],
    queryFn: () => gearApi.list({ ...params, limit: params.limit || 50 }).then((r) => r.data),
    staleTime: 30_000,
  });

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.get().then((r) => r.data),
    staleTime: 30_000,
  });

export const useCrawledProducts = () =>
  useQuery({
    queryKey: ['crawled-products'],
    queryFn: () => crawlApi.listProducts().then((r) => r.data || []),
    staleTime: 60_000,
  });

export const useCrawlSearch = () => {
  return useQuery({
    queryKey: ['crawl-search', ''],
    queryFn: () => Promise.resolve([]),
    enabled: false,
  });
};

export const useCreateGear = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: gearApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gears'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Gear added!');
    },
    onError: (e) => toast.error(e.response?.data?.message || e.message),
  });
};

export const useDeleteGear = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: gearApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gears'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Gear removed.');
    },
    onError: (e) => toast.error(e.response?.data?.message || e.message),
  });
};
