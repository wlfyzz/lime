import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lime-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="mb-4">Oops! It seems you&apos;ve stumbled upon a page that doesn&apos;t exist.</p>
      <p className="mb-4">Please check the URL or try searching for what you&apos;re looking for.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
