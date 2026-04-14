import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let intersectionCallback: IntersectionObserverCallback | null = null;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockUnobserve = vi.fn();
    mockDisconnect = vi.fn();

    // Mock IntersectionObserver
    window.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return ref and initial isIntersecting false', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current[0].current).toBeNull();
    expect(result.current[1]).toBe(false);
  });

  it('should observe element when ref is set', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Create a mock element
    const mockElement = document.createElement('div');

    act(() => {
      result.current[0].current = mockElement;
    });

    // Force re-render to trigger useEffect
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('should update isIntersecting when intersection occurs', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Create a mock element
    const mockElement = document.createElement('div');

    act(() => {
      result.current[0].current = mockElement;
    });

    // Simulate intersection
    act(() => {
      if (intersectionCallback) {
        intersectionCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      }
    });

    expect(result.current[1]).toBe(true);
  });

  it('should unobserve after triggerOnce', () => {
    const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: true }));

    const mockElement = document.createElement('div');

    act(() => {
      result.current[0].current = mockElement;
    });

    // Simulate intersection
    act(() => {
      if (intersectionCallback) {
        intersectionCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      }
    });

    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
  });

  it('should pass custom options to IntersectionObserver', () => {
    const customOptions = {
      threshold: 0.5,
      root: document.createElement('div'),
      rootMargin: '10px',
    };

    renderHook(() => useIntersectionObserver(customOptions));

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      customOptions
    );
  });
});
