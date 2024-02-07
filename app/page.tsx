import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center mt-96">
      <Link href={`/characters`}>
        <h1 className="items-center justify-center font-extrabold text-2xl hover:underline">Click to view Marvel Characters</h1>
      </Link>
    </div>
  );
}


