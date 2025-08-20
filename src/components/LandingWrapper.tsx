'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const LandingPage = dynamic(() => import('./LandingPage'), {
  ssr: false,
  loading: () => <div className="text-white text-center mt-10">Loading...</div>,
});

export default function LandingWrapper() {
  return <LandingPage />;
}