import type { Metadata } from 'next';
import { YoujiClockApp } from './YoujiClockApp';

export const metadata: Metadata = {
  title: '🕐 とけいをよもう！ | TANQラボ',
  description: '幼稚園児向け時計学習アプリ',
};

export default function ClockPage() {
  return (
    <main>
      <YoujiClockApp />
    </main>
  );
}
