# React Query Hooks - Quick Reference

**Location:** `src/hooks/queries/`

---

## Available Hooks

### Call Logs (`useCallLogs.ts`)

#### Queries

- **`useCallLogs(userId)`** - Fetch all call logs for a user
- **`useRecentCallLogs(userId, limit)`** - Fetch recent N call logs
- **`useCallLogStats(userId)`** - Calculate aggregated statistics

#### Mutations

- **`useCreateCallLog()`** - Create a new call log entry
- **`useUpdateCallLog()`** - Update existing call log
- **`useDeleteCallLog()`** - Delete a call log

### User Settings (`useUserSettings.ts`)

#### Queries

- **`useUserSettings(userId)`** - Fetch user settings (with defaults)

#### Mutations

- **`useUpdateUserSettings()`** - Update/create user settings (upsert)

---

## Usage Examples

### Fetching Data

```typescript
import { useCallLogs } from '@/hooks/queries/useCallLogs';

const MyComponent = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useCallLogs(user?.id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.length} calls logged</div>;
};
```

### Creating Data

```typescript
import { useCreateCallLog } from '@/hooks/queries/useCallLogs';

const LogCallButton = () => {
  const { user } = useAuth();
  const createCallLog = useCreateCallLog();

  const handleClick = () => {
    createCallLog.mutate({
      user_id: user.id,
      start_time: new Date().toISOString(),
      duration_seconds: 300,
      earnings: 12.50,
      call_type: 'VRI',
    });
  };

  return (
    <button onClick={handleClick} disabled={createCallLog.isPending}>
      {createCallLog.isPending ? 'Saving...' : 'Log Call'}
    </button>
  );
};
```

### Statistics

```typescript
import { useCallLogStats } from '@/hooks/queries/useCallLogs';

const StatsDisplay = () => {
  const { user } = useAuth();
  const { data: stats } = useCallLogStats(user?.id);

  return (
    <div>
      <p>Total Calls: {stats?.totalCalls}</p>
      <p>Total Earnings: ${stats?.totalEarnings}</p>
      <p>Avg Duration: {stats?.avgCallDuration}s</p>
    </div>
  );
};
```

---

## Benefits

✅ **Automatic caching** - Data cached and reused  
✅ **Background refetching** - Keeps data fresh  
✅ **Optimistic updates** - Instant UI feedback  
✅ **Error handling** - Toast notifications built-in  
✅ **Loading states** - `isLoading`, `isPending` flags  
✅ **Type safety** - Full TypeScript support  

---

## Query Keys

Organized for easy invalidation:

```typescript
// Invalidate all call logs
queryClient.invalidateQueries({ queryKey: callLogKeys.all });

// Invalidate specific user's logs
queryClient.invalidateQueries({ queryKey: callLogKeys.list(userId) });

// Invalidate stats only
queryClient.invalidateQueries({ queryKey: callLogKeys.stats(userId) });
```
