'use client';

export default function DebugEnv() {
  return (
    <div className="fixed bottom-0 left-0 bg-black p-2 text-white">
      <p>API URL: {process.env.NEXT_APP_BASE_URL || 'undefined'}</p>
      <p>Domain: {process.env.NEXT_PUBLIC_DOMAIN || 'undefined'}</p>
    </div>
  );
}
