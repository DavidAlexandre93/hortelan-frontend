import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BrandSplash, { SPLASH_DURATION_MS } from './BrandSplash';

describe('BrandSplash', () => {
  afterEach(() => vi.useRealTimers());

  it('finishes after the bounded intro duration', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    render(<BrandSplash onFinish={onFinish} />);

    expect(screen.getByRole('status', { name: 'Preparando a Hortelan' })).toBeInTheDocument();
    expect(onFinish).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(SPLASH_DURATION_MS));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('allows the user to skip immediately', async () => {
    const onFinish = vi.fn();
    render(<BrandSplash onFinish={onFinish} />);
    await userEvent.click(screen.getByRole('button', { name: 'Pular introducao' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('clears its timer when unmounted', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    const view = render(<BrandSplash onFinish={onFinish} />);
    view.unmount();
    act(() => vi.advanceTimersByTime(SPLASH_DURATION_MS));
    expect(onFinish).not.toHaveBeenCalled();
  });
});
