// @ts-check
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { schedule } from 'node-cron';

export function scheduleTimerPrint() {
  schedule('* * * * *', () => console.log(`[${new Date().toLocaleTimeString()}] - Executei!`));
}

export function scheduleTimer() {
  const message = `[${new Date().getUTCHours()}:${new Date().getUTCMinutes()}:${new Date().getUTCSeconds()}] - Executei!`;

  return schedule('* * * * *', () => message);
}

export function scheduleTimerPrint7AM() {
  schedule('0 0 7 * * *', () => console.log(`[${new Date().toLocaleTimeString()}] - Executei!`));
}

describe('cron-job', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2021-01-01T00:00:00').getTime());
  });

  afterEach(async () => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('cron', () => {
    it('should execute cron job after 1 minute', async () => {
      const logSpy = vi.spyOn(console, 'log');

      scheduleTimerPrint(); // Start cronjob
      vi.advanceTimersByTime(1000 * 60 * 1); // Fast-forward time by 2 minutes

      expect(logSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy.mock.calls[0][0]).toBe('[00:01:00] - Executei!');

      logSpy.mockRestore();
    });
    
    describe("7AM", () => {
      it('should execute cron job at 7AM', async () => {
        const logSpy = vi.spyOn(console, 'log');
  
        scheduleTimerPrint7AM(); // Start cronjob
        vi.advanceTimersByTime(1000 * 60 * 60 * 7); // Fast-forward time to 7AM
  
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy.mock.calls[0][0]).toBe('[07:00:00] - Executei!');
  
        logSpy.mockRestore();
      });
      
      it('should execute cron job everyday', async () => {
        const logSpy = vi.spyOn(console, 'log');
  
        scheduleTimerPrint7AM(); // Start cronjob
        vi.advanceTimersByTime(1000 * 60 * 60 * 7); // Fast-forward time to 7AM
        vi.advanceTimersByTime(1000 * 60 * 60 * 24); // Fast-forward time to 1 day
        vi.advanceTimersByTime(1000 * 60 * 60 * 24); // Fast-forward time to 1 day
  
        expect(logSpy).toHaveBeenCalledTimes(3);
        expect(logSpy.mock.calls[0][0]).toBe('[07:00:00] - Executei!');
  
        logSpy.mockRestore();
      });
    })
    

    it.skip('should print time in [hh:mm:ss] format', async () => {
      const timerFunction = scheduleTimer(); // Start the cron job

      vi.advanceTimersByTime(60000); // Fast-forward time by one minute

      expect(timerFunction.now()).toMatch(/\[00:01:00\] - Executei!/);
    });
  });
});
