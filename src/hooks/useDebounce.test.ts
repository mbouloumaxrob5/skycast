import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    let value = 'initial';
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    // Change value
    value = 'changed';
    rerender();

    // Should still be initial immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now should be changed
    await waitFor(() => {
      expect(result.current).toBe('changed');
    });
  });

  it('should reset timer on rapid changes', async () => {
    let value = 'a';
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    // Rapid changes
    value = 'b';
    rerender();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    value = 'c';
    rerender();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should still be 'a' because timer was reset
    expect(result.current).toBe('a');

    // Complete the delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe('c');
    });
  });
});
